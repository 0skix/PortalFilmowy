"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Category, MovieCard } from '@/types/types';
import { useMovieStore } from '@/store/movieStore';
import Loading from '@/components/UI/Loading';
import MovieCardComponent from "@/components/MovieCardComponent";
import useUserStore from '@/store/userStore';
const Page = () => {
    const { status } = useSession();
    const router = useRouter();
    const { categories: userCategories } = useUserStore((state) => ({
        categories: state.categories,
    }));

    const { loadingMovies, fetchMovies, filteredMovies } = useMovieStore((state) => ({
        filteredMovies: state.filteredMovies,
        loadingMovies: state.loadingMovies,
        fetchMovies: state.fetchMovies,
    }));

    const [filteredAndRelatedMovies, setFilteredAndRelatedMovies] = useState<MovieCard[]>([]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);


    useEffect(() => {
        if (userCategories.length > 0) {
            const relatedMovies = filteredMovies.filter((movie) =>
                userCategories.some(category => category.id === movie.category.fields.id)
            );
            setFilteredAndRelatedMovies(relatedMovies);
        }
    }, [filteredMovies, userCategories]);


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return <main className="flex min-h-screen flex-col items-center justify-between p-4"><h1>Loading</h1></main>;
    }

    return <main className="flex min-h-screen flex-col items-center justify-between p-4">
        {filteredAndRelatedMovies.length === 0 && !loadingMovies && (
            <p className=''>Brak filmów pasujących do wybranej kategorii.</p>
        )}
        <div className="flex gap-4 flex-wrap justify-center align-middle">
            {loadingMovies ? (
                <Loading />
            ) : (
                filteredAndRelatedMovies.map((movie: MovieCard) => (
                    <MovieCardComponent key={movie.id} movie={movie} onDelete={function (movieId: string): void {
                        throw new Error('Function not implemented.');
                    }} />
                ))
            )}
        </div>

    </main>
}

export default Page;