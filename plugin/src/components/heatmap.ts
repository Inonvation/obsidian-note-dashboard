import { moment } from 'obsidian';
import { DashboardData } from '../data';
import { fmtNum } from '../stats/word-count';
import { isDarkMode } from '../utils';
import { ColorScheme } from '../types';

const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function renderHeatmap(data: DashboardData, scheme: ColorScheme, heatWeeks: number, heatLevels: number[]): string {
    const S = 13, G = 2, R = 2, PT = 20, MH = 18, MB = 4, LW = 22;
    const W = heatWeeks;

    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(end.getTime() - ((W - 1) * 7 + (6 - end.getDay())) * 24 * 60 * 60 * 1000);

    const level = (words: number): number => {
        if (words >= heatLevels[2]) return 4;
        if (words >= heatLevels[1]) return 3;
        if (words >= heatLevels[0]) return 2;
        if (words > 0) return 1;
        return 0;
    };

    const clr = (lv: number): string => {
        if (lv === 0) return isDarkMode() ? '#161b22' : '#ebedf0';
        const colors = scheme.bar;
        return colors[Math.min(lv - 1, colors.length - 1)];
    };

    const mMap = new Map<number, string>();
    for (let c = 0; c < W; c++) {
        const d = new Date(start.getTime() + c * 7 * 24 * 60 * 60 * 1000);
        if (d.getDate() <= 7) {
            mMap.set(c, (d.getMonth() + 1) + '月');
        }
    }

    const cellDelay = (c: number) => `${c * 15}ms`;

    let hm = '<div class="nd-card" style="overflow:clip;"><div style="display:flex;gap:2px;">';
    hm += `<div style="flex:0 0 ${LW}px;padding:${PT + MH + MB}px 0 0;">`;
    for (let r = 0; r < 7; r++) {
        hm += `<div style="height:${S}px;margin-bottom:${G}px;font-size:9px;color:var(--text-muted);text-align:center;line-height:${S}px;">${DAYS[r]}</div>`;
    }
    hm += '</div>';
    hm += `<div class="nd-hide nd-heat-scroll" style="overflow-x:auto;flex:1;min-width:0;padding:${PT}px 12px 0 0;"><div style="min-width:max-content;">`;
    hm += `<div style="position:relative;height:${MH}px;margin-bottom:${MB}px;">`;
    for (const [col, label] of mMap) {
        const left = col * (S + G);
        hm += `<span style="position:absolute;left:${left}px;top:0;font-size:9px;color:var(--text-muted);white-space:nowrap;line-height:${MH}px;pointer-events:none;">${label}</span>`;
    }
    hm += '</div>';

    for (let r = 0; r < 7; r++) {
        hm += `<div style="display:flex;gap:${G}px;margin-bottom:${G}px;">`;
        for (let c = 0; c < W; c++) {
            const d = new Date(start.getTime() + (c * 7 + r) * 24 * 60 * 60 * 1000);
            const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const words = data.dateWords.get(k) || 0;
            const cnt = data.dateCount.get(k) || 0;
            const lv = level(words);
            const tip = cnt
                ? `${d.getMonth() + 1}月${d.getDate()}日 · ${cnt}篇 · ${fmtNum(words)}词`
                : `${d.getMonth() + 1}月${d.getDate()}日`;
            hm += `<div class="nd-heat-col" style="width:${S}px;height:${S}px;border-radius:${R}px;flex-shrink:0;background:${clr(lv)};transition:background .15s;animation-delay:${cellDelay(c)}" title="${tip}" data-l="${lv}"></div>`;
        }
        hm += '</div>';
    }
    hm += '</div></div></div>';
    hm += '<div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;padding:8px 12px 10px;font-size:10px;color:var(--text-muted);">';
    hm += '<span style="margin-right:2px;">Less</span>';
    for (let i = 0; i <= 4; i++) {
        hm += `<div style="width:11px;height:11px;border-radius:${R}px;background:${clr(i)};" data-l="${i}"></div>`;
    }
    hm += '<span style="margin-left:2px;">More</span></div></div>';
    return hm;
}
