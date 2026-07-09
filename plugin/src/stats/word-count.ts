/**
 * 词数统计模块
 * 从原看板迁移：WordCache + countWords
 */

export function countWords(content: string): number {
    if (!content) return 0;
    let t = content
        .replace(/^---[\s\S]*?---\n*/, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]+`/g, '')
        .replace(/!\[\[[^\]\n]*\]\]/g, '')
        .replace(/\[\[([^\]|#\n^]+)(?:[#|][^\]]*)?\]\]/g, '$1')
        .replace(/\[([^\]\n]*)\]\([^)\n]+\)/g, '$1')
        .replace(/([\*_]{1,3})([^\*_]*?)\1/g, '$2')
        .replace(/^#+\s*/gm, '')
        .replace(/^[\s>*+-]\s*/gm, '')
        .replace(/^\d+\.\s*/gm, '');
    const cjk = (t.match(/\p{Script=Han}/gu) || []).length;
    const other = t.replace(/\p{Script=Han}/gu, ' ').split(/\s+/).filter(w => w).length;
    return cjk + other;
}

export function fmtNum(n: number): string {
    if (n === 0) return '0';
    if (n >= 100000) return (n / 1000).toFixed(0) + 'k';
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'k';
    return '' + n;
}