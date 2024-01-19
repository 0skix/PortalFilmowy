import { AssetFileObject, MovieData } from "@/types/types";
import * as contentfulManagement from "contentful-management";
import { toast } from "react-toastify";

const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_PERSONAL_API_ACCESS_TOKEN as string,
});

const convertFileToAssetObject = async (
    file: File
): Promise<AssetFileObject> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                fileName: file.name,
                contentType: file.type,
                file: reader.result as ArrayBuffer,
            });
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
};

const createMovieEntry = async (movieData: MovieData) => {
    const notify = () => toast("Zdjęcie zostało dodane");
    const environment = await client
        .getSpace(process.env.NEXT_PUBLIC_SPACE as string)
        .then((space) => space.getEnvironment("master"));

    let asset;
    if (movieData.poster) {
        const assetData = await convertFileToAssetObject(movieData.poster);
        asset = await environment.createAssetFromFiles({
            fields: {
                title: {
                    "en-US": movieData.title,
                },
                file: {
                    "en-US": {
                        file: assetData.file || "",
                        contentType: assetData.contentType,
                        fileName: assetData.fileName,
                    },
                },
                description: {},
            },
        });

        // Step 2: Process & Publish Asset
        asset = await asset.processForAllLocales();
        await asset.publish();
        notify();
    }

    // Create the entry
    const entry = await environment.createEntry("movie", {
        fields: {
            title: {
                "en-US": movieData.title,
            },
            director: {
                "en-US": movieData.director,
            },
            actors: {
                "en-US": movieData.actors,
            },
            genre: {
                "en-US": movieData.genre,
            },
            releaseDate: {
                "en-US": movieData.releaseDate,
            },
            duration: {
                "en-US": movieData.duration,
            },
            plot: {
                "en-US": movieData.plot,
            },
            poster: asset
                ? {
                    "en-US": {
                        sys: {
                            id: asset.sys.id,
                            linkType: "Asset",
                            type: "Link",
                        },
                    },
                }
                : null,
        },
    });

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
