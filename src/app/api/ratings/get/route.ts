import supabase from "../../../../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const contentId = url.searchParams.get("contentId");
  const userId = req.headers.get('user-id'); // Assuming the user ID is passed in the request header
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

  try {
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("rating")
      .eq("content_id", contentId);

    if (ratingsError) {
      throw ratingsError;
    }

    // Calculate the average rating
    let averageRating = 0;
    if (ratings.length > 0) {
      averageRating = ratings.reduce((acc, { rating }) => acc + rating, 0) / ratings.length;
    }

    // Check if the logged-in user has already voted
    const userVote = userId
      ? await supabase
          .from("ratings")
          .select("rating")
          .eq("content_id", contentId)
          .eq("user_id", userId)
          .single()
      : null;
     
    // Construct the response object
    const response = {
      averageRating,
      totalRatings: ratings.length,
      userRating: userVote?.data ? userVote.data.rating : null,
      hasRated: userVote?.data ? true : false,
    };

    return new NextResponse(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}