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
import { registerChartToggle } from './src/components/chart-handler';
import { registerFileNavigation } from './src/components/navigation-handler';
import { registerRankTabs } from './src/components/ranking-handler';
import { registerFolderToggle, registerTaskCheckbox } from './src/components/tasks-board-handler';

const VIEW_TYPE = "note-dashboard";

class DashboardView extends ItemView {
    private plugin: NoteDashboardPlugin;
    private cachedData: DashboardData | null = null;
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
                    html += '<div data-section=\"heat\"><div class=\"nd-title\">\\uD83D\\uDD1F 近一年贡献热力图</div>';
                    html += renderHeatmap(data, scheme, settings.heatWeeks, settings.heatLevels);
                    html += '</div>';
                    break;
                case 'stats':
                    html += '<div data-section=\"stats\"><div class=\"nd-hr\"></div><div class=\"nd-title\">\\uD83D\\uDCF1 统计总览</div>';
                    html += renderStatsCards(data, scheme);
                    html += '</div>';
                    break;
                case 'chart':
                    html += renderChart(data, scheme, settings.monthCount, settings.dayCount);
                    break;
                case 'rank':
                    html += '<div data-section=\"rank\">';
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
                    html += '<div data-section=\"tasks\"><div class=\"nd-hr\"></div>';
                    html += renderTasksBoard(data, scheme, settings.taskTags, settings.maxOpen, this.app);
                    html += '</div>';
                    break;
            }
        }

        const scrollTop = container.scrollTop;
        const scrollLeft = container.scrollLeft;

        container.innerHTML = html;

        container.scrollTop = scrollTop;
        container.scrollLeft = scrollLeft;

        this.initChartPanes(container);

        requestAnimationFrame(() => {
            container.querySelectorAll('.nd-anim').forEach((el, i) => {
                (el as HTMLElement).style.animationDelay = i * 0.08 + 's';
            });
            setTimeout(() => {
                container.querySelectorAll('.nd-bar-fill').forEach(el => el.classList.add('nd-in'));
            }, 300);

            const heatScroll = container.querySelector('.nd-heat-scroll');
            if (heatScroll) {
                heatScroll.scrollLeft = heatScroll.scrollWidth;
            }
        });

        // Register event handlers (uses event delegation, safe to re-register)
        registerChartToggle(container, this.app);
        registerFileNavigation(container, (path) => this.app.workspace.openLinkText(path, '', false));
        registerRankTabs(container);
        registerFolderToggle(container);
        registerTaskCheckbox(container, this.app.vault, () => { this.cachedData = null; });
    }

    private initChartPanes(container: HTMLElement) {
        const dayPane = container.querySelector('.nd-chart-pane[data-chart-type=\"day\"]') as HTMLElement;
        if (dayPane && !dayPane.dataset.loaded) {
            const data = JSON.parse(dayPane.dataset.chartData || '[]');
            renderChartPane(dayPane, data, dayPane.dataset.bar0 || '', dayPane.dataset.bar1 || '', dayPane.dataset.primary || '');
            dayPane.dataset.loaded = '1';
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

        for (const evt of ['modify', 'create', 'delete', 'rename'] as const) {
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
