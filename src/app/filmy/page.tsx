"use client"
import React, { useCallback, useEffect, useState } from "react";
import { useMovieStore } from "@/store/movieStore";
import { deleteMovieEntry } from "@/utils/MovieServices";
import { toast } from "react-toastify";
import { MovieCard } from "@/types/types";
import Loading from "@/components/UI/Loading";
import MovieCardComponent from "@/components/MovieCardComponent";

const MoviesPage: React.FC = () => {
    const { filteredMovies, setMovies, loadingMovies, fetchMovies } = useMovieStore((state) => ({
        filteredMovies: state.filteredMovies,
        setMovies: state.setMovies,
        loadingMovies: state.loadingMovies,
        fetchMovies: state.fetchMovies,
    }));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(10);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const indexOfLastMovie: number = currentPage * moviesPerPage;
    const indexOfFirstMovie: number = indexOfLastMovie - moviesPerPage;
    const currentMovies: MovieCard[] = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    const totalPages: number = Math.ceil(filteredMovies.length / moviesPerPage);

    const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

    const nextPage = (): void => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = (): void => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = useCallback(
        async (movieId: string) => {
            const notify = () => toast("Film został usunięty");
            try {
                await deleteMovieEntry(movieId);
                const filteredArray = (currentMovies: MovieCard[]): MovieCard[] =>
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
                    currentMovies.map((movie: MovieCard) => (
                        <MovieCardComponent key={movie.id} movie={movie} onDelete={handleDelete} />
                    ))
                )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={prevPage} className="btn btn-sm btn-circle">
                    «
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button key={number} onClick={() => paginate(number)} className={`btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}>
                        {number}
                    </button>
                ))}
                <button onClick={nextPage} className="btn btn-sm btn-circle">
                    »
                </button>
            </div>
        </main>
    );
};

export default MoviesPage;