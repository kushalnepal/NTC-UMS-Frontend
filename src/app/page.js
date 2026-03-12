'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SkeletonPage } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    return (
        <SkeletonPage type="dashboard" />
    );
}
