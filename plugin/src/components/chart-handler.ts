import { App } from 'obsidian';
import { renderChartPane, animChartBars } from './chart';

export function registerChartToggle(container: HTMLElement, _app: App): void {
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const chartTab = target.closest('.nd-chart-tab') as HTMLElement | null;
        if (!chartTab) return;

        const view = chartTab.getAttribute('data-view');
        const toggle = chartTab.closest('.nd-chart-toggle') as HTMLElement | null;
        if (!toggle) return;

        const ind = toggle.querySelector('[data-ind]') as HTMLElement | null;
        const tabs = toggle.querySelectorAll('.nd-chart-tab');
        const dayPane = container.querySelector('.nd-chart-pane[data-chart-type=\"day\"]') as HTMLElement | null;
        const monthPane = container.querySelector('.nd-chart-pane[data-chart-type=\"month\"]') as HTMLElement | null;
        if (!dayPane || !monthPane) return;

        if (ind) {
            ind.style.left = view === 'month' ? 'calc(50%)' : '2px';
        }
        tabs.forEach((tab: Element) => {
            (tab as HTMLElement).style.color = tab === chartTab ? '#fff' : 'var(--text-muted)';
        });

        if (view === 'month') {
            if (!monthPane.dataset.loaded) {
                const data = JSON.parse(monthPane.dataset.chartData || '[]');
                renderChartPane(monthPane, data, monthPane.dataset.bar0 || '', monthPane.dataset.bar1 || '', monthPane.dataset.primary || '');
                monthPane.dataset.loaded = '1';
            }
            dayPane.style.display = 'none';
            monthPane.style.display = 'block';
            animChartBars(monthPane);
        } else {
            monthPane.style.display = 'none';
            dayPane.style.display = 'block';
            animChartBars(dayPane);
        }
    });
}
