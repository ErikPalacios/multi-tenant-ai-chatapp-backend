/**
 * ARCHIVO: dashboard/templates/page.tsx (Lista de Plantillas)
 * 
 * Esta página muestra todas las plantillas que el usuario ha creado, así como 
 * una galería de plantillas predefinidas que pueden "Clonar" para empezar rápido.
 *
 * Como siempre, 'use client' porque necesitamos disparar Hooks en el navegador 
 * para pedirle los datos a nuestro Backend en Node.js mediante fetch().
 */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

// Al usar TypeScript, importamos la "Forma" (Interfaz) de qué es exactamente 
// una plantilla. Esto nos da auto-completado y evita que nos equivoquemos.
import type { MessageTemplate } from '@interfaces/index';

export default function TemplatesPage() {
    const t = useTranslations('HomePage'); // Espacio de nombres general por ahora
    const router = useRouter();

    // -- ESTADOS LOCALES --
    // Este arreglo guardará las plantillas de Sistema (Globales)
    const [globalTemplates, setGlobalTemplates] = useState<MessageTemplate[]>([]);

    // Este arreglo guardará las plantillas del Usuario/Negocio (Business)
    const [businessTemplates, setBusinessTemplates] = useState<MessageTemplate[]>([]);

    // Estado de carga inicial. Empezamos en "true" porque no tenemos las plantillas todavía.
    const [loading, setLoading] = useState(true);

    // -- EFECTO DE IMPACTO INICIAL (useEffect) --
    // El useEffect con un arreglo vacío al final `[]` (o solo con dependencias estables como router)
    // le dice a React: "Ejecuta esto EXACTAMENTE UNA VEZ cuando el componente aparezca en la pantalla".
    useEffect(() => {
        // Creamos una función asíncrona por separado porque a useEffect no le gustan 
        // las funciones async directamente.
        async function fetchTemplates() {
            setLoading(true);
            try {
                // Recuperamos la llave maestra (Token JWT) del navegador
                const token = localStorage.getItem('heronova_token');
                if (!token) {
                    // Si no hay tarjeta, pa' fuera! Al login.
                    router.push('/login');
                    return;
                }

                // Promise.all tira múltiples peticiones de red AL MISMO TIEMPO (en paralelo)
                // en lugar de esperar a que termine una para lanzar la otra. ¡Es mucho más rápido!
                const [globalRes, businessRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/global`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/business`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                // Si ambas peticiones llegaron con Estatus 200 (OK)
                if (globalRes.ok && businessRes.ok) {
                    const globalData = await globalRes.json();
                    const businessData = await businessRes.json();

                    // Guardamos la información descargada en la memoria React (Estados)
                    setGlobalTemplates(globalData);
                    setBusinessTemplates(businessData);
                } else {
                    console.error('Failed to fetch templates');
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                // Quitamos la pantalla de carga sin importar qué haya pasado
                setLoading(false);
            }
        }

        // Ejecutamos la función asíncrona que acabamos de definir
        fetchTemplates();
    }, [router]);

    // Función que se ejecuta cuando tocan una de sus plantillas
    const handleSelectBusinessTemplate = (templateId: string) => {
        // Los llevamos dinámicamente al ID de la plantilla usando el enrutador
        router.push(`/dashboard/templates/${templateId}`);
    };

    // Función que clona una plantilla global y se la asigna al usuario
    const handleCloneGlobalTemplate = async (template: MessageTemplate) => {
        try {
            const token = localStorage.getItem('heronova_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/business`, {
                method: 'POST', // POST porque estamos "Creando" un nuevo clon
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template })
            });

            if (res.ok) {
                const newTemplate = await res.json();
                // Si la clonó exitosamente, redirigimos directamente al editor del clon
                router.push(`/dashboard/templates/${newTemplate.id}`);
            } else {
                console.error("Failed to clone global template");
            }
        } catch (error) {
            console.error("Error cloning template:", error);
        }
    };

    // ==================
    // RENDERIZADO (UI)
    // ==================

    // 1. Mostrar pantalla temporal mientras esperamos que Node.js responda la petición
    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Cargando plantillas...</div>;
    }

    // 2. Ya tenemos los datos, pintamos la interfaz principal
    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                    Configuración de Flujo
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    Administra las plantillas de mensajes que usará tu asistente virtual.
                </p>
            </div>

            {/* ---------- SECCIÓN 1: TUS PLANTILLAS ---------- */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Tus Plantillas</h2>
                    <p className="text-sm text-zinc-500">Plantillas personalizadas que has creado o modificado.</p>
                </div>

                {/* Si no tienen nada, mostramos un "Empty State" amigable */}
                {businessTemplates.length === 0 ? (
                    <div className="p-8 border border-dashed border-border rounded-2xl text-center text-zinc-500">
                        No has creado ninguna plantilla aún. Selecciona una predefinida abajo para empezar.
                    </div>
                ) : (
                    // Si SÍ tienen, iteramos el array usando .map()
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* En React, TODO map() necesita la propiedad única 'key' en su elemento padre */}
                        {businessTemplates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => handleSelectBusinessTemplate(template.id)}
                                className="text-left p-6 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden bg-card shadow-sm"
                            >
                                {/* Píldora que dice "Activa" si la plantilla actual está corriendo en WHastApp */}
                                {template.isActive && (
                                    <div className="absolute top-4 right-4 bg-green-500/10 text-green-500 text-xs font-medium px-2 py-1 rounded-full">
                                        Activa
                                    </div>
                                )}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                <div className="font-semibold text-foreground group-hover:text-primary mb-2 text-lg">{template.name}</div>
                                <div className="text-sm text-zinc-500 line-clamp-2">{template.description}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------- SECCIÓN 2: PLANTILLAS GLOBALES ---------- */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Plantillas Predefinidas</h2>
                    <p className="text-sm text-zinc-500">Clona una de nuestras plantillas sugeridas y edítala a tu gusto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Iteramos sobre el arreglo de plantillas maestras */}
                    {globalTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => handleCloneGlobalTemplate(template)}
                            className="text-left p-6 rounded-2xl border border-border hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group relative overflow-hidden bg-background"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-600 dark:text-zinc-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            </div>
                            <div className="font-semibold text-foreground mb-2 text-lg">{template.name}</div>
                            <div className="text-sm text-zinc-500 line-clamp-2">{template.description}</div>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
