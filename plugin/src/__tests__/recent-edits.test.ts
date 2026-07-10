import { renderRecentEdits } from '../components/recent-edits';
import { DashboardData } from '../data';

function makeMockFile(name: string, mtime: number) {
    return {
        name,
        path: 'notes/' + name,
        stat: { mtime },
        parent: { path: 'notes' },
    } as any;
}

describe('renderRecentEdits', () => {
    test('returns empty string with no files', () => {
        const data = { allFiles: [] } as any as DashboardData;
        expect(renderRecentEdits(data)).toBe('');
    });

    test('shows recent file name', () => {
        const now = Date.now();
        const data = { allFiles: [makeMockFile('test.md', now)] } as any as DashboardData;
        const result = renderRecentEdits(data);
        expect(result).toContain('test');
    });

    test('sorts by mtime descending', () => {
        const now = Date.now();
        const data = {
            allFiles: [
                makeMockFile('old.md', now - 3600000),
                makeMockFile('new.md', now),
                makeMockFile('mid.md', now - 1800000),
            ],
        } as any as DashboardData;
        const result = renderRecentEdits(data);
        const newIdx = result.indexOf('new');
        const midIdx = result.indexOf('mid');
        const oldIdx = result.indexOf('old');
        expect(newIdx).toBeLessThan(midIdx);
        expect(midIdx).toBeLessThan(oldIdx);
    });
});
