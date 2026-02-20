"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
    const t = useTranslations("RegisterPage");
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        businessName: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    businessName: formData.businessName,
                    whatsappConfig: {
                        phone: "PENDING_SETUP",
                        platform: "meta" // Default to meta
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.error === 'User already exists') {
                    setError(t("errorEmailExists"));
                } else {
                    setError(t("errorServer"));
                }
                return;
            }

            // Guardar token y redirigir al dashboard para onboarding
            if (data.token) {
                localStorage.setItem("heronova_token", data.token);
            }

            setSuccess(true);
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

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium text-center">
                        {t("success")}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Business Name Field */}
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-foreground/80 ml-1 mb-2">
                            {t("businessNameLabel")}
                        </label>
                        <input
                            type="text"
                            id="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder={t("businessNamePlaceholder")}
                            required
                            disabled={isLoading || success}
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    <div className="h-px bg-border my-2 opacity-50" />

                    {/* Email Field */}
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

                    {/* Password Field */}
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

                    {/* Submit Button */}
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
