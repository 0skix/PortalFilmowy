

import { create } from 'zustand';
import { createClient } from "contentful";
import { MovieCard } from '@/types/types';

const client = createClient({
    space: process.env.NEXT_PUBLIC_SPACE as string,
    accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN as string,
});


interface MovieState {
    movies: MovieCard[];
    filteredMovies: MovieCard[];
    loadingMovies: boolean; // Add the 'loading' property
    setMovies: (movies: MovieCard[]) => void;
    filterMovies: (searchTerm: string) => void;
    fetchMovies: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    movies: [],
    filteredMovies: [],
    loadingMovies: false,

    setLoadingMovies: (loadingMovies: boolean) => set({ loadingMovies }),

    setMovies: (movies: MovieCard[]) => set({ movies, filteredMovies: movies }),

    filterMovies: (searchTerm: string) => set((state) => ({
        filteredMovies: state.movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })),
    fetchMovies: async () => {
        set({ loadingMovies: true });
        try {
            const response = await client.getEntries({ content_type: 'movie' });
            const moviesData: MovieCard[] = response.items.reverse().map((item): MovieCard => {
                const imageUrl = (item.fields.poster as { fields: { file: { url: string } } })?.fields.file.url ? `https:${(item.fields.poster as { fields: { file: { url: string } } })?.fields.file.url}`
                    : "";
                return {
                    id: item.sys.id,
                    title: String(item.fields.title),
                    poster: imageUrl,
                    director: String(item.fields.director),
                    actors: [String(item.fields.actors)], // Fix: Change 'String' to '[String]'
                    genre: String(item.fields.genre),
                    releaseDate: new Date(String(item.fields.releaseDate)),
                    duration: item.fields.duration as number,
                    plot: String(item.fields.plot),
                };
            })
            set({ movies: moviesData, filteredMovies: moviesData });
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            set({ loadingMovies: false });
        }
    }
}));

