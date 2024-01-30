import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const { content_id, user_id, rating } = await req.json();

  if (!content_id || !user_id || rating == null) {
    return new NextResponse(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data: existingRatings, error: ratingError } = await supabase
  .from("ratings")
  .select("id")
  .eq("content_id", content_id)
  .eq("user_id", user_id);

if (ratingError) {
  return new NextResponse(JSON.stringify({ error: ratingError.message }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// If one or more ratings are found, the user has already rated this content
if (existingRatings.length > 0) {
  return new NextResponse(JSON.stringify({ error: "User has already rated this content" }), {
    status: 409,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

  // Insert the new rating
  const { error: insertError } = await supabase
    .from("ratings")
    .insert([{ content_id, user_id, rating }]);

  if (insertError) {
    return new NextResponse(JSON.stringify({ error: insertError.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: "Rating added successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}