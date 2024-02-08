"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return <main className="flex min-h-screen flex-col items-center justify-between p-4"><h1>Loading</h1></main>;
    }

    return <main className="flex min-h-screen flex-col items-center justify-between p-4"></main>;
}

export default Page;