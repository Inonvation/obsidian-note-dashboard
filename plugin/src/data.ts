import { TFile } from 'obsidian';

export { collectData } from './collect/index';

export interface DashboardData {
    allFiles: TFile[];
    totalWords: number;
    fileWords: Map<string, number>;
    dateWords: Map<string, number>;
    dateCount: Map<string, number>;
    todayWords: number;
    uniqueDays: Set<string>;
    streak: number;
    monthActive: number;
    daysInMonth: number;
    folderData: FolderData[];
    totalDone: number;
    totalTasks: number;
    pendingTasks: TaskItem[];
    allTasks: TaskItem[];
    planContent: string | null;
}

export interface FolderData {
    name: string;
    path: string;
    words: number;
    notes: number;
}

export interface TaskItem {
    path: string;
    line: number;
    text: string;
    completed: boolean;
}
