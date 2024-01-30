'use client';
import CommentsList from '@/components/CommentsList';
import CommentForm from '@/components/Forms/CommentForm';
import { useMovieStore } from '@/store/movieStore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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


    if (!currentMovie || currentMovie.id !== movieId || !isClient) {
        return <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <h1 className="text-4xl">Loading...</h1>
        </main>;
    }
    return (
        <main className="container mx-auto p-1 min-h-[100vh]">
            <div className="card lg:card-side bg-base-100 shadow-xl max-h-[90vh] ">
                <figure className="md:w-1/3 bg-black">
                    <Image src={currentMovie.poster} alt={currentMovie.title} width={400} height={400} />
                </figure>
                <div className="card-body  overflow-auto  ">
                    <h2 className="text-2xl font-bold mb-2">{currentMovie.title}</h2>
                    <p className="mb-1"><strong>Director:</strong> {currentMovie.director}</p>
                    <p className="mb-1"><strong>Actors:</strong> {currentMovie.actors.join(', ')}</p>
                    <p className="mb-1"><strong>Genre:</strong> {currentMovie.genre}</p>
                    <p className="mb-1"><strong>Release Date:</strong> {new Date(currentMovie.releaseDate).toDateString()}</p>
                    <p className="mb-1"><strong>Duration:</strong> {currentMovie.duration} minutes</p>
                    <p className="mb-3"><strong>Plot:</strong> {currentMovie.plot}</p>
                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <input key={i} type="radio" name="rating-10" className="mask mask-star-2 bg-orange-400" />
                        ))}
                    </div>

                    <CommentsList contentId={movieId} />
                    {session && <CommentForm contentId={movieId} />}
                </div>
            </div>
        </main >
    )
}

export default MovieDetails