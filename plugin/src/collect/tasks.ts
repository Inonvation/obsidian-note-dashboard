import { TaskItem } from '../data';

export function parseTasks(content: string, filePath: string): TaskItem[] {
  const tasks: TaskItem[] = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const match = line.match(/^\s*[-*+] \[([ xX])\] (.+)/);
    if (match) {
      tasks.push({
        path: filePath,
        line: idx + 1,
        text: match[2],
        completed: /[xX]/.test(match[1]),
      });
    }
  });
  return tasks;
}
