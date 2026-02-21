/**
 * ARCHIVO: login/page.tsx (Página de Inicio de Sesión)
 *
 * La directiva 'use client' es CRÍTICA en Next.js App Router.
 * Le dice a Next.js: "¡Oye! Este componente tiene botones que se clickean, 
 * formularios que se llenan y variables que cambian en vivo (como el email y password). 
 * Por favor, mándalo al navegador del usuario (el Cliente) para que funcione la interactividad."
 * Sin esta directiva, los Hooks de React (`useState`, `useEffect`) lanzarían error.
 */
"use client";

import React, { useState } from "react";
// Importamos nuestro enrutador experto en idiomas que ya incluye soporte para /es/ o /en/
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("LoginPage");
    // `useRouter` nos da el objeto `router` que nos permite hacer redirecciones
    // mediante código (ej: router.push('/dashboard')) sin necesidad de que el usuario
    // haga clic en un enlace.
    const router = useRouter();

    // -- ESTADOS (React State) --
    // `useState` crea variables "reactivas". Cuando su valor cambia (usando setEmail por ejemplo),
    // React automáticamente redibuja la parte de la pantalla que usa esa variable.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Para mostrar el circulito de carga
    const [error, setError] = useState<string | null>(null); // Para mostrar mensajes rojos si falla el login

    // Función que se ejecuta cuando el usuario presiona "Entrar" o da Enter en el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault() evita que la página entera haga un "Refresh" (el comportamiento HTML por defecto de un form)
        e.preventDefault();

        setIsLoading(true); // Encendemos el estado de carga
        setError(null);     // Limpiamos errores anteriores

        try {
            // Hacemos una petición (Fetch) a nuestro servidor Backend de Node.js
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Entregamos el email y password que el usuario tipeó
                body: JSON.stringify({ email, password }),
            });

            // Convertimos la respuesta del servidor a un objeto JSON usable
            const data = await response.json();

            // Si `response.ok` es falso (ej. status 400, 401, 500)
            if (!response.ok) {
                if (response.status === 401) {
                    setError(t("errorInvalid")); // Credenciales incorrectas
                } else {
                    setError(t("errorServer")); // Otro error aleatorio
                }
                return; // Cortamos la ejecución aquí
            }

            // Si llegamos hasta acá, triunfamos. 
            // Guardamos el "Pase de Seguridad" (JWT Token) en el navegador del usuario 
            // (Local Storage). Así le demostramos al backend que estamos autenticados en futuros requests.
            localStorage.setItem("heronova_token", data.token);

            // Finalmente, redirigimos mágicamente al usuario al dashboard
            router.push("/dashboard");
        } catch (err) {
            console.error("Login Error:", err);
            setError(t("errorServer"));
        } finally {
            // Sin importar si fue exitoso o falló, apagamos la bolita de carga al terminar
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-card to-background p-4">
            {/* Contenedor de la Tarjeta */}
            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        {t("welcome")}
                    </p>
                </div>

                {/* Renderizado Condicional: Este div rojo SOLO existe si la variable `error` tiene texto */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Formulario. Al enviar (submit), ejecuta nuestra función handleSubmit en vez de refrescar */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de Correo Electrónico */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-foreground/80 ml-1 mb-2"
                        >
                            {t("emailLabel")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email} // Vinculamos la caja de texto con la variable en memoria de React
                            onChange={(e) => setEmail(e.target.value)} // Cada vez que el usuario teclea, actualizamos la memoria
                            placeholder={t("emailPlaceholder")}
                            required
                            disabled={isLoading} // Si está cargando, bloqueamos la caja para que no tecleen más
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <div className="flex items-center justify-between ml-1 mb-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground/80"
                            >
                                {t("passwordLabel")}
                            </label>
                            <a
                                href="#"
                                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                            >
                                {t("forgotPassword")}
                            </a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t("passwordPlaceholder")}
                            required
                            disabled={isLoading}
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    {/* Botón de Envío */}
                    <button
                        type="submit"
                        disabled={isLoading} // Bloqueamos el clic masivo mientras carga el Login
                        className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {/* Si isLoading es true, mostramos un ícono que da vueltas infinito (animate-spin) */}
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {t("submit")}
                    </button>
                </form>

                {/* Enlace al Pie para Registrarse */}
                <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("noAccount")}{" "}
                    <Link
                        href="/register"
                        className="font-bold text-foreground hover:underline"
                    >
                        {t("signUp")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
