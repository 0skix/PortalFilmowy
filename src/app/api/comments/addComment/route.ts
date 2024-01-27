// File: /app/api/comments/add.ts
import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const { content_id, user_id, comment } = await req.json();

  if (!content_id || !user_id || !comment) {
    return new NextResponse(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const { error: commentError } = await supabase
    .from("comments")
    .insert([{ content_id, user_id, comment }]);

  if (commentError) {
    return new NextResponse(JSON.stringify({ error: commentError.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: "Comment added successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}