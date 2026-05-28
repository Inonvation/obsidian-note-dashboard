export function renderPlanProgress(planContent: string | null): string | null {
    if (!planContent) return null;

    const tasks = planContent.match(/^\s*[-*+] \[([ xX])\] .+/gm) || [];
    const total = tasks.length;
    const done = tasks.filter(t => /\[[xX]\]/.test(t)).length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;

    let s = '<div data-section="plan"><div class="nd-card nd-pad nd-anim nd-anim-3">';
    s += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">`;
    s += `<span style="font-size:15px;font-weight:600;">🌱 成长进度</span>`;
    s += `<span style="font-size:12px;color:var(--text-muted);">${done}/${total} · ${pct}%</span></div>`;
    s += `<div class="nd-shimmer" style="width:100%;height:20px;background:var(--background-secondary);border-radius:10px;overflow:hidden;border:1px solid var(--background-modifier-border);box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">`;
    s += `<div class="nd-bar-fill" data-w="${Math.max(pct, 2)}" style="width:${Math.max(pct, 2)}%;height:100%;background:linear-gradient(90deg,#86efac,#22c55e,#16a34a);border-radius:10px;display:flex;align-items:center;justify-content:center;">`;
    if (pct > 10) {
        s += `<span style="font-size:11px;font-weight:600;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${pct}%</span>`;
    }
    s += '</div></div></div></div>';
    return s;
}
