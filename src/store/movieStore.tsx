import { create } from "zustand";
import { createClient } from "contentful";
import { persist } from "zustand/middleware";
import { MovieCard } from "@/types/types";

interface MovieState {
    movies: MovieCard[];
    filteredMovies: MovieCard[];
    loadingMovies: boolean;
    currentMovie: MovieCard | null;
    setCurrentMovie: (movie: MovieCard | null) => void;
    setMovies: (movies: MovieCard[]) => void;
    filterMovies: (searchTerm: string) => void;
    fetchMovies: () => Promise<void>;
    fetchMovie: (movieId: string) => Promise<void>;
}

// Create a Contentful client instance
const client = createClient({
    space: process.env.NEXT_PUBLIC_SPACE as string,
    accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN as string,
});

// Helper function to get image URL
const getImageUrl = (imageField: {
    fields?: { file?: { url: string } };
}): string => {
    return imageField?.fields?.file?.url
        ? `https:${imageField.fields.file.url}`
        : "";
};

// Helper function to map the movie data
const mapContentfulMovie = (item: any): MovieCard => ({
    id: item.sys.id,
    title: String(item.fields.title),
    poster: getImageUrl(item.fields.poster),
    director: String(item.fields.director),
    actors: item.fields.actors ? item.fields.actors.map(String) : [],
    genre: String(item.fields.genre),
    releaseDate: new Date(String(item.fields.releaseDate)),
    duration: Number(item.fields.duration),
    plot: String(item.fields.plot),
});

// Create the store with Zustand
export const useMovieStore = create<MovieState>()(
    persist(
        (set) => ({
            movies: [],
            filteredMovies: [],
            loadingMovies: false,
            currentMovie: null,
            setCurrentMovie: (movie: MovieCard | null) =>
                set({ currentMovie: movie }),
            setMovies: (movies: MovieCard[]) =>
                set({ movies, filteredMovies: movies }),
            filterMovies: (searchTerm: string) =>
                set((state) => ({
                    filteredMovies: state.movies.filter((movie) =>
                        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                })),
            fetchMovies: async () => {
                set({ loadingMovies: true });
                try {
                    const response = await client.getEntries({ content_type: "movie" });
                    const moviesData = response.items.reverse().map(mapContentfulMovie);
                    set({ movies: moviesData, filteredMovies: moviesData });
                } catch (error) {
                    console.error("Error fetching movies:", error);
                } finally {
                    set({ loadingMovies: false });
                }
            },
            fetchMovie: async (movieId: string) => {
                set({ loadingMovies: true });
                try {
                    const response = await client.getEntries({
                        content_type: "movie",
                        "sys.id": movieId,
                    });
                    const movie =
                        response.items.length > 0
                            ? mapContentfulMovie(response.items[0])
                            : null;
                    set({ currentMovie: movie });
                } catch (error) {
                    console.error("Error fetching the movie:", error);
                } finally {
                    set({ loadingMovies: false });
                }
            },
        }),
        {
            name: "movie-storage",
            getStorage: () => localStorage,
            partialize: (state) => ({
                movies: state.movies,
                currentMovie: state.currentMovie,
            }),
        }
    )
);
