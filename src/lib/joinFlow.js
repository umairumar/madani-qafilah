import { supabase } from "./supabaseClient";

export function parseJoinEventId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("join");
}

export function clearJoinParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete("join");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}

export function setJoinParam(eventId) {
  const url = new URL(window.location.href);
  url.searchParams.set("join", eventId);
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}

export function parseJoinResult(data) {
  if (!data) throw new Error("Could not join group. Please try again.");
  let parsed = data;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new Error("Could not join group. Please try again.");
    }
  }
  const groupId = parsed.group_id ?? parsed.groupId;
  if (!groupId) throw new Error("Could not join group. Please try again.");
  return { ...parsed, group_id: groupId };
}

export async function joinQafilahGroup(eventId) {
  const { data, error } = await supabase.rpc("join_qafilah_group", { p_event_id: eventId });
  if (error) throw error;
  return parseJoinResult(data);
}

export async function transferQafilahAmeer(groupId, newAmeerUserId) {
  const { error } = await supabase.rpc("transfer_qafilah_ameer", {
    p_group_id: groupId,
    p_new_ameer_user_id: newAmeerUserId,
  });
  if (error) throw error;
}
