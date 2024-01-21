'use client';
import { useMovieStore } from '@/store/movieStore';
import { usePathname } from 'next/navigation';

import React, { useEffect, useState } from 'react'

const MovieDetails = () => {
    const pathname = usePathname()
    const movieId = pathname?.split('/').pop() || '';
    const { currentMovie, fetchMovie } = useMovieStore((state) => ({
        currentMovie: state.currentMovie,
        fetchMovie: state.fetchMovie,
    }));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        fetchMovie(movieId)
        setIsClient(true);
    }, [fetchMovie, movieId]);
    if (!currentMovie || currentMovie.id !== movieId || !isClient) {

        return <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <h1 className="text-4xl">Loading...</h1>
        </main>;
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <h1 className="text-4xl">działa</h1>
        </main>
    )
}

export default MovieDetails