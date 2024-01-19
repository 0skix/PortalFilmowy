"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useMovieStore } from "@/store/store";
import { deleteMovieEntry } from "@/utils/MovieServices";
import { toast } from "react-toastify";
import { MovieCard } from "@/types/types";
import Loading from "@/components/UI/Loading";

const MoviesPage = () => {
    const { filteredMovies, fetchMovies, setMovies, loadingMovies } = useMovieStore((state) => ({
        filteredMovies: state.filteredMovies,
        fetchMovies: state.fetchMovies,
        setMovies: state.setMovies,
        loadingMovies: state.loadingMovies,
    }));

    const notify = () => toast("Film został usunięty");
    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleDelete = async (movieId: string) => {
        try {
            await deleteMovieEntry(movieId);
            const filteredArray = (currentMovies: MovieCard[]) =>
                currentMovies.filter((movie) => movie.id !== movieId);
            setMovies(filteredArray(filteredMovies));
            notify();
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };


    return (
        <main className="flex min-h-screen  flex-col items-center justify-between p-4">
            <div className="flex gap-4 flex-wrap justify-center align-middle">
                {!loadingMovies ? filteredMovies.map((movie: MovieCard, index) => (
                    <div key={index} className="card bg-base-100 w-[18rem] h-[35rem] shadow-xl p-1 flex ">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
                            onClick={() => handleDelete(movie.id)} // Assuming 'movie.sys.id' is where the ID is stored
                        >
                            ✕
                        </button>
                        <div className="relative h-[100%] w-[100%">
                            <Image
                                objectFit="cover"
                                src={movie.poster}
                                alt={movie.title}
                                fill={true}
                                sizes="100%"
                                priority={true}
                            />
                        </div>
                        <div className="">
                            <h2 className="card-title center p-1 flex justify-center align-middle text-center">
                                {movie.title}
                            </h2>
                        </div>
                    </div>
                )) : <Loading />
                }
            </div >
        </main >
    );
};

export default MoviesPage;
