'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useSeriesStore } from '@/store/seriesStore'; // Update the import path as needed
import CommentsList from '@/components/CommentsList';
import CommentForm from '@/components/Forms/CommentForm';
import Image from 'next/image';

const SeriesDetails = () => {
    const pathname = usePathname();
    const seriesId = pathname?.split('/').pop() || ''; // Assuming the path is something like '/series/[seriesId]'
    const { data: session } = useSession();
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
        <main className="container mx-auto p-1 min-h-[100vh]">
            <div className="card lg:card-side bg-base-100 shadow-xl max-h-[90vh]">
                <figure className="md:w-1/3 bg-black">
                    <Image src={currentSeries.coverImage} alt={currentSeries.title} width={400} height={400} />
                </figure>
                <div className="card-body md:w-2/3 overflow-auto max-h-[100%]">
                    <h2 className="card-title">{currentSeries.title}</h2>
                    <p><strong>Description:</strong> {currentSeries.description}</p>
                    <p><strong>Start Date:</strong> {new Date(currentSeries.startDate).toDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(currentSeries.endDate).toDateString()}</p>
                    <p><strong>Episodes:</strong> {currentSeries.episodes}</p>
                    <CommentsList contentId={seriesId} />
                    {session && <CommentForm contentId={seriesId} />}
                </div>
            </div>
        </main>
    );
};

export default SeriesDetails;