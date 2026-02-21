/**
 * ARCHIVO: dashboard/welcome/page.tsx (Página de Bienvenida y Tutorial)
 * 
 * Esta página está diseñada para ser mostrada INMEDIATAMENTE después de que
 * un usuario completa su Onboarding (Registro). Su objetivo es educar.
 * 
 * Usamos 'use client' porque tiene botones que ejecutan `router.push()` 
 * para saltar a otras pantallas.
 */
"use client";

import React from 'react';
import { useRouter } from '@/i18n/routing';

export default function WelcomePage() {
    const router = useRouter();

    return (
        // max-w-4xl centra el contenido y restringe el ancho para que el video no se vea gigantesco
        <div className="max-w-4xl mx-auto py-12 px-6">

            {/* Texto de Bienvenida */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                    ¡Felicidades, tu negocio está listo! 🎉
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                    Antes de ir a tu panel, mírate este rápido tutorial de 2 minutos sobre cómo configurar
                    tu Agente con plantillas de mensajería para sacarle el máximo provecho.
                </p>
            </div>

            {/* Contenedor del Video (YouTube) */}
            <div className="bg-card border border-border rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
                {/* aspect-video (Tailwind) es un truco mágico que asegura que el contenedor 
                    siempre mantenga la proporción 16:9, sin importar si estás en celular o compu */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 shadow-inner relative">
                    {/* El iFrame carga una página externa (YouTube) dentro de nuestro sitio */}
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1"
                        title="Heronova Video Tutorial"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>

            {/* Botonera de Acción Post-Video */}
            <div className="mt-12 text-center flex flex-col items-center">
                <p className="mb-6 font-medium text-foreground">
                    ¿Terminaste de ver el video? Da el siguiente paso:
                </p>

                {/* Botón Principal: Sugiere como siguiente paso configurar las plantillas */}
                <button
                    onClick={() => router.push('/dashboard/templates')}
                    className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    Ir a Configuración de Plantillas
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>

                {/* Enlace sutil para saltarse el paso e ir directo al dashboard principal */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="mt-6 text-sm text-zinc-500 hover:text-foreground font-medium transition-colors"
                >
                    Ir al Panel Principal
                </button>
            </div>
        </div>
    );
}
