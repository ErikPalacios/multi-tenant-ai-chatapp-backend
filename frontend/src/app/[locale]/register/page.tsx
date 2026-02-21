/**
 * ARCHIVO: register/page.tsx (Página de Registro de Nueva Empresa)
 *
 * Al igual que el Login, necesitamos `use client` porque este componente maneja 
 * estados interactivos (como lo que escribe el usuario) y hace peticiones de red 
 * al momento de hacer scroll o clic.
 */
"use client";

import React, { useState } from "react";
// Usamos nuestro Link y useRouter adaptados para múltiples idiomas (ej. /es/login)
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
    const t = useTranslations("RegisterPage");
    const router = useRouter();

    // En lugar de hacer un `useState` para cada campito (email, password, nombre...), 
    // podemos agruparlos todos en un solo objeto para tener el código más limpio.
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        businessName: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); // Para mostrar una franja verde de éxito

    // Esta es una función "genérica" para manejar cualquier cambio en los inputs.
    // Utiliza el `id` del input (ej: id="email") para saber qué propiedad modificar en el objeto `formData`.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData, // Copiamos el objeto anterior para no borrar lo que ya estaba escrito
            [e.target.id]: e.target.value // Sobrescribimos solo la propiedad específica
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Detenemos la recarga nativa del navegador web
        setIsLoading(true);
        setError(null);

        try {
            // Mandamos los datos al endpoint de "Registro de Dueños" en Node.js
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    businessName: formData.businessName,
                    // De paso enviamos información básica de su configuración de WhatsApp que llenarán después
                    whatsappConfig: {
                        phone: "PENDING_SETUP",
                        platform: "meta" // Por defecto usarán Meta (WhastApp Oficial)
                    }
                }),
            });

            const data = await response.json();

            // Detectamos si Node.js nos devolvió un error (ej. Usuario repetido)
            if (!response.ok) {
                // Si el servidor nos dice explícitamente que ya existe
                if (response.status === 400 && data.error === 'User already exists') {
                    setError(t("errorEmailExists"));
                } else {
                    setError(t("errorServer"));
                }
                return;
            }

            // Si el registro funcionó, tu Backend ya nos devolvió un Token de acceso directo. 
            // Lo guardamos para que no tengan que hacer Login otra vez.
            if (data.token) {
                localStorage.setItem("heronova_token", data.token);
            }

            // Mostramos feedback verde bonito 🔥
            setSuccess(true);

            // Pausamos Next.js por 2 segundos (2000 ms) para que el usuario alcance a leer 
            // el mensaje verde de éxito antes de mandarlos ráfaga al Dashboard
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (err) {
            console.error("Registration Error:", err);
            setError(t("errorServer"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-card to-background p-4">
            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        {t("description")}
                    </p>
                </div>

                {/* Mensaje Rojo de Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Mensaje Verde de Éxito (solo aparece si success es true) */}
                {success && (
                    <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium text-center">
                        {t("success")}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de Nombre del Negocio */}
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-foreground/80 ml-1 mb-2">
                            {t("businessNameLabel")}
                        </label>
                        <input
                            type="text"
                            // IMPORTANTE: el id DEBE coincidir con el nombre de la propiedad en el objeto formData
                            id="businessName"
                            value={formData.businessName}
                            onChange={handleChange} // Usamos nuestra función unificada para todos los inputs
                            placeholder={t("businessNamePlaceholder")}
                            required
                            disabled={isLoading || success} // Si está cargando o ya tuvo éxito, lo desactivamos todo
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    <div className="h-px bg-border my-2 opacity-50" />

                    {/* Campo de Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground/80 ml-1 mb-2">
                            {t("emailLabel")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("emailPlaceholder")}
                            required
                            disabled={isLoading || success}
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground/80 ml-1 mb-2">
                            {t("passwordLabel")}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t("passwordPlaceholder")}
                            required
                            disabled={isLoading || success}
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={isLoading || success}
                        className="w-full mt-6 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {t("submit")}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("hasAccount")}{" "}
                    <Link
                        href="/login"
                        className="font-bold text-foreground hover:underline"
                    >
                        {t("signIn")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
