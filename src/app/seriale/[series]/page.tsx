"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSeriesStore } from "@/store/seriesStore"; // Update the import path as needed
import CommentsList from "@/components/CommentsList";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const SeriesDetails = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const seriesId = pathname?.split("/").pop() || ""; // Assuming the path is something like '/series/[seriesId]'
    const { currentSeries, fetchSingleSeries } = useSeriesStore((state) => ({
        currentSeries: state.currentSeries,
        fetchSingleSeries: state.fetchSingleSeries,
    }));
    const [isClient, setIsClient] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const deleteRating = async () => {
        if (!session || !session.user?.id) {
            console.error("You must be logged in to delete a rating.");
            return;
        }

        const response = await fetch(`/api/ratings/delete?contentId=${seriesId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "user-id": session.user.id, // Sending the user ID in the request headers
            },
        });

        if (response.ok) {
            console.log("Rating deleted successfully");
            setUserRating(0);
            setHasRated(false);
            // Optionally, re-fetch ratings to update average rating
            fetchRatingData(seriesId);
        } else {
            const result = await response.json();
            console.error("Error deleting rating:", result.error);
        }
    };

    const fetchRatingData = async (contentId: string) => {
        const userId = session?.user?.id || "";

        const headers = userId
            ? {
                "Content-Type": "application/json",
                "user-id": userId,
            }
            : {
                "Content-Type": "application/json",
            };

        const response = await fetch(`/api/ratings/get?contentId=${contentId}`, {
            method: "GET",
            headers: headers as HeadersInit,
        });

        if (!response.ok) {
            console.error("Error fetching rating:", response.statusText);
            return;
        }

        const data = await response.json();
        setAverageRating(data.averageRating || 0);
        setUserRating(data.userRating);
        setHasRated(data.hasRated);
    };

    const handleRating = async (ratingValue: number) => {
        if (!session) {
            console.error("You must be logged in to rate.");
            return;
        }

        const userId = session.user?.id;
        if (!userId) {
            console.error("Error: No user ID found.");
            return;
        }

        if (hasRated) {
            console.error("You have already rated this movie.");
            return;
        }

        setUserRating(ratingValue);
        const ratingData = {
            content_id: seriesId,
            user_id: userId,
            rating: ratingValue,
        };

        const response = await fetch("/api/ratings/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ratingData),
        });

        if (response.ok) {
            toast.success("Rating added!");
            fetchRatingData(seriesId);
        } else {
            toast.error("Error adding rating.");
            setUserRating(0);
        }
    };

    useEffect(() => {
        fetchSingleSeries(seriesId);

        setIsClient(true);
        if (session !== undefined) {
            fetchRatingData(seriesId);
        }
    }, [session]);

    if (!currentSeries || currentSeries.id !== seriesId || !isClient) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-4">
                <h1 className="text-4xl">Loading...</h1>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-1 min-h-[100vh]">
            <div className="card lg:card-side bg-base-100 shadow-xl max-h-[90vh]">
                <figure className="md:w-1/3 bg-black">
                    <Image
                        src={currentSeries.coverImage}
                        alt={currentSeries.title}
                        width={400}
                        height={400}
                    />
                </figure>
                <div className="card-body md:w-2/3 overflow-auto max-h-[100%]">
                    <h2 className="card-title">{currentSeries.title}</h2>
                    <p>
                        <strong>Description:</strong> {currentSeries.description}
                    </p>
                    <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(currentSeries.startDate).toDateString()}
                    </p>
                    <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(currentSeries.endDate).toDateString()}
                    </p>
                    <p>
                        <strong>Episodes:</strong> {currentSeries.episodes}
                    </p>
                    <div className="rating">
                        <p>Average Rating: {averageRating}</p>
                        <div>
                            {[...Array(5)].map((_, i) => (
                                <input
                                    key={i}
                                    type="radio"
                                    name="rating"
                                    className={`mask mask-star-2 ${userRating > i ? "bg-orange-400" : "bg-gray-300"
                                        }`}
                                    checked={userRating === i + 1}
                                    onChange={() => handleRating(i + 1)}
                                    disabled={hasRated}
                                />
                            ))}
                        </div>
                        {hasRated && (
                            <button onClick={deleteRating} className="btn btn-xs btn-danger ">
                                Delete My Rating
                            </button>
                        )}
                    </div>
                    <CommentsList contentId={seriesId} />
                </div>
            </div>
        </main>
    );
};

export default SeriesDetails;
