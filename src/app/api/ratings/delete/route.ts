import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const contentId = url.searchParams.get("contentId");
  const userId = req.headers.get("user-id"); // Get the user ID from headers

  if (!contentId || !userId) {
    return new NextResponse(
      JSON.stringify({ error: "Missing content ID or user ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const { error } = await supabase
      .from("ratings")
      .delete()
      .match({ content_id: contentId, user_id: userId });

    if (error) {
      throw error;
    }

    return new NextResponse(
      JSON.stringify({ message: "Rating deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
