import * as contentfulManagement from 'contentful-management';


type MovieData = {
    title: string;
    director: string;
    actors: string[];
    genre: string;
    releaseDate: Date;
    duration: number;

};

const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_PERSONAL_API_ACCESS_TOKEN as string
});

const createMovieEntry = async (movieData: MovieData) => {
    // Initialize the Contentful Management client with your access token

    // Get the space
    const environment = await client
        .getSpace(process.env.NEXT_PUBLIC_SPACE as string)
        .then((space) =>
            space.getEnvironment("master")
        );

    // Create the entry
    const entry = await environment.createEntry(
        "movie",
        {
            fields: {
                title: {
                    'en-US': movieData.title
                },
                director: {
                    'en-US': movieData.director
                },
                actors: {
                    'en-US': movieData.actors
                },
                genre: {
                    'en-US': movieData.genre
                },
                releaseDate: {
                    'en-US': movieData.releaseDate
                },
                duration: {
                    'en-US': movieData.duration
                },
            },
        }
    );

    await entry.publish();
};

const deleteMovieEntry = async (movieId: string) => {
    const space = await client.getSpace(process.env.NEXT_PUBLIC_SPACE as string);
    const environment = await space.getEnvironment("master");
    const entry = await environment.getEntry(movieId);

    await entry.unpublish(); // May be needed if your entries are published
    await entry.delete();
};


export { createMovieEntry, deleteMovieEntry };