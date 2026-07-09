import { App } from 'obsidian';
import { DashboardData, TaskItem } from '../data';
import { escapeHtml } from '../utils';

interface AnalyzedTask {
    text: string;
    displayText: string;
    isUrgent: boolean;
    isImportant: boolean;
    dueDate: Date | null;
    dueStatus: string;
}

function analyzeTask(task: TaskItem, taskTags: string[]): AnalyzedTask {
    const text = task.text || '';
    const isUrgent = /!!/.test(text);
    const isImportant = (/!(?!!)/.test(text) && !/!!/.test(text)) || /#important/i.test(text);
    const dueMatch = text.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
    const dueDate = dueMatch ? new Date(dueMatch[1]) : null;
    let dueStatus = 'none';
    if (dueDate) {
        const diff = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff < 0) dueStatus = 'overdue';
        else if (diff === 0) dueStatus = 'today';
        else if (diff <= 2) dueStatus = 'soon';
        else dueStatus = 'future';
    }
    const tagPattern = new RegExp(taskTags.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!\\w)').join('|'), 'gi');
    const displayText = text
        .replace(/!!/g, '')
        .replace(/!(?!!)/g, '')
        .replace(tagPattern, '')
        .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    return { text, displayText, isUrgent, isImportant, dueDate, dueStatus };
}

function badge(text: string, color: string, bg: string, pulse: boolean): string {
    const a = pulse ? 'animation:ndPulseTag 2s ease-in-out infinite;' : '';
    return `<span style="display:inline-flex;font-size:9px;padding:0 6px;border-radius:6px;background:${bg};color:${color};font-weight:600;line-height:1.8;${a}">${text}</span>`;
}

function dueBadge(a: AnalyzedTask): string {
    if (!a.dueDate) return '';
    const m: Record<string, { l: string; c: string; b: string }> = {
        overdue: { l: '逾期', c: '#ef4444', b: 'rgba(239,68,68,0.15)' },
        today: { l: '今日到期', c: '#f97316', b: 'rgba(249,115,22,0.15)' },
        soon: { l: '即将到期', c: '#ca8a04', b: 'rgba(234,179,8,0.12)' },
        future: { l: `${a.dueDate.getMonth() + 1}/${a.dueDate.getDate()}`, c: 'var(--text-faint)', b: 'transparent' },
    };
    const info = m[a.dueStatus];
    return info ? badge(`📅 ${info.l}`, info.c, info.b, a.dueStatus === 'overdue' || a.dueStatus === 'today') : '';
}

function priBadge(a: AnalyzedTask): string {
    if (a.isUrgent) return badge('🔴 紧急', '#ef4444', 'rgba(239,68,68,0.15)', true);
    if (a.isImportant) return badge('🟠 重要', '#f97316', 'rgba(249,115,22,0.12)', false);
    return '';
}

function renderTaskRow(task: TaskItem, taskTags: string[]): string {
    const a = analyzeTask(task, taskTags);
    const acc = a.isUrgent ? '#ef4444' : a.isImportant ? '#f97316' : 'var(--text-muted)';
    const taskId = 'nd-t-' + task.path.replace(/[^a-z0-9]/gi, '-') + '-L' + task.line;
    return `<div class="nd-tr" style="display:flex;align-items:center;gap:6px;padding:3px 8px 3px 12px;border-radius:6px;border-left:2px solid ${acc}33;transition:background .15s;">`
        + `<span id="${taskId}" class="nd-cb" data-path="${escapeHtml(task.path)}" data-line="${task.line}" style="color:var(--text-faint);font-size:12px;flex-shrink:0;cursor:pointer;transition:transform .15s,color .15s;user-select:none;" title="点击标记完成">⬜</span>`
        + `<span style="flex:1;font-size:12.5px;color:var(--text-normal);line-height:1.5;word-break:break-word;min-width:0;">${escapeHtml(a.displayText || a.text)}</span>`
        + `<span style="display:flex;align-items:center;gap:3px;flex-shrink:0;">${priBadge(a)}${dueBadge(a)}</span>`
        + `</div>`;
}

