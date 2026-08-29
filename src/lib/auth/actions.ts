"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveRoleDestination } from "@/lib/auth/role";

export const getBookDestination = async (): Promise<string> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  return resolveRoleDestination(supabase, user.id);
};
