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

export type SeriesCard = {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    episodes: any[]; // Define a more specific type if possible
}

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

export type SeriesData = {
    title: string;
    description: string;
    coverImage: File | null;
    startDate: Date;
    endDate: Date;
    episodes: any[]; // Define a more specific type if possible
}

export type AssetFileObject = {
    fileName: string;
    contentType: string;
    file: ArrayBuffer | null;
}

export type LoadedImages = {
    [key: string]: boolean;
  };

export type Category = {
    id : number;
    name : string;
}