
import { Movie } from '@/app/filmy/page';
import { create } from 'zustand';



interface MovieState {
    movies: Movie[];
    filteredMovies: Movie[];
    setMovies: (movies: Movie[]) => void;
    filterMovies: (searchTerm: string) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    movies: [],
    filteredMovies: [],

    setMovies: (movies: Movie[]) => set({ movies, filteredMovies: movies }),

    filterMovies: (searchTerm: string) => set((state) => ({
        filteredMovies: state.movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })),
}));

