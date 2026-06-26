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

export async function joinQafilahGroup(eventId) {
  const { data, error } = await supabase.rpc("join_qafilah_group", { p_event_id: eventId });
  if (error) throw error;
  return data;
}

export async function transferQafilahAmeer(groupId, newAmeerUserId) {
  const { error } = await supabase.rpc("transfer_qafilah_ameer", {
    p_group_id: groupId,
    p_new_ameer_user_id: newAmeerUserId,
  });
  if (error) throw error;
}
