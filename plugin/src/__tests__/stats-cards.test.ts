import { renderStatsCards } from '../components/stats-cards';
import { DashboardData, FolderData } from '../data';

function makeMockData(overrides: Partial<DashboardData> = {}): DashboardData {
    const mockFolderData: FolderData[] = [];
    return {
        allFiles: [],
        totalWords: 0,
        fileWords: new Map(),
        dateWords: new Map(),
        dateCount: new Map(),
        todayWords: 0,
        uniqueDays: new Set(),
        streak: 0,
        monthActive: 0,
        daysInMonth: 30,
        folderData: mockFolderData,
        totalDone: 0,
        totalTasks: 0,
        pendingTasks: [],
        allTasks: [],
        planContent: null,
        ...overrides,
    };
}

const scheme = { primary: '#6366f1', accent: '#8b5cf6', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', tag: '#6366f1', bar: ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd'] };

describe('renderStatsCards', () => {
    test('renders 7 cards with empty data', () => {
        const data = makeMockData();
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('0');
        expect(result).toContain('nd-grid');
    });

    test('shows file count', () => {
        const data = makeMockData({ allFiles: [{ path: 'a.md' }, { path: 'b.md' }] as any });
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('2');
    });

    test('formats large word counts', () => {
        const data = makeMockData({ totalWords: 1500 });
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('1.5k');
    });

    test('shows streak', () => {
        const data = makeMockData({ streak: 7 });
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('7');
    });

    test('shows monthActive', () => {
        const data = makeMockData({ monthActive: 15, daysInMonth: 30 });
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('15/30');
    });

    test('shows folder count', () => {
        const data = makeMockData({ folderData: [{ name: 'a', path: '/a', words: 100, notes: 2 }] });
        const result = renderStatsCards(data, scheme);
        expect(result).toContain('1');
    });
});
