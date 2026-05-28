import { ColorScheme } from './types';

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
    indigo: {
        primary: '#6366f1',
        accent: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        tag: '#6366f1',
        bar: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#a5b4fc', '#818cf8', '#6d28d9', '#4f46e5']
    },
    emerald: {
        primary: '#10b981',
        accent: '#34d399',
        gradient: 'linear-gradient(135deg,#10b981,#34d399)',
        tag: '#10b981',
        bar: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857', '#065f46', '#064e3b']
    },
    amber: {
        primary: '#f59e0b',
        accent: '#fbbf24',
        gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
        tag: '#f59e0b',
        bar: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#d97706', '#b45309', '#92400e', '#78350f']
    },
    rose: {
        primary: '#f43f5e',
        accent: '#fb7185',
        gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)',
        tag: '#f43f5e',
        bar: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48', '#be123c', '#9f1239', '#881337']
    },
    sky: {
        primary: '#0ea5e9',
        accent: '#38bdf8',
        gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
        tag: '#0ea5e9',
        bar: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7', '#0369a1', '#075985', '#0c4a6e']
    },
    coral: {
        primary: '#f97316',
        accent: '#fb923c',
        gradient: 'linear-gradient(135deg,#f97316,#fb923c)',
        tag: '#f97316',
        bar: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ea580c', '#c2410c', '#9a3412', '#7c2d12']
    },
    slate: {
        primary: '#64748b',
        accent: '#94a3b8',
        gradient: 'linear-gradient(135deg,#64748b,#94a3b8)',
        tag: '#64748b',
        bar: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#475569', '#334155', '#1e293b', '#0f172a']
    },
};
