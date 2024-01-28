import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  // Parsowanie danych żądania
  const { commentId, userId, isAdmin } = await req.json();

  if (!commentId || !userId) {
    return new NextResponse(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Pobieranie komentarza do usunięcia
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !comment) {
    return new NextResponse(JSON.stringify({ error: "Comment not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Sprawdzenie, czy użytkownik jest administratorem lub autorem komentarza
  if (comment.user_id !== userId && !isAdmin) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Usuwanie komentarza
  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .match({ id: commentId });

  if (deleteError) {
    return new NextResponse(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: "Comment deleted successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}