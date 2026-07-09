import { TFile, Vault, moment } from 'obsidian';
import { countWords } from './stats/word-count';

// Cache for word counts to avoid recomputation
const wordCountCache = new Map<string, { mtime: number; words: number }>();

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

    // 批量并行读取，每批 50 个文件
    const BATCH_SIZE = 50;
    const batches: TFile[][] = [];
    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
        batches.push(allFiles.slice(i, i + BATCH_SIZE));
    }
    for (const batch of batches) {
        const results = await Promise.all(batch.map(async (file) => {
            // Check cache first
            const cached = wordCountCache.get(file.path);
            if (cached && cached.mtime === file.stat.mtime) {
                return { file, content: '', words: cached.words };
            }
            const content = await vault.cachedRead(file);
            const words = countWords(content);
            return { file, content, words };
        }));
        for (const { file, content, words } of results) {
            totalWords += words;
            fileWords.set(file.path, words);
            // Update cache
            wordCountCache.set(file.path, { mtime: file.stat.mtime, words });

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
    }

    const folderData: FolderData[] = [...folderMap.entries()]
        .map(([path, data]) => ({
            name: path.split('/').pop() || '未分类',
            path,
            words: data.words,
            notes: data.notes,
        }))
        .sort((a, b) => b.words - a.words);

    // streak — 用纯 Date 减少 moment 开销
    let streak = 0;
    const streakD = new Date();
    streakD.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
        const d = streakD.getFullYear() + '-' + String(streakD.getMonth() + 1).padStart(2, '0') + '-' + String(streakD.getDate()).padStart(2, '0');
        if (dateWords.has(d)) {
            streak++;
            streakD.setDate(streakD.getDate() - 1);
        } else if (i > 0) {
            break;
        } else {
            streakD.setDate(streakD.getDate() - 1);
        }
    }

    // monthActive — 同上用纯 Date
    const nowM = new Date();
    const monthStart = new Date(nowM.getFullYear(), nowM.getMonth(), 1);
    const daysInMonth = new Date(nowM.getFullYear(), nowM.getMonth() + 1, 0).getDate();
    let monthActive = 0;
    for (let i = 0; i < daysInMonth; i++) {
        const d = monthStart.getFullYear() + '-' + String(monthStart.getMonth() + 1).padStart(2, '0') + '-' + String(monthStart.getDate()).padStart(2, '0');
        if (dateWords.has(d)) monthActive++;
        monthStart.setDate(monthStart.getDate() + 1);
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
