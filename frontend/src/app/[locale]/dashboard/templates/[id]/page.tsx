/**
 * ARCHIVO: dashboard/templates/[id]/page.tsx (Editor Dinámico de Plantillas)
 * 
 * ¡Esta es la página más compleja e interesante del Frontend!
 * 
 * [id] en el nombre de la carpeta significa que esta es una RUTA DINÁMICA en Next.js.
 * Si entras a /dashboard/templates/123, Next.js cargará este archivo y te pasará "123" 
 * dentro del objeto `params`, para que sepas qué plantilla buscar en la base de datos.
 */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

// Importamos el componente visual del celular (iPhone) que pasamos a la derecha
import { WhatsappWindow } from '@/components/WhatsappWindow';

// Importamos los tipos de TypeScript para asegurar que no inventemos propiedades que no existen
import type { MessageTemplate, TemplateMessage, TemplateSection } from '@interfaces/index';

// La firma del componente en Next.js 15+ para rutas dinámicas.
// `params` ahora es una Promesa que debemos "desenvolver" (unwrap) antes de usar.
export default function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    // Desenvolvemos la promesa de los params usando `React.use()`
    const { id } = React.use(params);
    const router = useRouter();

    // -- ESTADOS DE DATOS --
    // `template` guardará TODA la información de la plantilla actual. 
    // Empieza en `null` porque al inicio no sabemos qué plantilla es.
    const [template, setTemplate] = useState<MessageTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Para el spinner del botón "Guardar"

    // -- ESTADOS DE UI (Interfaz Gráfica) --
    // Para saber qué sección del "Acordeón" está abierta actualmente
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    // Para saber en qué mensaje específico hizo clic el usuario, y mostrarlo en el iPhone
    const [focusedMessage, setFocusedMessage] = useState<TemplateMessage | null>(null);

    // -- EFECTO DE CARGA INICIAL --
    useEffect(() => {
        async function fetchTemplate() {
            try {
                const token = localStorage.getItem('heronova_token');

                // Solicitamos TANTO las plantillas del usuario como las globales al mismo tiempo.
                const [bRes, gRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/business`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/global`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (bRes.ok && gRes.ok) {
                    const bData: MessageTemplate[] = await bRes.json();
                    const gData: MessageTemplate[] = await gRes.json();

                    // Buscamos (find) en el arreglo del usuario. Si no está, lo buscamos en el global.
                    // (|| significa "O")
                    const found = bData.find(t => t.id === id) || gData.find(t => t.id === id);

                    if (found) {
                        setTemplate(found); // ¡Encontrada! La guardamos en memoria.
                    } else {
                        // Si el ID de la URL es un invento y la plantilla no existe, 
                        // lo regresamos pateado a la lista de plantillas.
                        router.push('/dashboard/templates');
                    }
                }
            } catch (error) {
                console.error("Error fetching template", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTemplate();
    }, [id, router]);

    // Función para actualizar Nombre o Descripción de la plantilla
    const handleMetaChange = (field: 'name' | 'description', val: string) => {
        if (!template) return;
        // La sintaxis `...template` saca una COPIA EXACTA del objeto, 
        // y luego sobrescribimos solo el campo que nos interesa (name o description)
        setTemplate({ ...template, [field]: val });
    };

    // La función más meticulosa: Actualizar el texto exacto de un mensaje dentro de una sección específica
    const handleTextChange = (sectionId: string, messageId: string, val: string) => {
        if (!template) return;

        // Regla de Oro de React: NUNCA modifiques el estado original directamente (mutación).
        // Siempre saca una copia profunda si vas a escarbar muy profundo en arreglos.
        const newTemplate = { ...template };

        // 1. Buscamos en qué índice (posición 0, 1, 2...) está la Sección
        const secIndex = newTemplate.sections.findIndex((s: TemplateSection) => s.id === sectionId);
        if (secIndex > -1) {
            // 2. Buscamos en qué índice está el Mensaje dentro de la Sección
            const msgIndex = newTemplate.sections[secIndex].messages.findIndex((m: TemplateMessage) => m.id === messageId);
            if (msgIndex > -1) {
                // 3. ¡Lo tenemos! Le inyectamos el nuevo texto y guardamos todo el objeto gigante de nuevo.
                newTemplate.sections[secIndex].messages[msgIndex].defaultBotMessage = val;
                setTemplate(newTemplate);
            }
        }
    };

    // Toggle rápido estilo "Switch" de iPhone para prender/apagar la plantilla en producción
    const handleIsActiveToggle = (val: boolean) => {
        if (template) {
            setTemplate({ ...template, isActive: val });
        }
    };

    // Manda TODO el super objeto modificado (`template`) al servidor para que lo guarde en Firebase
    const handleSave = async () => {
        if (!template) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('heronova_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/business`, {
                method: 'POST', // POST porque en el backend usamos POST para Crear O Actualizar ("Upsert")
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template })
            });

            if (res.ok) {
                const newT = await res.json();
                // OJO AQUÍ: Si clonaste una plantilla `global_X`, el backend te devolverá un nuevo ID `business_Y`.
                // Si ese es el caso, recargamos la URL silenciosamente para que el ID arriba en tu navegador cambie.
                if (newT.id !== template.id) {
                    router.push(`/dashboard/templates/${newT.id}`);
                } else {
                    alert('Plantilla guardada correctamente');
                }
            } else {
                alert('Hubo un error al guardar');
            }
        } catch (error) {
            console.error("Error al guardar", error);
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // RENDERIZADO (UI) - Lo que ve el usuario
    // ==========================================

    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Cargando editor...</div>;
    }

    if (!template) {
        // En caso remoto de que loading terminara pero no hay plantilla visible
        return null;
    }

    // -- LÓGICA DE PREVISUALIZACIÓN (iPhone) --
    // Si el usuario hizo clic en un mensaje específico (focusedMessage no es null), 
    // mostramos los textos de ESE mensaje en el iPhone.
    // Si no ha hecho clic en ninguno, mostramos un texto de relleno por defecto (Placeholder).
    const previewUserMsg = focusedMessage?.exampleUserMessage || "Hola!";
    const previewBotMsg = focusedMessage?.defaultBotMessage || "Da click en un mensaje para editarlo";

    return (
        // max-w-6xl hace que la página no se estire de forma fea en pantallas Ultra-Wide
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 relative pb-20">

            {/* ------------------------------------------------------------------ */}
            {/* COLUMNA IZQUIERDA: CONTROLES DEL EDITOR (Formularios y Acordeón) */}
            {/* ------------------------------------------------------------------ */}
            <div className="flex-1 space-y-8">
                <div>
                    {/* Botón clásico para ir hacia atrás */}
                    <button
                        onClick={() => router.push('/dashboard/templates')}
                        className="text-sm font-medium text-zinc-500 hover:text-foreground mb-4 flex items-center"
                    >
                        &larr; Volver
                    </button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1 space-y-3">
                            <input
                                type="text"
                                value={template.name}
                                onChange={(e) => handleMetaChange('name', e.target.value)}
                                className="w-full text-3xl font-bold tracking-tight text-foreground bg-transparent border-b-2 border-transparent hover:border-zinc-300 focus:border-primary focus:outline-none transition-colors px-0 py-1"
                                placeholder="Nombre de la Plantilla"
                            />
                            <textarea
                                value={template.description}
                                onChange={(e) => handleMetaChange('description', e.target.value)}
                                className="w-full text-zinc-500 dark:text-zinc-400 mt-2 bg-transparent border-b-2 border-transparent hover:border-zinc-300 focus:border-primary focus:outline-none transition-colors px-0 py-1 resize-none overflow-hidden"
                                placeholder="Descripción de la plantilla..."
                                rows={2}
                            />
                        </div>
                        {/* Botón/Switch para Activar Plantailla en Producción */}
                        <label className="flex items-center space-x-3 bg-card px-4 py-3 rounded-xl border border-border cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 shrink-0 shadow-sm mt-2 md:mt-0">
                            <span className="text-sm font-semibold text-foreground">
                                {template.isActive ? 'BETA Activa' : 'Activar Plantilla'}
                            </span>
                            <input
                                type="checkbox"
                                checked={template.isActive || false}
                                onChange={(e) => handleIsActiveToggle(e.target.checked)}
                                className="w-5 h-5 accent-primary rounded cursor-pointer"
                            />
                        </label>
                    </div>
                </div>

                {/* EL ACORDEÓN DE SECCIONES */}
                <div className="space-y-4">
                    {/* 
                      Primero ORDENAMOS (.sort) las secciones según su propiedad `order` (1, 2, 3...) 
                      y luego las iteramos (.map) para dibujarlas en pantalla. 
                    */}
                    {template.sections.sort((a: TemplateSection, b: TemplateSection) => a.order - b.order).map((section: TemplateSection) => {
                        // Sabemos si ESTA sección está visible comparando su ID con la variable global activa
                        const isActive = activeSectionId === section.id;
                        return (
                            <div key={section.id} className={`rounded-xl border transition-all duration-200 ${isActive ? 'border-primary ring-1 ring-primary/20 bg-card shadow-sm' : 'border-border bg-input/40'}`}>
                                {/* Cabecera del Acordeón (Donde haces clic para expandirlo) */}
                                <button
                                    onClick={() => setActiveSectionId(isActive ? null : section.id)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                            {section.order}
                                        </div>
                                        <span className={`font-semibold text-lg ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                            {section.title}
                                        </span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${isActive ? 'rotate-180 text-primary' : 'text-zinc-400'}`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </button>

                                {/* Contenido Real del Acordeón (Solo se dibuja si `isActive` es verdadero) */}
                                {isActive && (
                                    <div className="p-5 pt-2 border-t border-border/50 space-y-6">
                                        {/* Iteramos sobre los mensajes individuales DENTRO de la sección actual */}
                                        {section.messages.map((msg: TemplateMessage) => {
                                            const isFocused = focusedMessage?.id === msg.id;

                                            return (
                                                <div
                                                    key={msg.id}
                                                    // Si estamo cliqueando este mensaje, pintamos el borde de Azul. Si no, borde normal gris.
                                                    className={`p-4 rounded-xl transition-colors border ${isFocused ? 'bg-primary/5 border-primary/30 shadow-inner' : 'bg-background border-border hover:border-zinc-300'}`}
                                                    onClick={() => setFocusedMessage(msg)}
                                                >
                                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                                        {msg.description}
                                                    </label>

                                                    {/* Caja de texto donde el Bot escribe. IMPORTANTE: El `onChange` llama
                                                        a nuestra función microscópica (handleTextChange) que hace la cirugía
                                                        arriba en el objeto gigante. */}
                                                    <textarea
                                                        value={msg.defaultBotMessage}
                                                        onChange={(e) => handleTextChange(section.id, msg.id, e.target.value)}
                                                        onFocus={() => setFocusedMessage(msg)}
                                                        className="w-full h-28 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none shadow-sm"
                                                        placeholder="Escribe el mensaje del bot aquí..."
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Botón Principal Guardar */}
                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {/* Si `saving` es true, mostramos un spinner de CSS animado */}
                        {saving ? (
                            <span className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Guardando...</span>
                            </span>
                        ) : 'Guardar y Aplicar'}
                    </button>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* COLUMNA DERECHA: PREVISUALIZADOR MÓVIL (COMPONENTE EXTERNO) */}
            {/* ------------------------------------------------------------------ */}
            <div className="hidden lg:block w-96 shrink-0 relative">
                <div className="sticky top-12">
                    <div className="mb-4 text-center">
                        <span className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span>Vista Previa en Vivo</span>
                        </span>
                    </div>
                    {/* El Componente Mock de WhatsApp */}
                    <WhatsappWindow
                        userMessage={previewUserMsg}
                        botMessage={previewBotMsg}
                    />
                </div>
            </div>
        </div>
    );
}
