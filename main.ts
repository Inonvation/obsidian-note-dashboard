import { App, ItemView, Plugin, PluginSettingTab, Setting, TFile, WorkspaceLeaf } from 'obsidian';
import { collectData, DashboardData } from './src/data';
import { renderStatsCards } from './src/components/stats-cards';
import { renderHeatmap } from './src/components/heatmap';
import { renderChart } from './src/components/chart';
import { renderRanking } from './src/components/ranking';
import { renderPlanProgress } from './src/components/plan-progress';
import { renderRecentEdits } from './src/components/recent-edits';
import { renderTasksBoard } from './src/components/tasks-board';
import { escapeHtml } from './src/utils';

const VIEW_TYPE = "note-dashboard";

const COLOR_SCHEMES: Record<string, any> = {
    indigo: {
        primary: '#6366f1',
        accent: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        tag: '#6366f1',
        bar: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#a5b4fc', '#818cf8', '#6d28d9', '#4f46e5']
    },
    emerald: {
        primary: '#10b981',
        accent: '#34d399',
        gradient: 'linear-gradient(135deg,#10b981,#34d399)',
        tag: '#10b981',
        bar: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857', '#065f46', '#064e3b']
    },
    amber: {
        primary: '#f59e0b',
        accent: '#fbbf24',
        gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
        tag: '#f59e0b',
        bar: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#d97706', '#b45309', '#92400e', '#78350f']
    },
    rose: {
        primary: '#f43f5e',
        accent: '#fb7185',
        gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)',
        tag: '#f43f5e',
        bar: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48', '#be123c', '#9f1239', '#881337']
    },
    sky: {
        primary: '#0ea5e9',
        accent: '#38bdf8',
        gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
        tag: '#0ea5e9',
        bar: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7', '#0369a1', '#075985', '#0c4a6e']
    },
    coral: {
        primary: '#f97316',
        accent: '#fb923c',
        gradient: 'linear-gradient(135deg,#f97316,#fb923c)',
        tag: '#f97316',
        bar: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ea580c', '#c2410c', '#9a3412', '#7c2d12']
    },
    slate: {
        primary: '#64748b',
        accent: '#94a3b8',
        gradient: 'linear-gradient(135deg,#64748b,#94a3b8)',
        tag: '#64748b',
        bar: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#475569', '#334155', '#1e293b', '#0f172a']
    },
};

// 插件设置接口
interface NoteDashboardSettings {
    exclude: string[];
    planPath: string;
    heatLevels: number[];
    heatWeeks: number;
    monthCount: number;
    dayCount: number;
    folderTopN: number;
    maxOpen: number;
    taskTags: string[];
    dueEmoji: string;
    estThreshold: number;
    estCoeff: number;
    colorScheme: string;
    sectionOrder: string[];
}

