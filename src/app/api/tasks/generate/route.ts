import { NextResponse, type NextRequest } from "next/server";
import { generateCareTasksFromSignals } from "@/lib/tasks/generator";

const isAuthorized = (request: NextRequest) => {
  const secret =
    process.env.TASK_GENERATION_SECRET || process.env.AUTOMATION_RUN_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const headerSecret = request.headers.get("x-task-secret");

  return bearer === secret || headerSecret === secret;
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateCareTasksFromSignals();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Care task generation failed.",
      },
      { status: 500 },
    );
  }
};
