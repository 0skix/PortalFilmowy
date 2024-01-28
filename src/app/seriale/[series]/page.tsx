'use client';
import CommentsList from '@/components/CommentsList';
import CommentForm from '@/components/Forms/CommentForm';
import { useSeriesStore } from '@/store/seriesStore'; // Make sure this path is correct
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';


import React, { useEffect, useState } from 'react'

const SeriesDetails = () => {
    const pathname = usePathname()
    const { data: session } = useSession();
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
        <main className="flex min-h-screen flex-col items-center  p-4">
            <CommentsList contentId={seriesId} />
            {session && <CommentForm contentId={seriesId} />}
        </main>
    )
}

export default SeriesDetails