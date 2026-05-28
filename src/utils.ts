/**
 * 通用工具函数
 */

export function formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getFileDate(file: { stat: { mtime: number } }): string | null {
    const day = file.stat?.mtime;
    if (!day) return null;
    const d = new Date(day);
    return formatDate(d);
}

export function isDarkMode(): boolean {
    return document.body.classList.contains('theme-dark');
}

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}