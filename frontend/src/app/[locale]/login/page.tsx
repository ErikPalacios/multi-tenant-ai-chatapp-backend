"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("LoginPage");
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setError(t("errorInvalid"));
                } else {
                    setError(t("errorServer"));
                }
                return;
            }

            // Save token
            localStorage.setItem("heronova_token", data.token);

            // Redirect to home or dashboard
            router.push("/");
        } catch (err) {
            console.error("Login Error:", err);
            setError(t("errorServer"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-card to-background p-4">
            {/* Card Container */}
            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        {t("welcome")}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            required
                            disabled={isLoading}
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground disabled:opacity-50"
                        />
                    </div>

                    {/* Password Field */}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {t("submit")}
                    </button>
                </form>

                {/* Footer Link */}
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
