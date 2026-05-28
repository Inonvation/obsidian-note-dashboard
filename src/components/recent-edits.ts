import { TFile } from 'obsidian';
import { DashboardData } from '../data';
import { escapeHtml } from '../utils';

function getTimeDiff(mtime: number): string {
    const now = Date.now();
    const diff = now - mtime;
    if (diff < 0) return '刚刚';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    const d = new Date(mtime);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function renderRecentEdits(data: DashboardData): string {
    const recentEdits = [...data.allFiles]
        .sort((a, b) => (b.stat.mtime || 0) - (a.stat.mtime || 0))
        .slice(0, 5);

    if (recentEdits.length === 0) return '';

    let r = '<div data-section="recent"><div class="nd-card nd-pad nd-anim" style="margin-bottom:10px;">';
    r += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">';
    r += '<span style="font-size:15px;font-weight:600;">✏️ 最近编辑</span>';
    r += `<span style="font-size:11px;color:var(--text-muted);">共${recentEdits.length}个</span></div>`;
    r += '<div style="display:flex;flex-direction:column;gap:4px;">';

    const renderRecentItem = (file: TFile) => {
        const name = file.name.replace('.md', '');
        const timeDiff = file.stat.mtime ? getTimeDiff(file.stat.mtime) : '';
        return `<div class="nd-row" style="display:flex;align-items:center;gap:8px;padding:6px 8px;cursor:pointer;" data-nd-link="${escapeHtml(file.path)}">`
            + `<span style="flex:1;font-size:12px;color:var(--text-normal);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 ${escapeHtml(name)}</span>`
            + `<span style="font-size:10px;color:var(--text-faint);white-space:nowrap;">${timeDiff}</span>`
            + '</div>';
    };

    r += renderRecentItem(recentEdits[0]);
    if (recentEdits.length > 1) {
        for (let i = 1; i < recentEdits.length; i++) {
            r += renderRecentItem(recentEdits[i]);
        }
    }
    r += '</div></div></div>';
    return r;
}
