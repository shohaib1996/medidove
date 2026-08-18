import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search/site-search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  try {
    const results = await searchSite(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Site search failed", error);

    return NextResponse.json(
      { error: "Search is temporarily unavailable." },
      { status: 500 },
    );
  }
}