export function renderTasksBoard(data: DashboardData, scheme: any, taskTags: string[], maxOpen: number, app: App): string {
    const { pendingTasks, totalDone, allTasks } = data;
    const totalAll = totalDone + pendingTasks.length;
    const donePct = totalAll > 0 ? Math.round(totalDone / totalAll * 100) : 0;

    // 一次性分析所有 pendingTasks，缓存结果避免重复 analyzeTask 调用
    const analyzedCache = new Map<TaskItem, AnalyzedTask>();
    for (const t of pendingTasks) {
        analyzedCache.set(t, analyzeTask(t, taskTags));
    }

    let urgCnt = 0, impCnt = 0;
    for (const a of analyzedCache.values()) {
        if (a.isUrgent) urgCnt++;
        else if (a.isImportant) impCnt++;
    }

    const fileGroups = new Map<string, { file: string; tasks: TaskItem[]; done: number; total: number }>();
    for (const task of pendingTasks) {
        const f = task.path;
        if (!fileGroups.has(f)) fileGroups.set(f, { file: f, tasks: [], done: 0, total: 0 });
        fileGroups.get(f)!.tasks.push(task);
    }
    for (const f of allTasks) {
        const g = fileGroups.get(f.path);
        if (g) {
            if (f.completed) g.done++;
            g.total++;
        }
    }
    const sortedFiles = [...fileGroups.values()].sort((a, b) => b.tasks.length - a.tasks.length);

    let k = `<div class="nd-card nd-anim nd-anim-4" style="padding:12px 14px;margin-bottom:10px;">`;

    k += `<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px;">`;
    k += `<div style="display:flex;align-items:center;gap:8px;">`;
    k += `<span style="font-size:16px;font-weight:700;background:${scheme.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">📋 待办看板</span>`;
    k += `<span style="font-size:11px;color:var(--text-muted);font-weight:400;background:var(--background-secondary);padding:1px 8px;border-radius:8px;">${pendingTasks.length}项</span>`;
    if (urgCnt > 0) k += `<span style="font-size:10px;padding:1px 7px;border-radius:6px;background:rgba(239,68,68,0.12);color:#ef4444;font-weight:600;">🔴${urgCnt}</span>`;
    if (impCnt > 0) k += `<span style="font-size:10px;padding:1px 7px;border-radius:6px;background:rgba(249,115,22,0.1);color:#f97316;font-weight:600;">🟠${impCnt}</span>`;
    k += `</div>`;
    k += `<div style="display:flex;align-items:center;gap:6px;">`;
    k += `<span style="font-size:10px;color:var(--text-muted);">${donePct}%</span>`;
    k += `<div style="width:64px;height:5px;border-radius:3px;background:var(--background-secondary);overflow:hidden;">`;
    k += `<div class="nd-bar-fill" style="width:${Math.max(donePct, 2)}%;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:3px;"></div></div>`;
    k += `<span style="font-size:9px;color:var(--text-faint);">${totalDone}/${totalAll}</span>`;
    k += `</div></div>`;

    if (sortedFiles.length === 0) {
        k += `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">🎉 所有任务已完成！</div>`;
    } else {
        sortedFiles.forEach((g, fi) => {
            const fn = g.file.split('/').pop()?.replace('.md', '') || g.file;
            const pct = g.total > 0 ? Math.round(g.done / g.total * 100) : 0;
            const analyzed = g.tasks.map(t => ({ task: t, ...(analyzedCache.get(t) || analyzeTask(t, taskTags)) }));
            const hasU = analyzed.some(a => a.isUrgent);
            const hasI = analyzed.some(a => a.isImportant && !a.isUrgent);
            analyzed.sort((a, b) => {
                if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
                if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
                return 0;
            });
            const sorted = analyzed.map(a => a.task);
            const cId = 'nd-fc-' + fi;
            const defOpen = fi < maxOpen;

            k += `<div style="margin-bottom:4px;border-radius:10px;border:1px solid var(--background-modifier-border);overflow:hidden;transition:border-color .25s;">`;
            k += `<div class="nd-fh" data-target="${cId}" data-open="${defOpen ? '1' : '0'}" style="display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;background:var(--background-primary);border-bottom:1px solid ${defOpen ? 'var(--background-modifier-border)' : 'transparent'};user-select:none;" title="${escapeHtml(g.file)}">`;
            k += `<span id="${cId}-a" style="flex-shrink:0;font-size:10px;color:var(--text-faint);transition:transform .3s;${defOpen ? 'transform:rotate(90deg);' : ''}">▶</span>`;
            k += `<span style="flex:1;font-size:12.5px;font-weight:600;color:var(--text-normal);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 ${escapeHtml(fn)}</span>`;
            if (hasU) k += `<span style="font-size:8px;padding:0 5px;border-radius:4px;background:rgba(239,68,68,0.12);color:#ef4444;font-weight:700;line-height:1.8;">!!</span>`;
            else if (hasI) k += `<span style="font-size:8px;padding:0 5px;border-radius:4px;background:rgba(249,115,22,0.1);color:#f97316;font-weight:600;line-height:1.8;">!</span>`;
            k += `<div style="width:56px;height:6px;border-radius:3px;background:var(--background-secondary);overflow:hidden;flex-shrink:0;"><div style="width:${pct}%;height:100%;background:${scheme.gradient};border-radius:3px;transition:width .8s;"></div></div>`;
            k += `<span style="font-size:10px;color:var(--text-muted);white-space:nowrap;flex-shrink:0;min-width:28px;text-align:right;">${g.done}/${g.total}</span>`;
            k += `<span style="font-size:10px;color:var(--text-faint);white-space:nowrap;">${g.tasks.length}项</span>`;
            k += `</div>`;
            k += `<div id="${cId}" data-open="${defOpen ? '1' : '0'}" class="nd-file-content${defOpen ? ' nd-show' : ''}">`;
            sorted.forEach((t) => { k += renderTaskRow(t, taskTags); });
            k += `</div></div>`;
        });
    }

    k += '</div>';
    return k;
}
