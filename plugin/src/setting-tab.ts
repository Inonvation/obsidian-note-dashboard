import { App, PluginSettingTab, Setting } from 'obsidian';
import type NoteDashboardPlugin from '../main';
import { COLOR_SCHEMES } from './color-schemes';

export class NoteDashboardSettingTab extends PluginSettingTab {
    plugin: NoteDashboardPlugin;

    constructor(app: App, plugin: NoteDashboardPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '笔记看板设置' });

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
