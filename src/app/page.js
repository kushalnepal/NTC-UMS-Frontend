'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0a1628',
        }}>
            <div style={{
                width: 40,
                height: 40,
                border: '3px solid #1e3a5f',
                borderTop: '3px solid #ffcc00',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
