import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('camera uses right-drag for rotation and middle-drag for panning', () => {
  const scene = read('src/components/Scene.tsx')

  assert.match(scene, /MIDDLE:\s*2\s+as import\('three'\)\.MOUSE/)
  assert.match(scene, /RIGHT:\s*0\s+as import\('three'\)\.MOUSE/)
})

test('app wires keyboard shortcuts for tool selection', () => {
  const app = read('src/App.tsx')

  assert.match(app, /KeyboardShortcuts/)
})

test('document root activates the KJ design dark theme by default', () => {
  const app = read('src/App.tsx')
  const html = read('index.html')
  const styles = read('src/styles.css')

  assert.match(html, /<html lang="en" class="dark">/)
  assert.doesNotMatch(app, /className="dark /)
  assert.match(styles, /@import "@kjaniec-dev\/design\/tailwind\.css";/)
  assert.doesNotMatch(styles, /^@theme\s*\{/m)
  assert.doesNotMatch(styles, /^:root\s*\{/m)
  assert.doesNotMatch(styles, /--kj-primary:/)
})

test('index does not hardcode app colors outside Tailwind', () => {
  const html = read('index.html')

  assert.doesNotMatch(html, /<style>/)
  assert.doesNotMatch(html, /background:\s*#[0-9a-fA-F]{3,6}/)
})

test('help hint documents keyboard shortcuts and camera controls', () => {
  const hints = read('src/components/HelpHint.tsx')

  assert.match(hints, /1 Add/)
  assert.match(hints, /2 Remove/)
  assert.match(hints, /3 Paint/)
  assert.match(hints, /Right-drag to rotate/)
  assert.match(hints, /Middle-drag to pan/)
})

test('palette presents active color and custom picker affordances', () => {
  const palette = read('src/components/Palette.tsx')

  assert.match(palette, /Active color/)
  assert.match(palette, /title="Choose custom color"/)
  assert.match(palette, /h-11 w-11/)
  assert.match(palette, /aria-label=\{`Select color/)
})

test('custom color input remains interactable for native picker activation', () => {
  const palette = read('src/components/Palette.tsx')

  assert.doesNotMatch(palette, /display:\s*'none'/)
  assert.match(palette, /opacity-0/)
  assert.match(palette, /absolute inset-0/)
})

test('custom color changes active color without automatically saving swatches', () => {
  const palette = read('src/components/Palette.tsx')

  assert.match(palette, /const isSavedColor = palette\.includes\(color\)/)
  assert.match(palette, /Save/)
  assert.match(palette, /onClick=\{\(\) => addToPalette\(color\)\}/)
  assert.doesNotMatch(palette, /const handleColorChange =[\s\S]*?addToPalette\(nextColor\)[\s\S]*?}/)
})

test('palette allows removing saved custom colors without removing base colors', () => {
  const store = read('src/store/voxelStore.ts')
  const palette = read('src/components/Palette.tsx')

  assert.match(store, /DEFAULT_PALETTE/)
  assert.match(store, /removeFromPalette: \(c: string\) => void/)
  assert.match(store, /DEFAULT_PALETTE\.includes\(c\)/)
  assert.match(palette, /removeFromPalette/)
  assert.match(palette, /canRemove/)
  assert.match(palette, /aria-label=\{`Remove color/)
})

test('project registers the local KJ UI MCP server', () => {
  const mcp = JSON.parse(read('.mcp.json'))

  assert.deepEqual(mcp.mcpServers['kj-ui-local'], {
    type: 'stdio',
    command: 'node',
    args: ['/Users/kjaniec-dev/dev/projects/kj-product-kit-starter/packages/mcp/dist/index.js'],
  })
})

test('app chrome uses KJ UI kit components and styles', () => {
  const toolbar = read('src/components/Toolbar.tsx')
  const palette = read('src/components/Palette.tsx')
  const main = read('src/main.tsx')
  const vite = read('vite.config.ts')
  const pkg = JSON.parse(read('package.json'))

  assert.match(toolbar, /@kjaniec-dev\/ui/)
  assert.match(toolbar, /Badge/)
  assert.match(toolbar, /commandButton/)
  assert.match(palette, /@kjaniec-dev\/ui/)
  assert.match(palette, /Card/)
  assert.match(main, /\.\/styles\.css/)
  assert.match(vite, /@tailwindcss\/vite/)
  assert.match(vite, /packages\/ui\/dist\/index\.js/)
  assert.match(vite, /useLocalUiDist/)
  assert.equal(pkg.dependencies['@kjaniec-dev/ui'], '^0.4.0')
  assert.equal(pkg.dependencies['@kjaniec-dev/design'], '^0.3.1')
})

test('toolbar uses a rectangular command bar with primary active tools and even button sizing', () => {
  const toolbar = read('src/components/Toolbar.tsx')

  assert.match(toolbar, /rounded-kj-sm border border-border bg-card\/95/)
  assert.match(toolbar, /const commandButton =/)
  assert.match(toolbar, /h-10 w-24/)
  assert.match(toolbar, /active\s+\?\s+'bg-primary text-primary-foreground shadow-kj-glow'/)
  assert.doesNotMatch(toolbar, /rounded-kj-2xl/)
})

test('toolbar uses wider gaps and wraps instead of colliding with side panels', () => {
  const toolbar = read('src/components/Toolbar.tsx')

  assert.match(toolbar, /left-4 right-4/)
  assert.match(toolbar, /flex-wrap/)
  assert.match(toolbar, /justify-between/)
  assert.match(toolbar, /gap-x-5 gap-y-3/)
  assert.match(toolbar, /px-6 py-4/)
  assert.doesNotMatch(toolbar, /left-1\/2/)
  assert.doesNotMatch(toolbar, /-translate-x-1\/2/)
})

test('palette card owns the padding so controls are inset from the border', () => {
  const palette = read('src/components/Palette.tsx')

  assert.match(palette, /right-6/)
  assert.match(palette, /m-6/)
  assert.match(palette, /w-80/)
  assert.match(palette, /backdrop-blur-xl p-6/)
  assert.match(palette, /CardHeader className="flex-row items-center justify-between gap-6 p-0"/)
  assert.match(palette, /CardContent className="px-0 pb-0 pt-5"/)
  assert.match(palette, /grid grid-cols-5 gap-4/)
  assert.match(palette, /h-9 w-9/)
})

test('selected palette swatch uses inset styling so it cannot overlap neighbors', () => {
  const palette = read('src/components/Palette.tsx')

  assert.match(palette, /inset 0 0 0 3px #f8fafc/)
  assert.doesNotMatch(palette, /scale\(1\.08\)/)
  assert.doesNotMatch(palette, /0 0 0 5px \$\{c\}66/)
})

test('styles delegate color tokens to KJ design Tailwind package', () => {
  const styles = read('src/styles.css')

  assert.match(styles, /@import "@kjaniec-dev\/design\/tailwind\.css";/)
  assert.doesNotMatch(styles, /--kj-background:/)
  assert.doesNotMatch(styles, /--kj-foreground:/)
  assert.doesNotMatch(styles, /--kj-primary:/)
  assert.doesNotMatch(styles, /--kj-secondary:/)
  assert.doesNotMatch(styles, /--kj-card:/)
  assert.doesNotMatch(styles, /--kj-ring:/)
})
