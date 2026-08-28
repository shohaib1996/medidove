import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const redirectToRegister = (request: Request, message: string) => {
  const url = new URL("/register", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || !password) {
    return redirectToRegister(request, "Name, email, and password are required.");
  }

  if (password.length < 6) {
    return redirectToRegister(request, "Password must be at least 6 characters.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: new URL("/auth/callback?next=/portal", request.url).toString(),
    },
  });

  if (error) {
    return redirectToRegister(request, error.message);
  }

  if (data.session) {
    return NextResponse.redirect(new URL("/portal", request.url), {
      status: 303,
    });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "status",
    "Account created. Check your email to confirm your account.",
  );

  return NextResponse.redirect(loginUrl, {
    status: 303,
  });
}
