import { NoteDashboardSettings } from './types';

export const DEFAULT_SETTINGS: NoteDashboardSettings = {
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
