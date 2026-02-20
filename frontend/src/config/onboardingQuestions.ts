export type QuestionType = 'select' | 'radio' | 'text' | 'number';

export interface OnboardingOption {
    label: string;
    value: string;
}

export interface OnboardingQuestion {
    id: string; // Must match the backend 'Business' interface field
    type: QuestionType;
    label: string;
    placeholder?: string;
    options?: OnboardingOption[];
    required?: boolean;
}

export const onboardingQuestions: OnboardingQuestion[] = [
    {
        id: 'industry',
        type: 'select',
        label: 'industryLabel',
        placeholder: 'industryPlaceholder',
        required: true,
        options: [
            { label: 'industryBeauty', value: 'beauty_salon' },
            { label: 'industryHealth', value: 'medical_clinic' },
            { label: 'industryConsulting', value: 'professional_services' },
            { label: 'industryFood', value: 'restaurant' },
            { label: 'industryOther', value: 'other' }
        ]
    },
    {
        id: 'monthlyVolume',
        type: 'radio',
        label: 'monthlyVolumeLabel',
        required: true,
        options: [
            { label: 'volumeLow', value: '<1k' },
            { label: 'volumeMedium', value: '1k-5k' },
            { label: 'volumeHigh', value: '>5k' }
        ]
    },
    {
        id: 'whatsappUsage',
        type: 'radio',
        label: 'whatsappUsageLabel',
        required: true,
        options: [
            { label: 'usageNone', value: 'none' },
            { label: 'usageManual', value: 'manual' },
            { label: 'usageAutomated', value: 'automated' }
        ]
    }
];
