import { NextResponse, type NextRequest } from "next/server";
import { dispatchQueuedOutbox } from "@/lib/communications/dispatch";

const isAuthorized = (request: NextRequest) => {
  const secret =
    process.env.OUTBOX_DISPATCH_SECRET || process.env.AUTOMATION_RUN_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const headerSecret = request.headers.get("x-dispatch-secret");

  return bearer === secret || headerSecret === secret;
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

  try {
    const result = await dispatchQueuedOutbox(Number.isFinite(limit) ? limit : 20);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Outbox dispatch failed.",
      },
      { status: 500 },
    );
  }
};
