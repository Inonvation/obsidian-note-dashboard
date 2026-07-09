import { ItemView, Plugin, TFile, Vault, WorkspaceLeaf } from 'obsidian';
import { collectData, DashboardData } from './src/data';
import { renderStatsCards } from './src/components/stats-cards';
import { renderHeatmap } from './src/components/heatmap';
import { renderChart, renderChartPane, animChartBars } from './src/components/chart';
import { renderRanking } from './src/components/ranking';
import { renderPlanProgress } from './src/components/plan-progress';
import { renderRecentEdits } from './src/components/recent-edits';
import { renderTasksBoard } from './src/components/tasks-board';
import { COLOR_SCHEMES } from './src/color-schemes';
import { NoteDashboardSettings } from './src/types';
import { DEFAULT_SETTINGS } from './src/settings';
import { NoteDashboardSettingTab } from './src/setting-tab';

const VIEW_TYPE = "note-dashboard";

class DashboardView extends ItemView {
    private plugin: NoteDashboardPlugin;
    private cachedData: DashboardData | null = null;
    private clickHandler: ((e: MouseEvent) => void) | null = null;
    private container: HTMLElement | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: NoteDashboardPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE;
    }

    getDisplayText() {
        return "笔记看板";
    }

    getIcon() {
        return "bar-chart-2";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        const dashboardEl = container.createDiv({ cls: "note-dashboard" });
        this.container = dashboardEl;
        await this.renderDashboard(dashboardEl);
    }

    async onClose() {
        if (this.container && this.clickHandler) {
            this.container.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
        this.container = null;
        this.cachedData = null;
    }

    invalidateCache() {
        this.cachedData = null;
        if (this.container) {
            this.renderDashboard(this.container);
        }
    }

    private async renderDashboard(container: HTMLElement) {
        const settings = this.plugin.settings;
        const scheme = COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES.indigo;

        if (!this.cachedData) {
            this.cachedData = await collectData(
                this.app.vault,
                settings.exclude,
                settings.planPath,
                settings.taskTags
            );
        }
        const data = this.cachedData;

        let html = '';

        for (const section of settings.sectionOrder) {
            switch (section) {
                case 'heat':
                    html += '<div data-section="heat"><div class="nd-title">🔥 近一年贡献热力图</div>';
                    html += renderHeatmap(data, scheme, settings.heatWeeks, settings.heatLevels);
                    html += '</div>';
                    break;
                case 'stats':
                    html += '<div data-section="stats"><div class="nd-hr"></div><div class="nd-title">📈 统计总览</div>';
                    html += renderStatsCards(data, scheme);
                    html += '</div>';
                    break;
                case 'chart':
                    html += renderChart(data, scheme, settings.monthCount, settings.dayCount);
                    break;
                case 'rank':
                    html += '<div data-section="rank">';
                    html += renderRanking(data, scheme, settings.folderTopN);
                    html += '</div>';
                    break;
                case 'plan': {
                    const planHtml = renderPlanProgress(data.planContent);
                    if (planHtml) html += planHtml;
                    break;
                }
                case 'recent':
                    html += renderRecentEdits(data);
                    break;
                case 'tasks':
                    html += '<div data-section="tasks"><div class="nd-hr"></div>';
                    html += renderTasksBoard(data, scheme, settings.taskTags, settings.maxOpen, this.app);
                    html += '</div>';
                    break;
            }
        }

        // Save scroll positions before updating
        const scrollTop = container.scrollTop;
        const scrollLeft = container.scrollLeft;
        
        container.innerHTML = html;
        
        // Restore scroll positions
        container.scrollTop = scrollTop;
        container.scrollLeft = scrollLeft;
        
        // Initialize chart panes
        this.initChartPanes(container);

        requestAnimationFrame(() => {
            container.querySelectorAll('.nd-anim').forEach((el, i) => {
                (el as HTMLElement).style.animationDelay = `${i * 0.08}s`;
            });
            setTimeout(() => {
                container.querySelectorAll('.nd-bar-fill').forEach(el => el.classList.add('nd-in'));
            }, 300);

            const heatScroll = container.querySelector('.nd-heat-scroll');
            if (heatScroll) {
                heatScroll.scrollLeft = heatScroll.scrollWidth;
            }
        });

        if (this.clickHandler) {
            container.removeEventListener('click', this.clickHandler);
        }
        this.clickHandler = (e: MouseEvent) => this.handleClick(e, container);
        container.addEventListener('click', this.clickHandler);
    }

    private initChartPanes(container: HTMLElement) {
        // Render day pane by default
        const dayPane = container.querySelector('.nd-chart-pane[data-chart-type="day"]') as HTMLElement;
        if (dayPane && !dayPane.dataset.loaded) {
            const data = JSON.parse(dayPane.dataset.chartData || '[]');
            const bar0 = dayPane.dataset.bar0 || '';
            const bar1 = dayPane.dataset.bar1 || '';
            const primary = dayPane.dataset.primary || '';
            renderChartPane(dayPane, data, bar0, bar1, primary);
            dayPane.dataset.loaded = '1';
        }
    }

    private handleClick(e: MouseEvent, container: HTMLElement) {
        const target = e.target as HTMLElement;
        const link = target.closest('[data-nd-link]');
        if (link) {
            const path = link.getAttribute('data-nd-link');
            if (path) {
                this.app.workspace.openLinkText(path, '', false);
            }
        }

        // Handle chart toggle
        const chartTab = target.closest('.nd-chart-tab');
        if (chartTab) {
            const view = chartTab.getAttribute('data-view');
            const toggle = chartTab.closest('.nd-chart-toggle');
            if (!toggle) return;
            
            const ind = toggle.querySelector('[data-ind]') as HTMLElement;
            const tabs = toggle.querySelectorAll('.nd-chart-tab');
            const dayPane = container.querySelector('.nd-chart-pane[data-chart-type="day"]') as HTMLElement;
            const monthPane = container.querySelector('.nd-chart-pane[data-chart-type="month"]') as HTMLElement;
            
            if (!dayPane || !monthPane) return;
            
            // Update toggle indicator
            if (ind) {
                ind.style.left = view === 'month' ? 'calc(50%)' : '2px';
            }
            
            // Update tab colors
            tabs.forEach(tab => {
                (tab as HTMLElement).style.color = tab === chartTab ? '#fff' : 'var(--text-muted)';
            });
            
            // Switch panes
            if (view === 'month') {
                if (!monthPane.dataset.loaded) {
                    const data = JSON.parse(monthPane.dataset.chartData || '[]');
                    const bar0 = monthPane.dataset.bar0 || '';
                    const bar1 = monthPane.dataset.bar1 || '';
                    const primary = monthPane.dataset.primary || '';
                    renderChartPane(monthPane, data, bar0, bar1, primary);
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
            return;
        }

        const rankTab = target.closest('.nd-rank-tab');
        if (rankTab) {
            const targetId = rankTab.getAttribute('data-target');
            const otherId = rankTab.getAttribute('data-other');
            if (targetId) {
                const targetEl = container.querySelector(`#${CSS.escape(targetId)}`);
                if (targetEl) (targetEl as HTMLElement).style.display = '';
            }
            if (otherId) {
                const otherEl = container.querySelector(`#${CSS.escape(otherId)}`);
                if (otherEl) (otherEl as HTMLElement).style.display = 'none';
            }
            const tabs = rankTab.parentElement?.querySelectorAll('.nd-rank-tab');
            tabs?.forEach(tab => {
                tab.classList.remove('nd-rank-tab-active');
                (tab as HTMLElement).style.background = 'transparent';
                (tab as HTMLElement).style.color = 'var(--text-muted)';
                (tab as HTMLElement).style.borderColor = 'var(--background-modifier-border)';
            });
            rankTab.classList.add('nd-rank-tab-active');
            (rankTab as HTMLElement).style.background = 'var(--interactive-accent)';
            (rankTab as HTMLElement).style.color = '#fff';
            (rankTab as HTMLElement).style.borderColor = 'var(--interactive-accent)';
            return;
        }

        const fh = target.closest('.nd-fh');
        if (fh) {
            const tid = fh.getAttribute('data-target');
            const c = tid ? container.querySelector(`#${CSS.escape(tid)}`) : null;
            const a = tid ? container.querySelector(`#${CSS.escape(tid)}-a`) : null;
            if (!c) return;
            const isOpen = c.getAttribute('data-open') === '1';
            c.classList.toggle('nd-show', !isOpen);
            if (a) (a as HTMLElement).style.transform = isOpen ? '' : 'rotate(90deg)';
            (fh as HTMLElement).style.borderBottom = isOpen ? '1px solid transparent' : '1px solid var(--background-modifier-border)';
            c.setAttribute('data-open', isOpen ? '0' : '1');
            fh.setAttribute('data-open', isOpen ? '0' : '1');
        }

        const cb = target.closest('.nd-cb');
        if (cb) {
            e.stopPropagation();
            const row = cb.closest('.nd-tr');
            const path = cb.getAttribute('data-path');
            const line = parseInt(cb.getAttribute('data-line') || '0');
            if (!row || !path || !line) return;

            cb.textContent = '✅';
            (cb as HTMLElement).style.color = '#22c55e';

            setTimeout(async () => {
                try {
                    const file = this.app.vault.getAbstractFileByPath(path);
                    if (file) {
                        let content = await this.app.vault.read(file);
                        content = content.replace(/\r\n/g, '\n');
                        const lines = content.split('\n');
                        const li = line - 1;
                        if (li >= 0 && li < lines.length) {
                            lines[li] = lines[li].replace(/^(\s*[-*+]\s*)\[\s\](\s*)/, '$1[x]$2');
                            await this.app.vault.modify(file, lines.join('\n'));
                        }
                    }
                    row.remove();
                    this.cachedData = null;
                } catch (err) {
                    console.error('mark task failed:', err);
                    cb.textContent = '⬜';
                    (cb as HTMLElement).style.color = '';
                }
            }, 300);
        }
    }
}

export default class NoteDashboardPlugin extends Plugin {
    settings: NoteDashboardSettings;
    private refreshTimer: number | null = null;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf) => new DashboardView(leaf, this)
        );

        this.addRibbonIcon('bar-chart-2', '笔记看板', () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-note-dashboard',
            name: '打开笔记看板',
            callback: () => {
                this.activateView();
            }
        });

        this.addCommand({
            id: 'refresh-note-dashboard',
            name: '刷新笔记看板',
            callback: () => {
                this.refreshDashboard();
            }
        });

        this.addSettingTab(new NoteDashboardSettingTab(this.app, this));

        // 合并 vault 事件注册
        for (const evt of ['modify', 'create', 'delete', 'rename']) {
            this.registerEvent(
                (this.app.vault as Vault).on(evt, () => this.scheduleRefresh())
            );
        }

        this.app.workspace.onLayoutReady(() => {
            if (!this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
                this.activateView();
            }
        });
    }

    onunload() {
        if (this.refreshTimer !== null) {
            window.clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    private scheduleRefresh() {
        if (this.refreshTimer !== null) return;
        this.refreshTimer = window.setTimeout(() => {
            this.refreshTimer = null;
            this.refreshDashboard();
        }, 1000);
    }

    private refreshDashboard() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        for (const leaf of leaves) {
            const view = leaf.view;
            if (view instanceof DashboardView) {
                view.invalidateCache();
            }
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.refreshDashboard();
    }

    async activateView() {
        const { workspace } = this.app;
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE);

        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = workspace.getRightLeaf(false);
            if (leaf) {
                await leaf.setViewState({ type: VIEW_TYPE, active: true });
            }
        }

        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }
}