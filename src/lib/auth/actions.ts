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

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export const changeOwnPassword = async (formData: FormData) => {
  const currentPassword = text(formData.get("current_password"));
  const newPassword = text(formData.get("new_password"));
  const confirmPassword = text(formData.get("confirm_password"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Fill in all password fields.");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirmation do not match.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("You must be signed in.");
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    throw new Error("Current password is incorrect.");
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }
};
