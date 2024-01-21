'use client';
import { useSeriesStore } from '@/store/seriesStore'; // Make sure this path is correct
import { usePathname, useRouter } from 'next/navigation';


import React, { useEffect, useState } from 'react'

const SeriesDetails = () => {
    const pathname = usePathname()
    const seriesId = pathname?.split('/').pop() || '';// Assuming your dynamic path is [seriesId].tsx
    const { currentSeries, fetchSingleSeries } = useSeriesStore((state) => ({
        currentSeries: state.currentSeries,
        fetchSingleSeries: state.fetchSingleSeries,
    }));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (seriesId) {
            fetchSingleSeries(seriesId);
        }
        setIsClient(true);
    }, [fetchSingleSeries, seriesId]);

    if (!currentSeries || currentSeries.id !== seriesId || !isClient) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-4">
                <h1 className="text-4xl">Loading...</h1>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <h1 className="text-4xl">{currentSeries.title}</h1>
            {/* Render other series details here */}
        </main>
    )
}

export default SeriesDetails