// 默认设置
const DEFAULT_SETTINGS: NoteDashboardSettings = {
    exclude: ['附件', '模板', 'copilot'],
    planPath: 'planning/成长计划.md',
    heatLevels: [400, 1200, 2500],
    heatWeeks: 54,
    monthCount: 12,
    dayCount: 7,
    folderTopN: 5,
    maxOpen: 3,
    taskTags: ['#urgent', '#important', '#doing', '#wip', '#进行中', '#review', '#待回顾'],
    dueEmoji: '📅',
    estThreshold: 200,
    estCoeff: 4,
    colorScheme: 'indigo',
    sectionOrder: ['heat', 'stats', 'chart', 'rank', 'plan', 'recent', 'tasks'],
};

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

        container.innerHTML = html;

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

    private handleClick(e: MouseEvent, container: HTMLElement) {
        const target = e.target as HTMLElement;
        const link = target.closest('[data-nd-link]');
        if (link) {
            const path = link.getAttribute('data-nd-link');
            if (path) {
                this.app.workspace.openLinkText(path, '', false);
            }
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

        this.registerEvent(
            this.app.vault.on('modify', () => this.scheduleRefresh())
        );
        this.registerEvent(
            this.app.vault.on('create', () => this.scheduleRefresh())
        );
        this.registerEvent(
            this.app.vault.on('delete', () => this.scheduleRefresh())
        );
        this.registerEvent(
            this.app.vault.on('rename', () => this.scheduleRefresh())
        );

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

// 设置面板类
class NoteDashboardSettingTab extends PluginSettingTab {
    plugin: NoteDashboardPlugin;

    constructor(app: App, plugin: NoteDashboardPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '笔记看板设置' });

        // 配色方案设置
        new Setting(containerEl)
            .setName('配色方案')
            .setDesc('选择看板的配色主题')
            .addDropdown(dropdown => {
                Object.keys(COLOR_SCHEMES).forEach(scheme => {
                    dropdown.addOption(scheme, scheme);
                });
                dropdown.setValue(this.plugin.settings.colorScheme);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.colorScheme = value;
                    await this.plugin.saveSettings();
                });
            });

        // 排除文件夹设置
        new Setting(containerEl)
            .setName('排除文件夹')
            .setDesc('这些文件夹下的笔记不计入统计（用逗号分隔）')
            .addText(text => text
                .setPlaceholder('附件, 模板, copilot')
                .setValue(this.plugin.settings.exclude.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.exclude = value.split(',').map(s => s.trim()).filter(s => s);
                    await this.plugin.saveSettings();
                }));

        // 成长计划路径设置
        new Setting(containerEl)
            .setName('成长计划路径')
            .setDesc('相对路径，留空隐藏进度条')
            .addText(text => text
                .setPlaceholder('planning/成长计划.md')
                .setValue(this.plugin.settings.planPath)
                .onChange(async (value) => {
                    this.plugin.settings.planPath = value;
                    await this.plugin.saveSettings();
                }));

        // 热力图周数设置
        new Setting(containerEl)
            .setName('热力图周数')
            .setDesc('显示最近多少周的热力图（10-104）')
            .addText(text => text
                .setPlaceholder('54')
                .setValue(this.plugin.settings.heatWeeks.toString())
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 10 && num <= 104) {
                        this.plugin.settings.heatWeeks = num;
                        await this.plugin.saveSettings();
                    }
                }));

        // 文件夹排行数量设置
        new Setting(containerEl)
            .setName('文件夹排行数量')
            .setDesc('显示前N个文件夹（1-50）')
            .addText(text => text
                .setPlaceholder('5')
                .setValue(this.plugin.settings.folderTopN.toString())
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 1 && num <= 50) {
                        this.plugin.settings.folderTopN = num;
                        await this.plugin.saveSettings();
                    }
                }));

        // 待办标签设置
        new Setting(containerEl)
            .setName('待办标签')
            .setDesc('含这些标签的任务标记为重要/紧急（用逗号分隔）')
            .addText(text => text
                .setPlaceholder('#urgent, #important, #doing')
                .setValue(this.plugin.settings.taskTags.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.taskTags = value.split(',').map(s => s.trim()).filter(s => s);
                    await this.plugin.saveSettings();
                }));

        // 月度图表月数设置
        new Setting(containerEl)
            .setName('月度图表月数')
            .setDesc('显示最近几个月的图表（1-24）')
            .addText(text => text
                .setPlaceholder('12')
                .setValue(this.plugin.settings.monthCount.toString())
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 1 && num <= 24) {
                        this.plugin.settings.monthCount = num;
                        await this.plugin.saveSettings();
                    }
                }));

        // 7天图表天数设置
        new Setting(containerEl)
            .setName('7天图表天数')
            .setDesc('显示最近几天的图表（3-30）')
            .addText(text => text
                .setPlaceholder('7')
                .setValue(this.plugin.settings.dayCount.toString())
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 3 && num <= 30) {
                        this.plugin.settings.dayCount = num;
                        await this.plugin.saveSettings();
                    }
                }));

        // 待办看板默认展开数
        new Setting(containerEl)
            .setName('待办看板默认展开数')
            .setDesc('默认展开前N个文件的任务（1-10）')
            .addText(text => text
                .setPlaceholder('3')
                .setValue(this.plugin.settings.maxOpen.toString())
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 1 && num <= 10) {
                        this.plugin.settings.maxOpen = num;
                        await this.plugin.saveSettings();
                    }
                }));
    }
}