import { Vault } from 'obsidian';

export function registerFolderToggle(container: HTMLElement): void {
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const fh = target.closest('.nd-fh') as HTMLElement | null;
        if (!fh) return;

        const tid = fh.getAttribute('data-target');
        const c = tid ? container.querySelector('#' + CSS.escape(tid)) : null;
        const a = tid ? container.querySelector('#' + CSS.escape(tid) + '-a') as HTMLElement | null : null;
        if (!c) return;

        const isOpen = c.getAttribute('data-open') === '1';
        c.classList.toggle('nd-show', !isOpen);
        if (a) a.style.transform = isOpen ? '' : 'rotate(90deg)';
        (fh as HTMLElement).style.borderBottom = isOpen ? '1px solid transparent' : '1px solid var(--background-modifier-border)';
        c.setAttribute('data-open', isOpen ? '0' : '1');
        fh.setAttribute('data-open', isOpen ? '0' : '1');
    });
}

export function registerTaskCheckbox(container: HTMLElement, vault: Vault, onCacheInvalidate: () => void): void {
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const cb = target.closest('.nd-cb') as HTMLElement | null;
        if (!cb) return;

        e.stopPropagation();
        const row = cb.closest('.nd-tr') as HTMLElement | null;
        const path = cb.getAttribute('data-path');
        const line = parseInt(cb.getAttribute('data-line') || '0');
        if (!row || !path || !line) return;

        cb.textContent = '\u2713';
        cb.style.color = '#22c55e';

        setTimeout(async () => {
            try {
                const file = vault.getAbstractFileByPath(path);
                if (file && 'read' in file && 'modify' in file) {
                    let content = await vault.read(file as any);
                    content = content.replace(/\r\n/g, '\n');
                    const lines = content.split('\n');
                    const li = line - 1;
                    if (li >= 0 && li < lines.length) {
                        lines[li] = lines[li].replace(/^(\s*[-*+]\s*)\[\s\](\s*)/, '[x]');
                        await vault.modify(file as any, lines.join('\n'));
                    }
                }
                row.remove();
                onCacheInvalidate();
            } catch (err) {
                console.error('mark task failed:', err);
                cb.textContent = '\u2B1C';
                cb.style.color = '';
            }
        }, 300);
    });
}
