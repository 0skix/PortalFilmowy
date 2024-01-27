// File: /app/api/auth/signup.ts
import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  // Parse the request body
  const { email, name, selectedCategories } = await req.json();

  // Validate input...
  if (!email || !name || !selectedCategories) {
    return new NextResponse(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Check if user already exists...
  const { data: existingUsers, error: existingUserError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);

  if (existingUserError) {
    return new NextResponse(
      JSON.stringify({ error: existingUserError.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (existingUsers.length > 0) {
    return new NextResponse(JSON.stringify({ error: "User already exists" }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Create user in Supabase...
  const { error: userError } = await supabase
    .from("users")
    .insert([{ email, name }]);

  if (userError) {
    return new NextResponse(JSON.stringify({ error: userError.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Explicitly type `categoryId` as a number
  const categoryInserts = selectedCategories.map((category: number) => ({
    user_email: email,
    user_category: category, // Assuming `category` is an object with an `id` property
  }));

  const { error: categoryError } = await supabase
    .from("user_categories")
    .insert(categoryInserts);

  if (categoryError) {
    return new NextResponse(
      JSON.stringify({ error: categoryError.message}),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Success...
  return new NextResponse(JSON.stringify({ message: "Signup successful" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
