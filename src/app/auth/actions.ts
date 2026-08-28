"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const getOrigin = async () => {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  return host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_SITE_URL || "";
};

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string,
) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/portal`,
    },
  });

  if (error) {
    return { error: error.message, needsConfirmation: false };
  }

  return {
    error: null,
    needsConfirmation: !data.session,
  };
}

export async function sendPasswordReset(email: string, origin: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/login`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
