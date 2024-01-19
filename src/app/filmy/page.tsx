"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import Image from "next/image";
import { useMovieStore } from "@/store/store";
import { deleteMovieEntry } from "@/utils/MovieServices";
import Loading from "@/components/UI/Loading";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/UI/Toast";

const client = createClient({
    space: process.env.NEXT_PUBLIC_SPACE as string,
    accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN as string,
});



export type Movie = {
    id: string;
    title: string;
    poster: string;
};

const MoviesPage = () => {
    const { filteredMovies, setMovies } = useMovieStore((state) => ({
        filteredMovies: state.filteredMovies,
        setMovies: state.setMovies,
    }));
    const { toasts, addToast, removeToast } = useToast();

    // Example function to show a toast
    const showSuccessToast = () => {
        addToast({ type: 'success', text: 'Film został usunięty' });
    };

    useEffect(() => {
        const fetchMovies = async () => {

            try {
                const response = await client.getEntries({ content_type: 'movie' });
                const moviesData: Movie[] = response.items.map((item): Movie => {
                    const imageUrl = (item.fields.poster as { fields: { file: { url: string } } })?.fields.file.url ? `https:${(item.fields.poster as { fields: { file: { url: string } } })?.fields.file.url}`
                        : "";
                    return {
                        id: item.sys.id,
                        title: String(item.fields.title),
                        poster: imageUrl,
                    };
                })
                setMovies(moviesData);

            } catch (error) {
                console.error("Error fetching movies:", error);
            }

        };
        fetchMovies();
    }, [setMovies]);


    const handleDelete = async (movieId: string) => {

        try {
            await deleteMovieEntry(movieId);
            const filteredArray = (currentMovies: Movie[]) => currentMovies.filter((movie) => movie.id !== movieId);
            setMovies(filteredArray(filteredMovies));
            showSuccessToast();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="flex gap-4 flex-wrap">
                {filteredMovies.map((movie: Movie, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl p-1">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => handleDelete(movie.id)} // Assuming 'movie.sys.id' is where the ID is stored
                        >✕</button>
                        <figure>
                            <Image width={300} height={300} src={movie.poster} alt={movie.title} />
                        </figure>
                        <div className="">
                            <h2 className="card-title center p-1 flex justify-center align-middle text-center">{movie.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <Toast messages={toasts} removeToast={removeToast} />
        </main>
    );
};

export default MoviesPage;
