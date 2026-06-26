import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { joinQafilahGroup } from "../lib/joinFlow";
import { normalizeTripState } from "../lib/groupState";

const GroupContext = createContext(null);

async function fetchGroupMembers(groupId) {
  const { data: members, error } = await supabase
    .from("qafilah_group_members")
    .select("user_id, role, joined_at")
    .eq("group_id", groupId);

  if (error) throw error;
  if (!members?.length) return [];

  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p.display_name]));

  return members.map((m) => ({
    userId: m.user_id,
    role: m.role,
    displayName: profileMap[m.user_id] || "Brother",
    joinedAt: m.joined_at,
  }));
}

async function fetchGroupBundle(groupId) {
  const { data: group, error: groupError } = await supabase
    .from("qafilah_groups")
    .select("id, event_id, status, city, ameer_user_id, created_at")
    .eq("id", groupId)
    .single();

  if (groupError) throw groupError;

  const { data: event } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at, city, image_url")
    .eq("id", group.event_id)
    .single();

  const { data: stateRow, error: stateError } = await supabase
    .from("qafilah_group_state")
    .select("state")
    .eq("group_id", groupId)
    .single();

  if (stateError) throw stateError;

  const members = await fetchGroupMembers(groupId);
  const brotherNames = members.map((m) => m.displayName);

  const tripState = normalizeTripState(stateRow.state);
  tripState.brothers = brotherNames;

  return { group, event, members, tripState };
}

export function GroupProvider({ children }) {
  const { user, isSignedIn } = useAuth();
  const [mode, setMode] = useState("solo");
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);
  const [groupTripState, setGroupTripState] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const persistTimer = useRef(null);

  const loadMyGroups = useCallback(async () => {
    if (!user) {
      setMyGroups([]);
      return;
    }

    const { data: memberships, error } = await supabase
      .from("qafilah_group_members")
      .select("group_id, role")
      .eq("user_id", user.id);

    if (error || !memberships?.length) {
      setMyGroups([]);
      return;
    }

    const groupIds = memberships.map((m) => m.group_id);
    const { data: groups } = await supabase
      .from("qafilah_groups")
      .select("id, event_id, status, city, created_at")
      .in("id", groupIds)
      .in("status", ["planning", "active"]);

    if (!groups?.length) {
      setMyGroups([]);
      return;
    }

    const eventIds = groups.map((g) => g.event_id);
    const { data: events } = await supabase
      .from("events")
      .select("id, title, starts_at, image_url")
      .in("id", eventIds);

    const eventMap = Object.fromEntries((events || []).map((e) => [e.id, e]));
    const roleMap = Object.fromEntries(memberships.map((m) => [m.group_id, m.role]));

    setMyGroups(
      groups
        .map((g) => ({
          ...g,
          event: eventMap[g.event_id],
          role: roleMap[g.id],
        }))
        .sort((a, b) => new Date(a.event?.starts_at || 0) - new Date(b.event?.starts_at || 0))
    );
  }, [user]);

  useEffect(() => {
    loadMyGroups();
  }, [loadMyGroups, isSignedIn]);

  const activateGroup = useCallback(async (groupId) => {
    setLoadingGroup(true);
    try {
      const bundle = await fetchGroupBundle(groupId);
      const myMembership = bundle.members.find((m) => m.userId === user?.id);
      setActiveGroupId(groupId);
      setActiveGroup(bundle.group);
      setActiveEvent(bundle.event);
      setMembers(bundle.members);
      setRole(myMembership?.role || null);
      setGroupTripState(bundle.tripState);
      setMode("group");
    } finally {
      setLoadingGroup(false);
    }
  }, [user]);

  const switchToSolo = useCallback(() => {
    setMode("solo");
    setActiveGroupId(null);
    setActiveGroup(null);
    setActiveEvent(null);
    setMembers([]);
    setRole(null);
    setGroupTripState(null);
  }, []);

  const joinGroup = useCallback(async (eventId) => {
    const result = await joinQafilahGroup(eventId);
    await loadMyGroups();
    await activateGroup(result.group_id);
    return result;
  }, [activateGroup, loadMyGroups]);

  const switchGroup = useCallback(async (groupId) => {
    await activateGroup(groupId);
  }, [activateGroup]);

  const persistGroupState = useCallback((payload) => {
    if (!activeGroupId || !user) return;

    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(async () => {
      const brothersFromMembers = members.map((m) => m.displayName);
      const stateToSave = {
        ...payload,
        brothers: brothersFromMembers.length ? brothersFromMembers : payload.brothers,
      };

      await supabase
        .from("qafilah_group_state")
        .update({
          state: stateToSave,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("group_id", activeGroupId);
    }, 400);
  }, [activeGroupId, user, members]);

  const transferAmeer = useCallback(async (newAmeerUserId) => {
    if (!activeGroupId) return;
    const { transferQafilahAmeer } = await import("../lib/joinFlow");
    await transferQafilahAmeer(activeGroupId, newAmeerUserId);
    await activateGroup(activeGroupId);
    await loadMyGroups();
  }, [activeGroupId, activateGroup, loadMyGroups]);

  const refreshActiveGroup = useCallback(async () => {
    if (activeGroupId) await activateGroup(activeGroupId);
  }, [activeGroupId, activateGroup]);

  return (
    <GroupContext.Provider
      value={{
        mode,
        isGroupMode: mode === "group",
        activeGroupId,
        activeGroup,
        activeEvent,
        members,
        role,
        isAdmin: role === "admin",
        groupTripState,
        setGroupTripState,
        myGroups,
        loadingGroup,
        joinGroup,
        switchGroup,
        switchToSolo,
        persistGroupState,
        transferAmeer,
        loadMyGroups,
        refreshActiveGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used within GroupProvider");
  return ctx;
}
