'use client';
import CommentsList from '@/components/CommentsList';
import CommentForm from '@/components/Forms/CommentForm';
import { useMovieStore } from '@/store/movieStore';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import React, { useEffect, useState } from 'react'

const MovieDetails = () => {
    const { data: session } = useSession();
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


    if (!currentMovie || currentMovie.id !== movieId || !isClient || session === null) {
        return <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <h1 className="text-4xl">Loading...</h1>
        </main>;
    }
    return (
        <main className="flex min-h-screen flex-col items-center  p-4">
            <CommentsList contentId={movieId} />
            <CommentForm contentId={movieId} />
        </main>
    )
}

export default MovieDetails