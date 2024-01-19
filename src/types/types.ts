export type MovieCard = {
    id: string;
    title: string;
    poster: string;
    director: string;
    actors: string[];
    genre: string;
    releaseDate: Date;
    duration: number;
    plot: string;
};

export type MovieData = {
    title: string;
    director: string;
    actors: string[];
    genre: string;
    releaseDate: Date;
    duration: number;
    plot: string;
    poster: File | null;
};

export type AssetFileObject = {
    fileName: string;
    contentType: string;
    file: ArrayBuffer | null;
}

export type LoadedImages = {
    [key: string]: boolean;
  };