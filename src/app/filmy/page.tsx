"use client";
import React, { useCallback, useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { deleteMovieEntry } from "@/utils/MovieServices";
import { toast } from "react-toastify";
import { MovieCard } from "@/types/types";
import Loading from "@/components/UI/Loading";
import MovieCardComponent from "@/components/MovieCardComponent";

const MoviesPage = () => {
    const { filteredMovies, setMovies, loadingMovies, fetchMovies } =
        useMovieStore((state) => ({
            filteredMovies: state.filteredMovies,
            setMovies: state.setMovies,
            loadingMovies: state.loadingMovies,
            fetchMovies: state.fetchMovies,
        }));

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleDelete = useCallback(
        async (movieId: string) => {
            const notify = () => toast("Film został usunięty");
            try {
                await deleteMovieEntry(movieId);
                const filteredArray = (currentMovies: MovieCard[]) =>
                    currentMovies.filter((movie) => movie.id !== movieId);
                setMovies(filteredArray(filteredMovies));
                notify();
            } catch (error) {
                console.error("Error deleting movie:", error);
            }
        },
        [setMovies, filteredMovies]
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="flex gap-4 flex-wrap justify-center align-middle">
                {loadingMovies ? (
                    <Loading />
                ) : (
                    filteredMovies.map((movie) => (
                        <MovieCardComponent
                            key={movie.id}
                            movie={movie}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </main>
    );
};

export default MoviesPage;
