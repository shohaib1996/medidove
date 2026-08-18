import { NextResponse, type NextRequest } from "next/server";
import { runAutomationRules } from "@/lib/automations/runner";

const isAuthorized = (request: NextRequest) => {
  const secret = process.env.AUTOMATION_RUN_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const headerSecret = request.headers.get("x-automation-secret");

  return bearer === secret || headerSecret === secret;
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutomationRules();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Automation runner failed.",
      },
      { status: 500 },
    );
  }
};
