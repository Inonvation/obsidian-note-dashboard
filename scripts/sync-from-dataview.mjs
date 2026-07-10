/**
 * Sync plugin TypeScript sources from Dataview version.
 * Extracts COLOR_SCHEMES and DEFAULT_CONFIG from dataview/我的笔记看板.md
 * and updates plugin/src/color-schemes.ts and plugin/src/settings.ts.
 *
 * Usage: node scripts/sync-from-dataview.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function readDataview() {
    const content = readFileSync(join(ROOT, 'dataview', '我的笔记看板.md'), 'utf-8');
    // Extract the dataviewjs code block
    const match = content.match(/`dataviewjs\n([\s\S]*?)`/);
    if (!match) throw new Error('Cannot find dataviewjs code block');
    return match[1];
}

function extractVariable(js: string, name: string): string {
    // Try const NAME = { ... } or const NAME = { ... };
    const regex = new RegExp(const\\s+\\s*=\\s*({[\\s\\S]*?});?\\n(?=\\S|$));
    const match = js.match(regex);
    if (match) return match[1];
    throw new Error(Cannot find variable );
}

function generateColorSchemesTS(jsObj: string): string {
    // The COLOR_SCHEMES object in Dataview is almost valid TS
    let ts = jsObj
        .replace(/(\w+):\s*\{/g, (_, key) =>     : {)
        .replace(/primary:'([^']+)'/g,         primary: '')
        .replace(/accent:'([^']+)'/g,         accent: '')
        .replace(/gradient:'([^']+)'/g,         gradient: '')
        .replace(/tag:'([^']+)'/g,         tag: '')
        .replace(/bar:\[([^\]]+)\]/g, (_, items) =>         bar: []);
    return ts;
}

function generateSettingsTS(jsObj: string): string {
    // Convert JS object to TS constant, handling arrays and strings
    return jsObj
        .replace(/exclude:\s*\[([^\]]+)\]/g, (_, arr) =>     exclude: [])
        .replace(/planPath:\s*'([^']+)'/g, "    planPath: ''")
        .replace(/heatLevels:\s*\[([^\]]+)\]/g, (_, arr) =>     heatLevels: [])
        .replace(/heatWeeks:\s*(\d+)/g, '    heatWeeks: ')
        .replace(/monthCount:\s*(\d+)/g, '    monthCount: ')
        .replace(/dayCount:\s*(\d+)/g, '    dayCount: ')
        .replace(/folderTopN:\s*(\d+)/g, '    folderTopN: ')
        .replace(/maxOpen:\s*(\d+)/g, '    maxOpen: ')
        .replace(/taskTags:\s*\[([^\]]+)\]/g, (_, arr) =>     taskTags: [])
        .replace(/dueEmoji:\s*'([^']+)'/g, (_, e) =>     dueEmoji: '')
        .replace(/estThreshold:\s*(\d+)/g, '    estThreshold: ')
        .replace(/estCoeff:\s*(\d+)/g, '    estCoeff: ')
        .replace(/colorScheme:\s*'([^']+)'/g, "    colorScheme: ''")
        .replace(/sectionOrder:\s*\[([^\]]+)\]/g, (_, arr) =>     sectionOrder: []);
}

function main() {
    try {
        const dvJs = readDataview();

        // Extract COLOR_SCHEMES
        const colorSchemesObj = extractVariable(dvJs, 'COLOR_SCHEMES');
        const colorSchemesTS = generateColorSchemesTS(colorSchemesObj);

        const colorSchemesFile = import { ColorScheme } from './types';\n\nexport const COLOR_SCHEMES: Record<string, ColorScheme> = ;\n;

        // Extract DEFAULT_CONFIG
        const defaultConfigObj = extractVariable(dvJs, 'DEFAULT_CONFIG');
        const settingsObj = defaultConfigObj.replace(/const\s+DEFAULT_CONFIG\s*=/, '').trim().replace(/;$/, '');
        const settingsTS = generateSettingsTS(settingsObj);

        const settingsFile = import { NoteDashboardSettings } from './types';\n\nexport const DEFAULT_SETTINGS: NoteDashboardSettings = {\n};\n;

        // Write files
        writeFileSync(join(ROOT, 'plugin', 'src', 'color-schemes.ts'), colorSchemesFile, 'utf-8');
        writeFileSync(join(ROOT, 'plugin', 'src', 'settings.ts'), settingsFile, 'utf-8');

        console.log('Synced from Dataview to plugin:');
        console.log('  - plugin/src/color-schemes.ts');
        console.log('  - plugin/src/settings.ts');
    } catch (err) {
        console.error('Sync failed:', err.message);
        process.exit(1);
    }
}

main();
