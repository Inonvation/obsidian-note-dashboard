import { countWords, fmtNum } from '../stats/word-count';

describe('countWords', () => {
    test('空字符串返回0', () => {
        expect(countWords('')).toBe(0);
        expect(countWords(null as any)).toBe(0);
        expect(countWords(undefined as any)).toBe(0);
    });

    test('纯英文单词', () => {
        expect(countWords('hello world')).toBe(2);
        expect(countWords('Hello World')).toBe(2);
        expect(countWords('hello world test')).toBe(3);
    });

    test('纯中文字符', () => {
        expect(countWords('你好世界')).toBe(4);
        expect(countWords('中文测试')).toBe(4);
    });

    test('混合中英文', () => {
        expect(countWords('hello 你好')).toBe(3); // hello + 你 + 好
        expect(countWords('hello world 世界')).toBe(5);
    });

    test('忽略 frontmatter', () => {
        const content = `---
title: test
tags: [a, b]
---
hello world`;
        expect(countWords(content)).toBe(2);
    });

    test('忽略代码块', () => {
        const content = `hello
\`\`\`javascript
console.log('test');
\`\`\`
world`;
        expect(countWords(content)).toBe(2);
    });

    test('忽略行内代码', () => {
        const content = 'hello `code` world';
        expect(countWords(content)).toBe(2);
    });

    test('忽略 Obsidian 嵌入', () => {
        const content = 'hello ![[image.jpg]] world';
        expect(countWords(content)).toBe(2);
    });

    test('忽略 Obsidian 链接但保留显示文本', () => {
        const content = 'hello [[page|显示文本]] world';
        expect(countWords(content)).toBe(4); // hello + 显示 + 文本 + world
    });

    test('忽略 Markdown 链接但保留文本', () => {
        const content = 'hello [link text](url) world';
        expect(countWords(content)).toBe(4); // hello + link + text + world
    });

    test('忽略 Markdown 格式', () => {
        const content = 'hello *italic* world **bold** test';
        expect(countWords(content)).toBe(4);
    });

    test('忽略标题标记', () => {
        const content = '# Title\n## Subtitle\nhello world';
        expect(countWords(content)).toBe(2);
    });

    test('忽略列表标记', () => {
        const content = '- item1\n* item2\n+ item3';
        expect(countWords(content)).toBe(6); // item1 + item2 + item3
    });

    test('忽略引用标记', () => {
        const content = '> quote\nhello world';
        expect(countWords(content)).toBe(2);
    });
});

describe('fmtNum', () => {
    test('格式化数字', () => {
        expect(fmtNum(0)).toBe('0');
        expect(fmtNum(123)).toBe('123');
        expect(fmtNum(1000)).toBe('1k');
        expect(fmtNum(1500)).toBe('1.5k');
        expect(fmtNum(10000)).toBe('10k');
        expect(fmtNum(100000)).toBe('100k');
        expect(fmtNum(123456)).toBe('123k');
    });
});