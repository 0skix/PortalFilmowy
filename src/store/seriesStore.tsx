import { SeriesCard } from "@/types/types";
import { create } from "zustand";
import { createClient } from "contentful";
import { persist } from "zustand/middleware";

interface SeriesState {
    series: SeriesCard[];
    filteredSeries: SeriesCard[];
    loadingSeries: boolean;
    currentSeries: SeriesCard | null;
    setCurrentSeries: (series: SeriesCard | null) => void;
    setSeries: (series: SeriesCard[]) => void;
    filterSeries: (searchTerm: string) => void;
    fetchSeries: () => Promise<void>;
    fetchSingleSeries: (seriesId: string) => Promise<void>;
}

const getCoverImageUrl = (imageField: { fields?: { file?: { url: string } } }): string => {
    return imageField?.fields?.file?.url ? `https:${imageField.fields.file.url}` : "";
};

const mapContentfulSeries = (item: any): SeriesCard => ({
    id: item.sys.id,
    title: String(item.fields.title),
    description: String(item.fields.description),
    coverImage: getCoverImageUrl(item.fields.coverImage),
    startDate: new Date(String(item.fields.startDate)),
    endDate: new Date(String(item.fields.endDate)),
    episodes: item.fields.episodes, // Map this accordingly based on your structure
});

const client = createClient({
    space: process.env.NEXT_PUBLIC_SPACE as string,
    accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN as string,
});

export const useSeriesStore = create<SeriesState>()(
    persist(
        (set) => ({
            series: [],
            filteredSeries: [],
            loadingSeries: false,
            currentSeries: null,
            setCurrentSeries: (series: SeriesCard | null) =>
                set({ currentSeries: series }),
            setSeries: (series: SeriesCard[]) =>
                set({ series, filteredSeries: series }),
            filterSeries: (searchTerm: string) =>
                set((state) => ({
                    filteredSeries: state.series.filter((series) =>
                        series.title.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                })),
            fetchSeries: async () => {
                set({ loadingSeries: true });
                try {
                    const response = await client.getEntries({ content_type: "series" }); // Adjust for your content type
                    const seriesData = response.items.reverse().map(mapContentfulSeries);
                    set({ series: seriesData, filteredSeries: seriesData });
                } catch (error) {
                    console.error("Error fetching series:", error);
                } finally {
                    set({ loadingSeries: false });
                }
            },
            fetchSingleSeries: async (seriesId: string) => {
                set({ loadingSeries: true });
                try {
                    const response = await client.getEntries({
                        content_type: "series", // Adjust for your content type
                        "sys.id": seriesId,
                    });
                    const singleSeries =
                        response.items.length > 0
                            ? mapContentfulSeries(response.items[0])
                            : null;
                    set({ currentSeries: singleSeries });
                } catch (error) {
                    console.error("Error fetching the series:", error);
                } finally {
                    set({ loadingSeries: false });
                }
            },
        }),
        {
            name: "series-storage",
            getStorage: () => localStorage,
            partialize: (state) => ({
                series: state.series,
                currentSeries: state.currentSeries,
            }),
        }
    )
);
