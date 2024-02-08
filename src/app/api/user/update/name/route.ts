
import supabase from "@/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  
  const { user_id, name } = await req.json();

  

  // Validate the input
  if (!user_id || typeof name !== 'string' || name.trim() === '') {
    return new NextResponse(JSON.stringify({ error: "Niepoprawny format nazwy." }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Perform the update
  const { data, error: updateError } = await supabase
    .from("users")
    .update({ name: name })
    .eq("id", user_id)
    .select();

  // Handle potential errors
  if (updateError) {
    return new NextResponse(JSON.stringify({ error: updateError.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // If the update was successful
  if (data) {
    return new NextResponse(JSON.stringify({ message: "Name updated successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    // If no rows were updated, for instance, if the user_id doesn't exist
    return new NextResponse(JSON.stringify({ error: "User not found or no changes made" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}