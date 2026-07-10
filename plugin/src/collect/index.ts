import { TFile, Vault, moment } from 'obsidian';
import { countWords } from '../stats/word-count';
import { getCachedWords, setCachedWords } from './cache';
import { parseTasks } from './tasks';
import { computeStreak, computeMonthActive } from './streak';
import type { DashboardData, FolderData, TaskItem } from '../data';

export type { DashboardData, FolderData, TaskItem };

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
    const fileWords = new Map<string, number>();

    const now = moment();
    const todayStr = now.format('YYYY-MM-DD');
    let todayWords = 0;
    const uniqueDays = new Set<string>();

    const allTasks: TaskItem[] = [];

    // Batch parallel reads, 50 files per batch
    const BATCH_SIZE = 50;
    const batches: TFile[][] = [];
    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
        batches.push(allFiles.slice(i, i + BATCH_SIZE));
    }
    for (const batch of batches) {
        const results = await Promise.all(batch.map(async (file) => {
            const cached = getCachedWords(file.path, file.stat.mtime);
            if (cached !== null) {
                return { file, content: '', words: cached };
            }
            const content = await vault.cachedRead(file);
            const words = countWords(content);
            return { file, content, words };
        }));
        for (const { file, content, words } of results) {
            totalWords += words;
            fileWords.set(file.path, words);
            setCachedWords(file.path, file.stat.mtime, words);

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

            const tasks = parseTasks(content, file.path);
            allTasks.push(...tasks);
        }
    }

    const folderData: FolderData[] = [...folderMap.entries()]
        .map(([path, data]) => ({
            name: path.split('/').pop() || '未分类',
            path,
            words: data.words,
            notes: data.notes,
        }))
        .sort((a, b) => b.words - a.words);

    const streak = computeStreak(dateWords);
    const { monthActive, daysInMonth } = computeMonthActive(dateWords);

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
        fileWords,
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
