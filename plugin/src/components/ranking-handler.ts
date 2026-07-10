export function registerRankTabs(container: HTMLElement): void {
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const rankTab = target.closest('.nd-rank-tab') as HTMLElement | null;
        if (!rankTab) return;

        const targetId = rankTab.getAttribute('data-target');
        const otherId = rankTab.getAttribute('data-other');
        if (targetId) {
            const targetEl = container.querySelector('#' + CSS.escape(targetId)) as HTMLElement | null;
            if (targetEl) targetEl.style.display = '';
        }
        if (otherId) {
            const otherEl = container.querySelector('#' + CSS.escape(otherId)) as HTMLElement | null;
            if (otherEl) otherEl.style.display = 'none';
        }
        const parent = rankTab.parentElement;
        if (parent) {
            parent.querySelectorAll('.nd-rank-tab').forEach((tab: Element) => {
                tab.classList.remove('nd-rank-tab-active');
                (tab as HTMLElement).style.background = 'transparent';
                (tab as HTMLElement).style.color = 'var(--text-muted)';
                (tab as HTMLElement).style.borderColor = 'var(--background-modifier-border)';
            });
        }
        rankTab.classList.add('nd-rank-tab-active');
        rankTab.style.background = 'var(--interactive-accent)';
        rankTab.style.color = '#fff';
        rankTab.style.borderColor = 'var(--interactive-accent)';
    });
}
