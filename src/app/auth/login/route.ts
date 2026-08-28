import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const redirectToLogin = (request: Request, key: "error" | "status", message: string) => {
  const url = new URL("/login", request.url);
  url.searchParams.set(key, message);
  return NextResponse.redirect(url, { status: 303 });
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "login");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  if (!email) {
    return redirectToLogin(request, "error", "Email is required.");
  }

  if (intent === "reset") {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("/login", request.url).toString(),
    });

    if (error) {
      return redirectToLogin(request, "error", error.message);
    }

    return redirectToLogin(request, "status", "Password reset email sent.");
  }

  if (!password) {
    return redirectToLogin(request, "error", "Password is required.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirectToLogin(request, "error", error.message);
  }

  return NextResponse.redirect(new URL("/portal", request.url), {
    status: 303,
  });
}
