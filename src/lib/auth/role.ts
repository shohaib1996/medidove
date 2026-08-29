import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export const resolveRoleDestination = async (
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin" ? "/admin" : "/portal";
};
