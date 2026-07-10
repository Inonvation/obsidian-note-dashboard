// Compute streak of consecutive writing days (using plain Date for performance)
export function computeStreak(dateWords: Map<string, number>): number {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // Start from today, go backwards until we find an inactive day
  while (true) {
    const key = formatDate(d);
    if (dateWords.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function computeMonthActive(dateWords: Map<string, number>): { monthActive: number; daysInMonth: number } {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let monthActive = 0;
  for (let i = 0; i < daysInMonth; i++) {
    const key = formatDate(monthStart);
    if (dateWords.has(key)) monthActive++;
    monthStart.setDate(monthStart.getDate() + 1);
  }
  return { monthActive, daysInMonth };
}

function formatDate(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
