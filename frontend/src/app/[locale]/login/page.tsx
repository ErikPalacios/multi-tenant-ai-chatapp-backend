"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("LoginPage");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login attempt:", { email, password });
        // Aquí se conectará con el backend después
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
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground"
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
                            className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                    >
                        {t("submit")}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("noAccount")}{" "}
                    <Link
                        href="/"
                        className="font-bold text-foreground hover:underline"
                    >
                        {t("signUp")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
