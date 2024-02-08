import supabase from "@/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const { category_id, user_email} = await req.json();
  console.log(category_id, user_email)


  // Validate category_id
  if (!category_id) {
    return new NextResponse(JSON.stringify({ error: "Category ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Perform the delete operation
  const { data, error } = await supabase
    .from("user_categories")
    .insert([
    { user_email: user_email, user_category: category_id },
    ])
  .select()
  // Handle potential errors
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // If the delete operation was successful
  if (data) {
    return new NextResponse(JSON.stringify({ message: "Category deleted successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    // If no rows were deleted, for instance, if the category_id doesn't exist
    return new NextResponse(JSON.stringify({ error: "Category not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}