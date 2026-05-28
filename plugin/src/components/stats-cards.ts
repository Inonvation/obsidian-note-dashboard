import { DashboardData } from '../data';
import { fmtNum } from '../stats/word-count';
import { isDarkMode } from '../utils';

export function renderStatsCards(data: DashboardData, scheme: any): string {
    const cG = isDarkMode() ? '#86efac' : '#166534';
    const cO = isDarkMode() ? '#fdba74' : '#9a3412';

    const mini = (icon: string, label: string, value: string, color: string | null, iconBg: string, shadowColor: string) =>
        `<div class="nd-mini" style="--nd-card-shadow:${shadowColor};">
            <div class="nd-stat-icon">
                <span class="nd-mini-icon" style="background:radial-gradient(circle,${iconBg} 0%,transparent 70%);">${icon}</span>
            </div>
            <div class="nd-stat-label">${label}</div>
            <div class="nd-val" style="font-size:15px;font-weight:700;margin-top:2px;color:${color || 'var(--text-normal)'};">${value}</div>
        </div>`;

    let s = '<div class="nd-grid nd-grid-stagger">';
    s += mini('📚', '笔记总数', '' + data.allFiles.length, null, scheme.bar[0] + '25', scheme.bar[0] + '30');
    s += mini('📄', '总词数', fmtNum(data.totalWords), null, scheme.bar[1] + '25', scheme.bar[1] + '30');
    s += mini('📅', '活跃天数', '' + data.uniqueDays.size, null, scheme.bar[2] + '25', scheme.bar[2] + '30');
    s += mini('✍️', '今日已写', fmtNum(data.todayWords) + ' 词', cG, '#22c55e25', '#22c55e30');
    s += mini('🔥', '当前连续', data.streak + ' 天', cO, '#f9731625', '#f9731630');
    s += mini('📂', '文件夹数', '' + data.folderData.length, null, scheme.bar[3] + '25', scheme.bar[3] + '30');
    s += `<div class="nd-full nd-anim">
        <span style="font-size:20px;margin-right:8px;">📅</span>
        <span style="font-size:11px;color:var(--text-muted);">本月活跃</span>
        <span style="font-size:16px;font-weight:700;margin-left:8px;color:${cO};">${data.monthActive}/${data.daysInMonth} 天</span>
    </div>`;
    s += '</div>';
    return s;
}
