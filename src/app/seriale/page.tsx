"use client"
import React, { useEffect, useState } from "react";
import { useSeriesStore } from "@/store/seriesStore";
import SeriesCardComponent from "@/components/SeriesCardComponent";
import Loading from "@/components/UI/Loading";

const SeriesPage = () => {
    const { filteredSeries, loadingSeries, fetchSeries } = useSeriesStore((state) => ({
        filteredSeries: state.filteredSeries,
        loadingSeries: state.loadingSeries,
        fetchSeries: state.fetchSeries,
    }));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [seriesPerPage] = useState<number>(10); // Możesz dostosować liczbę serii na stronę

    useEffect(() => {
        fetchSeries();
    }, [fetchSeries]);


    const indexOfLastSeries = currentPage * seriesPerPage;
    const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
    const currentSeries = filteredSeries.slice(indexOfFirstSeries, indexOfLastSeries);


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredSeries.length / seriesPerPage); i++) {
        pageNumbers.push(i);
    }

    const nextPage = () => {
        const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="flex gap-4 flex-wrap justify-center align-middle">
                {loadingSeries ? (
                    <Loading />
                ) : (
                    currentSeries.map((series) => (
                        <SeriesCardComponent
                            key={series.id}
                            series={series}
                        />
                    ))
                )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={prevPage} className="btn btn-sm btn-circle">
                    «
                </button>
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)} className={`btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}>
                        {number}
                    </button>
                ))}
                <button onClick={nextPage} className="btn btn-sm btn-circle">
                    »
                </button>
            </div>
        </main>
    );
};

export default SeriesPage;