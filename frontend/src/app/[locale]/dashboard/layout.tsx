"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { OnboardingForm } from '@/components/OnboardingForm';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthAndOnboarding = async () => {
            try {
                const token = localStorage.getItem('heronova_token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('heronova_token');
                        router.push('/login');
                    }
                    throw new Error('No se pudo cargar el perfil');
                }

                const data = await res.json();

                setIsAuthenticated(true);

                // Check onboarding specifically for OWNER
                // The backend user object might not contain the role directly, but the API requires OWNER role.
                if (data.business && data.business.onboardingCompleted === false) {
                    setNeedsOnboarding(true);
                } else {
                    setNeedsOnboarding(false);
                }

            } catch (err) {
                console.error('Error checking auth:', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndOnboarding();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // Intercept the dashboard view with the Onboarding Form
    if (needsOnboarding) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-card to-background p-4 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <OnboardingForm onComplete={() => {
                        setNeedsOnboarding(false);
                        router.push('/dashboard/welcome');
                    }} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar Placeholder */}
            <aside className="w-64 border-r border-border bg-card p-6 hidden md:block">
                <h2 className="text-xl font-bold bg-linear-to-r from-primary to-primary-hover bg-clip-text text-transparent">Heronova</h2>
                <nav className="mt-8 space-y-4">
                    <a href="#" className="block px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">Panel de Control</a>
                    <a href="#" className="block px-4 py-2 rounded-lg text-foreground hover:bg-input transition-colors">Citas</a>
                    <a href="#" className="block px-4 py-2 rounded-lg text-foreground hover:bg-input transition-colors">Configuración</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
