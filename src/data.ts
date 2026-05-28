import { TFile, Vault, moment } from 'obsidian';
import { countWords } from './stats/word-count';

export interface DashboardData {
    allFiles: TFile[];
    totalWords: number;
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

export async function collectData(
    vault: Vault,
    exclude: string[],
    planPath: string,
    taskTags: string[]
): Promise<DashboardData> {
    const allFiles = vault.getMarkdownFiles().filter(f => {
        const parts = f.path.split('/');
        return !parts.some(p => exclude.includes(p));
    });

    const dateWords = new Map<string, number>();
    const dateCount = new Map<string, number>();
    const folderMap = new Map<string, { words: number; notes: number }>();
    let totalWords = 0;

    const now = moment();
    const todayStr = now.format('YYYY-MM-DD');
    let todayWords = 0;
    const uniqueDays = new Set<string>();

    const allTasks: TaskItem[] = [];

    for (const file of allFiles) {
        const content = await vault.cachedRead(file);
        const words = countWords(content);
        totalWords += words;

        const fileDate = moment(file.stat.mtime).format('YYYY-MM-DD');
        dateWords.set(fileDate, (dateWords.get(fileDate) || 0) + words);
        dateCount.set(fileDate, (dateCount.get(fileDate) || 0) + 1);
        uniqueDays.add(fileDate);

        if (fileDate === todayStr) {
            todayWords += words;
        }

        const folderPath = file.parent?.path || '';
        if (!folderMap.has(folderPath)) {
            folderMap.set(folderPath, { words: 0, notes: 0 });
        }
        const fd = folderMap.get(folderPath)!;
        fd.words += words;
        fd.notes += 1;

        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            const match = line.match(/^\s*[-*+] \[([ xX])\] (.+)/);
            if (match) {
                allTasks.push({
                    path: file.path,
                    line: idx + 1,
                    text: match[2],
                    completed: /[xX]/.test(match[1]),
                });
            }
        });
    }

    const folderData: FolderData[] = [...folderMap.entries()]
        .map(([path, data]) => ({
            name: path.split('/').pop() || '未分类',
            path,
            words: data.words,
            notes: data.notes,
        }))
        .sort((a, b) => b.words - a.words);

    let streak = 0;
    const today = moment().startOf('day');
    for (let i = 0; i < 365; i++) {
        const d = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        if (dateWords.has(d)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    const monthStart = moment().startOf('month');
    let monthActive = 0;
    const daysInMonth = monthStart.daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
        const d = monthStart.clone().add(i, 'days').format('YYYY-MM-DD');
        if (dateWords.has(d)) monthActive++;
    }

    let planContent: string | null = null;
    if (planPath) {
        try {
            const planFile = vault.getAbstractFileByPath(planPath);
            if (planFile instanceof TFile) {
                planContent = await vault.cachedRead(planFile);
            }
        } catch (e) {
            // plan file not found
        }
    }

    const pendingTasks = allTasks.filter(t => !t.completed);
    const totalDone = allTasks.filter(t => t.completed).length;

    return {
        allFiles,
        totalWords,
        dateWords,
        dateCount,
        todayWords,
        uniqueDays,
        streak,
        monthActive,
        daysInMonth,
        folderData,
        totalDone,
        totalTasks: allTasks.length,
        pendingTasks,
        allTasks,
        planContent,
    };
}
