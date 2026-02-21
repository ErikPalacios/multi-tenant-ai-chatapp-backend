/**
 * ARCHIVO: dashboard/page.tsx (Panel principal del Dashboard)
 *
 * Esta es la primera pantalla que ve el usuario después de iniciar sesión o registrarse exitosamente.
 * 
 * ¿Por qué usamos 'use client'?
 * Porque tenemos un botón interactivo "Configurar Plantillas" que usa `router.push()` 
 * al hacer clic (onClick). Cualquier evento del usuario (clics, teclado) requiere 
 * que el componente sea procesado en el lado del cliente (Navegador).
 */
"use client";

import React from 'react';
// Importamos nuestro enrutador personalizado con soporte de idiomas (ej. /es/dashboard o /en/dashboard)
import { useRouter } from '@/i18n/routing';

export default function DashboardPage() {
    // Inicializamos el enrutador para poder realizar navegaciones programáticas
    const router = useRouter();

    return (
        // Usamos una pequeña animación CSS (animate-in fade-in) para que el Dashboard no aparezca de golpe, 
        // sino que tenga un pequeño y elegante efecto de entrada al cargar.
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Cabecera del Dashboard */}
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Panel de Control
                </h1>
            </header>

            {/* Fila de Tarjetas de Estadísticas (Widgets) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Widget 1 */}
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Citas Hoy</h3>
                    <span className="text-3xl font-bold">0</span> {/* Valor estático por ahora */}
                </div>

                {/* Widget 2 */}
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Estado de WhatsApp</h3>
                    {/* Badge de estado tipo "Píldora" */}
                    <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        Pendiente de Configurar
                    </span>
                </div>

                {/* Widget 3 */}
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Plan Actual</h3>
                    <span className="text-xl font-bold text-primary">Pro</span>
                </div>
            </div>

            {/* Banner Principal de Llamado a la Acción (Call to Action - CTA) */}
            <div className="p-8 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 flex flex-col lg:flex-row items-center justify-between shadow-xs">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Pasos para activar tu asistente IA</h2>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-2xl">
                        Tu negocio ya está registrado. Para comenzar a recibir citas por WhatsApp, nuestro equipo
                        te contactará en breve para conectar tu número oficial de la API de Meta.
                    </p>
                </div>

                {/* Botonera del Banner */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                    {/* Botón Primario: Navega dinámicamente usando el router de Next.js */}
                    <button
                        onClick={() => router.push('/dashboard/templates')}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                        Configurar Plantillas
                    </button>
                    {/* Botón Secundario */}
                    <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-card border border-border font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Contactar a Soporte
                    </button>
                </div>
            </div>
        </div>
    );
}
