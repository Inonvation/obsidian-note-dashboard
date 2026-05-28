import { moment } from 'obsidian';
import { DashboardData } from '../data';
import { fmtNum } from '../stats/word-count';
import { ColorScheme } from '../types';

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

function renderBarChart(rows: ChartRow[], scheme: ColorScheme, paneId: string): string {
    const yScale = niceScale(Math.max(...rows.map(r => r.words), 1), 4);
    const yMax = yScale.max;
    const barAreaHeight = 120;

    let html = '<div style="display:flex;align-items:stretch;">';
    
    // Y axis
    html += `<div style="flex-shrink:0;min-width:22px;display:flex;flex-direction:column;justify-content:space-between;padding:0 5px 4px 0;height:${barAreaHeight}px;position:sticky;left:0;z-index:2;background:var(--background-primary);">`;
    for (let t = yScale.ticks.length - 1; t >= 0; t--) {
        html += `<div style="font-size:9px;color:var(--text-faint);text-align:right;line-height:1;">${fmtNum(yScale.ticks[t])}</div>`;
    }
    html += '</div>';

    // Bar area
    html += `<div style="flex:1;min-width:0;">`;
    html += `<div style="display:flex;align-items:flex-end;gap:2px;height:${barAreaHeight}px;">`;
    
    rows.forEach((r, i) => {
        const pct = yMax > 0 ? Math.max(1, (r.words / yMax) * 100) : 1;
        const color = r.isCurrent ? scheme.bar[0] : scheme.bar[1];
        
        html += `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;flex:1 1 0;height:100%;position:relative;">`;
        html += `<div class="nd-chart-bar" data-h="${pct}" style="width:75%;max-width:36px;height:0%;border-radius:5px 5px 2px 2px;background:${color};cursor:pointer;transition:height 1.2s cubic-bezier(.25,.46,.45,.94);position:relative;" title="${r.label}: ${fmtNum(r.words)}词">`;
        html += `<div class="nd-chart-bar-num" style="position:absolute;bottom:100%;left:0;right:0;display:flex;justify-content:center;pointer-events:none;margin-bottom:2px;opacity:0;transition:opacity .6s ease .8s;"><span style="font-size:8px;font-weight:700;white-space:nowrap;color:var(--text-muted);">${fmtNum(r.words)}</span></div>`;
        html += `</div>`;
        html += `<span style="font-size:9px;color:${r.isCurrent ? scheme.primary : 'var(--text-muted)'};margin-top:3px;white-space:nowrap;line-height:1;font-weight:${r.isCurrent ? 700 : 400};">${r.label}</span>`;
        html += `</div>`;
    });
    
    html += '</div></div></div>';

    // Legend
    html += `<div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px;font-size:10px;color:var(--text-muted);">`;
    html += `<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:${scheme.bar[0]};display:inline-block;"></span> 当前</span>`;
    html += `<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:${scheme.bar[1]};display:inline-block;"></span> 其他</span>`;
    html += `</div>`;

    return html;
}

