# Development

## Prerequisites

- Node.js 18+
- Obsidian (for testing the plugin)
- Dataview plugin (for the Dataview version)

## Quick Start

`ash
cd plugin
npm install
npm run dev     # Watch mode for plugin version
npm run build   # Production build
npm run test    # Run Jest tests
`

## Development Workflow

1. Edit the **Dataview version** (dataview/我的笔记看板.md) as the primary source
2. Run the sync script to update plugin TypeScript sources:
   `ash
   node scripts/sync-from-dataview.mjs
   `
3. Build and verify the plugin version:
   `ash
   cd plugin && npm run build
   `
4. Copy plugin/main.js, plugin/manifest.json, plugin/styles.css to your vault's .obsidian/plugins/note-dashboard/
5. Reload or restart Obsidian to test

## Adding a New Component

1. Create a render function in plugin/src/components/:
   - Pure function: (data, config) => string
   - Return HTML string using the html tagged template from src/lib/html.ts
2. Add the section key to sectionOrder in settings
3. Add rendering logic in main.ts switch statement
4. Add event handler (if interactive) in a *-handler.ts file
5. Add styles to styles.css
6. Add corresponding logic to the Dataview version

## Testing

Run cd plugin && npm run test to execute Jest tests.

Tests are located in plugin/src/__tests__/. Component tests mock DashboardData and check the returned HTML string for expected class names and values.

## Release

Push a * tag to trigger GitHub Actions:

`ash
git commit -m "描述性提交信息"
git tag v2.5.0
git push && git push --tags
`

The workflow builds the plugin and uploads both versions to a GitHub Release.
