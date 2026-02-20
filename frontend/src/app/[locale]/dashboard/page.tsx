"use client";

import React from 'react';

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Panel de Control
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Citas Hoy</h3>
                    <span className="text-3xl font-bold">0</span>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Estado de WhatsApp</h3>
                    <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        Pendiente de Configurar
                    </span>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start shadow-sm">
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Plan Actual</h3>
                    <span className="text-xl font-bold text-primary">Pro</span>
                </div>
            </div>

            <div className="p-8 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 flex flex-col lg:flex-row items-center justify-between shadow-xs">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Pasos para activar tu asistente IA</h2>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-2xl">
                        Tu negocio ya está registrado. Para comenzar a recibir citas por WhatsApp, nuestro equipo
                        te contactará en breve para conectar tu número oficial de la API de Meta.
                    </p>
                </div>
                <button className="mt-6 lg:mt-0 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    Contactar a Soporte
                </button>
            </div>
        </div>
    );
}
