// SeriesCardComponent.tsx
import React, { useState } from "react";
import Image from "next/image";
import { SeriesCard as SeriesCardType } from "@/types/types";

import { useSeriesStore } from "@/store/seriesStore";
import { useRouter } from "next/navigation";

interface SeriesCardProps {
    series: SeriesCardType;
}

const SeriesCard: React.FC<SeriesCardProps> = React.memo(({ series }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const router = useRouter();
    const setCurrentSeries = useSeriesStore((state) => state.setCurrentSeries);

    const handleClick = () => {
        setCurrentSeries(series);
        router.push(`/seriale/${series.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="flex flex-row w-[35rem] h-[20rem] items-center space-x-4 bg-base-100 shadow-xl p-4"
        >
            <div className="w-1/3">
                {!imageLoaded && (
                    <div className="animate-pulse bg-gray-200 h-full w-full"></div>
                )}
                {!series.coverImage ? (
                    <div className="card-placeholder">No image available</div>
                ) : (
                    <Image
                        width={300}
                        height={300}
                        src={series.coverImage}
                        alt={series.title}
                        sizes="100%"
                        priority={true}
                        onLoad={() => setImageLoaded(true)}
                    />
                )}
            </div>
            <div className="w-2/3">
                <h2 className="text-xl font-bold">{series.title}</h2>
                <p className="text-gray-600">{series.description}</p>
                {/* You can add more details here */}
            </div>
        </div>
    );
});

SeriesCard.displayName = "SeriesCard";

export default SeriesCard;
