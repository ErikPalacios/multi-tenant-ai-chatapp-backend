"use client";

import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import { onboardingQuestions, OnboardingQuestion } from '../config/onboardingQuestions';

export function OnboardingForm({ onComplete }: { onComplete: () => void }) {
    const t = useTranslations('OnboardingForm');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        for (const q of onboardingQuestions) {
            if (q.required && !formData[q.id]) {
                const labelTrans = t(q.label);
                setError(t('requiredField', { field: labelTrans }));
                return;
            }
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('heronova_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error(t('errorServer'));
            }

            // Success, notify layout to clear wall and route
            onComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('unknownError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground">{t('title')}</h2>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                    {t('description')}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {onboardingQuestions.map((q: OnboardingQuestion) => (
                    <div key={q.id}>
                        <label className="block text-sm font-medium text-foreground/80 ml-1 mb-2">
                            {t(q.label)} {q.required && <span className="text-red-500">*</span>}
                        </label>

                        {q.type === 'select' && (
                            <select
                                value={formData[q.id] || ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground"
                            >
                                <option value="" disabled>{q.placeholder ? t(q.placeholder) : t('selectPlaceholder')}</option>
                                {q.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                                ))}
                            </select>
                        )}

                        {q.type === 'radio' && (
                            <div className="space-y-3 px-1">
                                {q.options?.map(opt => (
                                    <label key={opt.value} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt.value}
                                            checked={formData[q.id] === opt.value}
                                            onChange={(e) => handleChange(q.id, e.target.value)}
                                            className="w-5 h-5 accent-primary text-primary border-border bg-input focus:ring-primary/20 transition-colors"
                                        />
                                        <span className="text-foreground/90 group-hover:text-foreground transition-colors">{t(opt.label)}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {(q.type === 'text' || q.type === 'number') && (
                            <input
                                type={q.type}
                                placeholder={q.placeholder ? t(q.placeholder) : undefined}
                                value={formData[q.id] || ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                className="w-full px-5 py-3 rounded-2xl bg-input border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground"
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {loading && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? t('loading') : t('submit')}
                </button>
            </form>
        </div>
    );
}
