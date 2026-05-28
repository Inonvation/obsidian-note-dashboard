import { moment } from 'obsidian';
import { DashboardData } from '../data';
import { fmtNum } from '../stats/word-count';

interface ChartRow {
    label: string;
    words: number;
    isCurrent: boolean;
}

function niceScale(maxVal: number, ticks: number) {
    if (maxVal <= 0) return { max: 100, step: 25, ticks: [0, 25, 50, 75, 100] };
    const rawStep = maxVal / ticks;
    const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const candidates = [pow10, pow10 * 2, pow10 * 5, pow10 * 10];
    let niceStep = candidates[0];
    for (const c of candidates) {
        if (c * ticks >= maxVal) { niceStep = c; break; }
    }
    const tickValues = [];
    for (let i = 0; i <= ticks; i++) tickValues.push(Math.round(i * niceStep * 1000) / 1000);
    return { max: niceStep * ticks, step: niceStep, ticks: tickValues };
}

function renderBarChart(rows: ChartRow[], scheme: any): string {
    const yScale = niceScale(Math.max(...rows.map(r => r.words), 1), 4);
    const yMax = yScale.max;
    const barAreaHeight = 120;

    let html = '<div style="display:flex;align-items:stretch;">';
    html += `<div style="flex-shrink:0;min-width:22px;display:flex;flex-direction:column;justify-content:space-between;padding:0 5px 4px 0;height:${barAreaHeight}px;position:sticky;left:0;z-index:2;background:var(--background-primary);">`;
    for (let t = yScale.ticks.length - 1; t >= 0; t--) {
        html += `<span style="font-size:9px;color:var(--text-faint);line-height:1;">${fmtNum(yScale.ticks[t])}</span>`;
    }
    html += '</div>';

    html += `<div style="flex:1;display:flex;align-items:flex-end;gap:3px;height:${barAreaHeight}px;border-bottom:1px solid var(--background-modifier-border);padding-bottom:1px;">`;
    rows.forEach((r, i) => {
        const h = yMax > 0 ? Math.max(2, (r.words / yMax) * barAreaHeight) : 2;
        const color = r.isCurrent ? scheme.gradient : `linear-gradient(180deg,${scheme.bar[i % scheme.bar.length]},${scheme.bar[i % scheme.bar.length]}88)`;
        html += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">`;
        html += `<div class="nd-chart-bar-inner" style="width:100%;max-width:32px;height:${h}px;background:${color};" title="${r.label}: ${fmtNum(r.words)}词"></div>`;
        html += `<span style="font-size:8px;color:${r.isCurrent ? scheme.primary : 'var(--text-faint)'};margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center;font-weight:${r.isCurrent ? 600 : 400};">${r.label}</span>`;
        html += '</div>';
    });
    html += '</div></div>';
    return html;
}

export function renderChart(data: DashboardData, scheme: any, monthCount: number, dayCount: number): string {
    const now = moment();

    const monthRows: ChartRow[] = [];
    for (let i = monthCount - 1; i >= 0; i--) {
        const m = moment().subtract(i, 'months');
        const key = m.format('YYYY-MM');
        let words = 0;
        const daysInMonth = m.daysInMonth();
        for (let d = 1; d <= daysInMonth; d++) {
            const dayStr = m.clone().date(d).format('YYYY-MM-DD');
            words += data.dateWords.get(dayStr) || 0;
        }
        monthRows.push({
            label: m.format('M月'),
            words,
            isCurrent: i === 0,
        });
    }

    const dayRows: ChartRow[] = [];
    for (let i = dayCount - 1; i >= 0; i--) {
        const d = moment().subtract(i, 'days');
        const key = d.format('YYYY-MM-DD');
        dayRows.push({
            label: d.format('M/D'),
            words: data.dateWords.get(key) || 0,
            isCurrent: i === 0,
        });
    }

    let html = '<div class="nd-card nd-pad nd-anim nd-anim-2">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">';
    html += '<span style="font-size:15px;font-weight:600;">📊 月度/7天图表</span>';
    html += '</div>';

    html += '<div style="margin-bottom:4px;font-size:11px;color:var(--text-muted);font-weight:600;">月度统计</div>';
    html += renderBarChart(monthRows, scheme);

    html += '<div style="margin:12px 0 4px;font-size:11px;color:var(--text-muted);font-weight:600;">最近7天</div>';
    html += renderBarChart(dayRows, scheme);

    html += '</div>';
    return html;
}
