import { renderPlanProgress } from '../components/plan-progress';

describe('renderPlanProgress', () => {
    test('null planContent returns null', () => {
        expect(renderPlanProgress(null)).toBeNull();
    });

    test('empty planContent with no tasks returns 0%', () => {
        const result = renderPlanProgress('# Plan\n\nSome text without tasks');
        expect(result).toContain('0/0');
        expect(result).toContain('0%');
    });

    test('all tasks done shows 100%', () => {
        const content = '- [x] task1\n- [x] task2\n- [X] task3';
        const result = renderPlanProgress(content);
        expect(result).toContain('3/3');
        expect(result).toContain('100%');
    });

    test('half done shows 50%', () => {
        const content = '- [x] done\n- [ ] pending';
        const result = renderPlanProgress(content);
        expect(result).toContain('1/2');
        expect(result).toContain('50%');
    });

    test('mixed completed and incomplete', () => {
        const content = '- [x] done1\n- [ ] todo1\n- [x] done2\n- [ ] todo2';
        const result = renderPlanProgress(content);
        expect(result).toContain('2/4');
        expect(result).toContain('50%');
    });
});