export function renderChart(data: DashboardData, scheme: ColorScheme, monthCount: number, dayCount: number): string {
    const now = moment();

    const monthRows: ChartRow[] = [];
    for (let i = monthCount - 1; i >= 0; i--) {
        const m = moment().subtract(i, 'months');
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

    const dayPaneId = 'nd-day-' + Date.now();
    const monthPaneId = 'nd-month-' + Date.now();
    const toggleId = 'nd-toggle-' + Date.now();

    let html = '<div class="nd-card nd-pad nd-anim nd-anim-2">';
    
    // Header with toggle
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    html += '<span style="font-size:14px;font-weight:600;">📊 月度/7天图表</span>';
    html += `<div id="${toggleId}" style="position:relative;display:flex;align-items:center;background:var(--background-secondary);border-radius:20px;padding:2px;cursor:pointer;border:1px solid var(--background-modifier-border);font-size:11px;font-weight:500;overflow:hidden;flex-shrink:0;user-select:none;height:26px;min-width:120px;box-sizing:border-box;">`;
    html += `<div style="position:absolute;top:2px;left:2px;width:calc(50% - 2px);height:calc(100% - 4px);border-radius:16px;background:var(--interactive-accent);transition:left .3s cubic-bezier(.4,0,.2,1);z-index:1;box-shadow:0 1px 3px rgba(0,0,0,.15);" data-ind></div>`;
    html += `<span data-view="day" style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;flex:1;height:100%;color:#fff;white-space:nowrap;transition:color .25s ease;padding:0 10px;">近7天</span>`;
    html += `<span data-view="month" style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;flex:1;height:100%;color:var(--text-muted);white-space:nowrap;transition:color .25s ease;padding:0 10px;">月度</span>`;
    html += `</div></div>`;

    html += `<div id="${dayPaneId}"></div>`;
    html += `<div id="${monthPaneId}" style="display:none;"></div>`;
    html += '</div>';

    // Script for animation and toggle
    html += `<script>
(function(){
var dayData=${JSON.stringify(dayRows)};
var monthData=${JSON.stringify(monthRows)};
var bar0='${scheme.bar[0]}';
var bar1='${scheme.bar[1]}';
var primary='${scheme.primary}';

function renderPane(el,data){
    var maxW=Math.max.apply(null,data.map(function(r){return r.words}).concat([1]));
    var h=120;
    var niceStep=Math.pow(10,Math.floor(Math.log10(maxW/4)));
    var cs=[niceStep,niceStep*2,niceStep*5,niceStep*10];
    var step=cs[0];
    for(var i=0;i<cs.length;i++){if(cs[i]*4>=maxW){step=cs[i];break;}}
    var yMax=step*4;
    var s='<div style="display:flex;align-items:stretch;">';
    s+='<div style="flex-shrink:0;min-width:22px;display:flex;flex-direction:column;justify-content:space-between;padding:0 5px 4px 0;height:'+h+'px;">';
    for(var t=4;t>=0;t--)s+='<div style="font-size:9px;color:var(--text-faint);text-align:right;line-height:1;">'+(t*step).toLocaleString()+'</div>';
    s+='</div><div style="flex:1;min-width:0;"><div style="display:flex;align-items:flex-end;gap:2px;height:'+h+'px;">';
    data.forEach(function(r,i){
        var pct=yMax>0?Math.max(1,r.words/yMax*100):1;
        var c=r.isCurrent?bar0:bar1;
        s+='<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;flex:1 1 0;height:100%;">';
        s+='<div class="nd-chart-bar" data-h="'+pct+'" style="width:75%;max-width:36px;height:0%;border-radius:5px 5px 2px 2px;background:'+c+';cursor:pointer;transition:height 1.2s cubic-bezier(.25,.46,.45,.94);position:relative;">';
        s+='<div class="nd-chart-bar-num" style="position:absolute;bottom:100%;left:0;right:0;display:flex;justify-content:center;pointer-events:none;margin-bottom:2px;opacity:0;transition:opacity .6s ease .8s;"><span style="font-size:8px;font-weight:700;white-space:nowrap;color:var(--text-muted);">'+r.words.toLocaleString()+'</span></div>';
        s+='</div><span style="font-size:9px;color:'+(r.isCurrent?primary:'var(--text-muted)')+';margin-top:3px;white-space:nowrap;line-height:1;font-weight:'+(r.isCurrent?700:400)+';">'+r.label+'</span></div>';
    });
    s+='</div></div></div>';
    s+='<div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px;font-size:10px;color:var(--text-muted);">';
    s+='<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:'+bar0+';display:inline-block;"></span> 当前</span>';
    s+='<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:'+bar1+';display:inline-block;"></span> 其他</span></div>';
    el.innerHTML=s;
    requestAnimationFrame(function(){
        requestAnimationFrame(function(){
            el.querySelectorAll('.nd-chart-bar').forEach(function(b){b.style.height=b.dataset.h+'%'});
            el.querySelectorAll('.nd-chart-bar-num').forEach(function(n){n.style.opacity='1'});
        });
    });
}

function animBars(el){
    el.querySelectorAll('.nd-chart-bar').forEach(function(b){b.style.transition='none';b.style.height='0%'});
    el.querySelectorAll('.nd-chart-bar-num').forEach(function(n){n.style.opacity='0'});
    requestAnimationFrame(function(){
        requestAnimationFrame(function(){
            el.querySelectorAll('.nd-chart-bar').forEach(function(b){b.style.transition='height 1.2s cubic-bezier(.25,.46,.45,.94)';b.style.height=b.dataset.h+'%'});
            el.querySelectorAll('.nd-chart-bar-num').forEach(function(n){n.style.opacity='1'});
        });
    });
}

var dayPane=document.getElementById('${dayPaneId}');
var monthPane=document.getElementById('${monthPaneId}');
if(dayPane)renderPane(dayPane,dayData);

var toggle=document.getElementById('${toggleId}');
if(toggle){
    var ind=toggle.querySelector('[data-ind]');
    var spans=toggle.querySelectorAll('span[data-view]');
    var cur='day';
    spans.forEach(function(sp){
        sp.addEventListener('click',function(){
            var v=this.dataset.view;
            if(v===cur)return;
            cur=v;
            if(ind)ind.style.left=v==='month'?'calc(50%)':'2px';
            spans.forEach(function(s){s.style.color=s===sp?'#fff':'var(--text-muted)'});
            if(v==='month'){
                if(!monthPane.dataset.loaded){monthPane.dataset.loaded='1';renderPane(monthPane,monthData)}
                dayPane.style.display='none';
                monthPane.style.display='block';
                animBars(monthPane);
            }else{
                monthPane.style.display='none';
                dayPane.style.display='block';
                animBars(dayPane);
            }
        });
    });
}
})();
<\/script>`;

    return html;
}
