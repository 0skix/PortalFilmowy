import React, { useState } from 'react';
import Image from 'next/image';
import { MovieCard as MovieCardType } from '@/types/types';

import { useMovieStore } from '@/store/movieStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface MovieCardProps {
    movie: MovieCardType;
    onDelete: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = React.memo(({ movie, onDelete }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const router = useRouter();
    const setCurrentMovie = useMovieStore((state) => state.setCurrentMovie);
    const { data: session } = useSession();

    const handleClick = () => {
        setCurrentMovie(movie);
        router.push(`/filmy/${movie.id}`);
    };

    return (
        <div onClick={handleClick} className="card bg-base-100 w-[18rem]  shadow-xl p-1 flex">
            {session?.user?.role === "admin" && (<button
                className="btn btn-sm btn-circle absolute right-4 top-4 z-10"
                onClick={() => onDelete(movie.id)}
            >
                ✕
            </button>)}
            <div className="relative h-[100%] w-[100%]">
                {!imageLoaded && (
                    <div className="animate-pulse absolute bg-gray-200 h-full w-full"></div>
                )}
                {!movie.poster ? <div className="card-placeholder">No image available</div> : <Image
                    width={300}
                    height={300}
                    className='p-2'
                    src={movie.poster}
                    alt={movie.title}
                    sizes="100%"
                    priority={true}
                    onLoad={() => setImageLoaded(true)}
                />}
            </div>
            <div className="">
                <h2 className="card-title center p-1 flex justify-center align-middle text-center">
                    {movie.title}
                </h2>
            </div>
        </div>
    );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;