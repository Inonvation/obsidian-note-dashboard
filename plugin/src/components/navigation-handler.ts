export function registerFileNavigation(container: HTMLElement, openLink: (path: string) => void): void {
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('[data-nd-link]') as HTMLElement | null;
        if (!link) return;
        const path = link.getAttribute('data-nd-link');
        if (path) {
            openLink(path);
        }
    });
}
