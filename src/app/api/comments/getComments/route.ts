import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const contentId = url.searchParams.get("contentId");

  if (!contentId) {
    return new NextResponse(
      JSON.stringify({ error: "Missing content ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .select(`
    id,
    comment,
    created_at,
    user:users (name, id)
    `)
    .eq("content_id", contentId);

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}