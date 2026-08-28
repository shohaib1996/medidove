import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const handleSignOut = async (request: NextRequest) => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });

  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith("sb-"))
    .forEach((cookie) => {
      response.cookies.set(cookie.name, "", {
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      });
    });

  return response;
};

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}
