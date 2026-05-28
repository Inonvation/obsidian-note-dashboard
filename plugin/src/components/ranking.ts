import { DashboardData } from '../data';
import { fmtNum } from '../stats/word-count';
import { escapeHtml } from '../utils';

const RANK = ['🥇', '🥈', '🥉'];

function renderRankItem(d: { name: string; words: number; notes?: number; path?: string }, i: number, opts: {
    showEmojiRank?: boolean;
    showNotes?: boolean;
    icon?: string;
    link?: string;
}, scheme: any, totalWords: number): string {
    const top = i < 3;
    const rankStr = opts.showEmojiRank !== false ? (RANK[i] || '' + (i + 1)) : '' + (i + 1);
    const color = scheme.bar[i % scheme.bar.length];
    const share = totalWords > 0 ? d.words / totalWords * 100 : 0;
    const shareStr = share >= 1 ? share.toFixed(1) + '%' : (share > 0 ? '<1%' : '0%');
    const barW = Math.max(2, Math.round(share));
    const icon = opts.icon || '📁';

    const nameSpan = opts.link
        ? `<span style="flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:${top ? 600 : 400};cursor:pointer;" data-nd-link="${escapeHtml(opts.link)}">${icon} ${escapeHtml(d.name)}</span>`
        : `<span style="flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:${top ? 600 : 400};">${icon} ${escapeHtml(d.name)}</span>`;

    let h = `<div class="nd-row" style="display:flex;align-items:center;gap:4px;padding:3px 6px;${top ? 'background:var(--background-primary-alt);border-radius:6px;' : ''}">`;
    h += `<span style="width:18px;text-align:center;font-size:${top ? 12 : 10}px;font-weight:${top ? 600 : 400};color:${top ? 'var(--text-normal)' : 'var(--text-muted)'};flex-shrink:0;">${rankStr}</span>`;
    h += nameSpan;
    h += `<div style="display:flex;align-items:center;gap:2px;flex-shrink:0;">`;
    h += `<span style="font-size:8px;color:var(--text-faint);min-width:20px;text-align:right;">${shareStr}</span>`;
    h += `<div class="nd-bar" style="width:50px;">`;
    h += `<div class="nd-bar-fill" data-w="${barW}" style="width:${barW}%;height:100%;background:linear-gradient(90deg,${color}bb,${color});border-radius:6px;min-width:3px;"></div>`;
    h += '</div></div>';
    if (opts.showNotes) h += `<span style="width:30px;text-align:right;font-size:10px;color:var(--text-muted);flex-shrink:0;">${d.notes || 0}</span>`;
    h += `<span style="width:45px;text-align:right;font-size:10px;font-weight:600;flex-shrink:0;">${fmtNum(d.words)}</span></div>`;
    return h;
}

function rankHeader(cols: { label: string; style?: string }[]): string {
    let h = '<div style="display:flex;align-items:center;gap:4px;padding:4px 6px;font-size:9px;color:var(--text-muted);font-weight:600;background:var(--background-secondary);border-radius:6px;margin-bottom:3px;">';
    h += '<span style="width:18px;flex-shrink:0;text-align:center;">#</span>';
    cols.forEach(c => h += `<span style="${c.style || 'flex:1'}">${c.label}</span>`);
    return h + '</div>';
}

export function renderRanking(data: DashboardData, scheme: any, folderTopN: number): string {
    const fileRankData = data.allFiles
        .map(f => ({
            name: f.name.replace('.md', ''),
            path: f.path,
            words: 0,
            notes: 1,
        }))
        .sort((a, b) => b.words - a.words);

    let html = '<div class="nd-card nd-pad nd-anim nd-anim-2" style="margin-bottom:10px;">';

    const folderToggleId = 'nd-folder-toggle-' + Date.now();
    const folderListId = 'nd-folder-list-' + Date.now();
    const fileListId = 'nd-file-list-' + Date.now();

    html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">`;
    html += `<span style="font-size:14px;font-weight:600;">📂 排行榜</span>`;
    html += `<div style="display:flex;gap:4px;margin-left:auto;">`;
    html += `<button class="nd-rank-tab nd-rank-tab-active" data-target="${folderListId}" data-other="${fileListId}" style="font-size:10px;padding:2px 8px;border-radius:4px;border:1px solid var(--interactive-accent);background:var(--interactive-accent);color:#fff;cursor:pointer;">文件夹</button>`;
    html += `<button class="nd-rank-tab" data-target="${fileListId}" data-other="${folderListId}" style="font-size:10px;padding:2px 8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-muted);cursor:pointer;">文件</button>`;
    html += `</div></div>`;

    html += `<div id="${folderListId}">`;
    let listHTML = '<div style="display:flex;flex-direction:column;gap:1px;">';
    listHTML += rankHeader([
        { label: '文件夹', style: 'flex:1' },
        { label: '占比', style: 'width:72px;text-align:center;flex-shrink:0' },
        { label: '笔记', style: 'width:30px;text-align:right;flex-shrink:0' },
        { label: '词数', style: 'width:45px;text-align:right;flex-shrink:0' },
    ]);

    const topFolders = data.folderData.slice(0, folderTopN);
    for (let i = 0; i < topFolders.length; i++) {
        listHTML += renderRankItem(topFolders[i], i, { showEmojiRank: true, showNotes: true }, scheme, data.totalWords);
    }
    listHTML += '</div>';
    html += listHTML;
    html += `</div>`;

    html += `<div id="${fileListId}" style="display:none;">`;
    let fileHTML = '<div style="display:flex;flex-direction:column;gap:1px;">';
    fileHTML += rankHeader([
        { label: '文件', style: 'flex:1' },
        { label: '占比', style: 'width:72px;text-align:center;flex-shrink:0' },
        { label: '词数', style: 'width:45px;text-align:right;flex-shrink:0' },
    ]);

    const topFiles = fileRankData.slice(0, folderTopN);
    for (let i = 0; i < topFiles.length; i++) {
        fileHTML += renderRankItem(topFiles[i], i, { icon: '📄', link: topFiles[i].path }, scheme, data.totalWords);
    }
    fileHTML += '</div>';
    html += fileHTML;
    html += `</div>`;

    html += '</div>';
    return html;
}
