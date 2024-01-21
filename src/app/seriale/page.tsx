// SeriesPage.tsx
"use client"
import React, { useEffect } from "react";
import { useSeriesStore } from "@/store/seriesStore";
import SeriesCardComponent from "@/components/SeriesCardComponent";
import Loading from "@/components/UI/Loading";

const SeriesPage = () => {
    const { filteredSeries, loadingSeries, fetchSeries, series, } = useSeriesStore((state) => ({
        filteredSeries: state.filteredSeries,
        setSeries: state.setSeries,
        loadingSeries: state.loadingSeries,
        fetchSeries: state.fetchSeries,
        series: state.series,
    }));

    useEffect(() => {
        fetchSeries();
    }, [fetchSeries]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="flex gap-4 flex-wrap justify-center align-middle">
                {loadingSeries ? (
                    <Loading />
                ) : (
                    filteredSeries.map((series) => (
                        <SeriesCardComponent
                            key={series.id}
                            series={series}
                        />
                    ))
                )}
            </div>
        </main>
    );
};

export default SeriesPage;