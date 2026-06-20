# Upgrade UI Kit & Simplify Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `@kjaniec-dev/*` dependencies to version 0.7.2 and simplify the VoxPad UI by integrating the new `Button` and `ConfirmDialog` components.

**Architecture:** We will manage `ConfirmDialog` visibility in the global Zustand store to support triggering the modal dialog via both the Clear button in the toolbar and the `C` keyboard shortcut. We will replace custom buttons with standard library buttons.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Zustand 5, Tailwind CSS 4, @kjaniec-dev/ui 0.7.2, @kjaniec-dev/design 0.7.2

---

### Task 1: Package Upgrades and Test Assertions

**Files:**
- Modify: `package.json`
- Modify: `tests/controls.test.mjs`

- [ ] **Step 1: Write failing test assertions**
  Edit `tests/controls.test.mjs` to update version expectations to `^0.7.2`.
  Target content:
  ```javascript
    assert.equal(pkg.dependencies['@kjaniec-dev/ui'], '^0.4.0')
    assert.equal(pkg.dependencies['@kjaniec-dev/design'], '^0.3.1')
  ```
  Replacement content:
  ```javascript
    assert.equal(pkg.dependencies['@kjaniec-dev/ui'], '^0.7.2')
    assert.equal(pkg.dependencies['@kjaniec-dev/design'], '^0.7.2')
  ```

- [ ] **Step 2: Run tests to verify they fail**
  Run: `node tests/controls.test.mjs`
  Expected: FAIL (assertion errors on dependency versions)

- [ ] **Step 3: Modify package.json to bump dependency versions**
  Edit `package.json` to upgrade dependency versions to `^0.7.2`.
  Target content:
  ```json
      "@kjaniec-dev/design": "^0.3.1",
      "@kjaniec-dev/ui": "^0.4.0",
  ```
  Replacement content:
  ```json
      "@kjaniec-dev/design": "^0.7.2",
      "@kjaniec-dev/ui": "^0.7.2",
  ```

- [ ] **Step 4: Run npm install**
  Run: `npm install`
  Expected: Install packages successfully

- [ ] **Step 5: Run tests and verify they pass**
  Run: `node tests/controls.test.mjs`
  Expected: PASS

- [ ] **Step 6: Commit**
  Run: `git add package.json package-lock.json tests/controls.test.mjs`
  Run: `git commit -m "chore: bump dependencies to v0.7.2 and update E2E test versions"`

---

### Task 2: Voxel Store Dialog State

**Files:**
- Modify: `src/store/voxelStore.ts`
- Modify: `tests/controls.test.mjs`

- [ ] **Step 1: Add failing test for store dialog state**
  Add a new test inside `tests/controls.test.mjs` to assert that `isClearConfirmOpen` is defined in `voxelStore.ts`.
  Add to the end of the file:
  ```javascript
  test('store manages clear confirmation dialog state', () => {
    const store = read('src/store/voxelStore.ts')
    assert.match(store, /isClearConfirmOpen:\s*boolean/)
    assert.match(store, /setClearConfirmOpen:\s*\(open:\s*boolean\)\s*=>\s*void/)
  })
  ```

- [ ] **Step 2: Run tests to verify the new test fails**
  Run: `node tests/controls.test.mjs`
  Expected: FAIL (cannot find `isClearConfirmOpen: boolean`)

- [ ] **Step 3: Implement dialog state in voxelStore.ts**
  Add `isClearConfirmOpen` and `setClearConfirmOpen` to `VoxelState` and implement them in `useVoxelStore`.
  Target interface content:
  ```typescript
    removeFromPalette: (c: string) => void
    clear: () => void
  }
  ```
  Replacement interface content:
  ```typescript
    removeFromPalette: (c: string) => void
    clear: () => void
    isClearConfirmOpen: boolean
    setClearConfirmOpen: (open: boolean) => void
  }
  ```
  Target store creator content:
  ```typescript
    removeFromPalette: (c) =>
      set((s) => {
        if (DEFAULT_PALETTE.includes(c)) return s
        const palette = s.palette.filter((savedColor) => savedColor !== c)
        return {
          palette,
          color: s.color === c ? DEFAULT_PALETTE[0] : s.color,
        }
      }),

    clear: () => set({ voxels: new Map() }),
  }))
  ```
  Replacement store creator content:
  ```typescript
    removeFromPalette: (c) =>
      set((s) => {
        if (DEFAULT_PALETTE.includes(c)) return s
        const palette = s.palette.filter((savedColor) => savedColor !== c)
        return {
          palette,
          color: s.color === c ? DEFAULT_PALETTE[0] : s.color,
        }
      }),

    clear: () => set({ voxels: new Map() }),
    isClearConfirmOpen: false,
    setClearConfirmOpen: (open) => set({ isClearConfirmOpen: open }),
  }))
  ```

- [ ] **Step 4: Run tests to verify they pass**
  Run: `node tests/controls.test.mjs`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/store/voxelStore.ts tests/controls.test.mjs`
  Run: `git commit -m "feat: add isClearConfirmOpen state to voxelStore"`

---

### Task 3: Keyboard Shortcuts Confirmation Integration

**Files:**
- Modify: `src/components/KeyboardShortcuts.tsx`
- Modify: `tests/controls.test.mjs`

- [ ] **Step 1: Write a failing test for KeyboardShortcuts integration**
  Add a test in `tests/controls.test.mjs` checking that `KeyboardShortcuts.tsx` calls `setClearConfirmOpen` instead of `window.confirm`.
  Add to the end of the file:
  ```javascript
  test('keyboard shortcuts triggers store confirmation instead of window.confirm', () => {
    const shortcuts = read('src/components/KeyboardShortcuts.tsx')
    assert.doesNotMatch(shortcuts, /window\.confirm/)
    assert.match(shortcuts, /setClearConfirmOpen/)
  })
  ```

- [ ] **Step 2: Run tests to verify it fails**
  Run: `node tests/controls.test.mjs`
  Expected: FAIL (contains `window.confirm` and does not contain `setClearConfirmOpen`)

- [ ] **Step 3: Modify KeyboardShortcuts.tsx to use voxelStore confirmation**
  Update the component to retrieve `setClearConfirmOpen` and call it when `c`/`C` is pressed.
  Target content:
  ```typescript
  export default function KeyboardShortcuts() {
    const setTool = useVoxelStore((s) => s.setTool)
    const clear = useVoxelStore((s) => s.clear)

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.metaKey || event.ctrlKey || event.altKey || shouldIgnoreShortcut(event.target)) return

        const tool = TOOL_SHORTCUTS[event.key]
        if (tool) {
          event.preventDefault()
          setTool(tool)
          return
        }

        if (event.key.toLowerCase() === 'c' && window.confirm('Clear all voxels?')) {
          event.preventDefault()
          clear()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [clear, setTool])

    return null
  }
  ```
  Replacement content:
  ```typescript
  export default function KeyboardShortcuts() {
    const setTool = useVoxelStore((s) => s.setTool)
    const setClearConfirmOpen = useVoxelStore((s) => s.setClearConfirmOpen)

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.metaKey || event.ctrlKey || event.altKey || shouldIgnoreShortcut(event.target)) return

        const tool = TOOL_SHORTCUTS[event.key]
        if (tool) {
          event.preventDefault()
          setTool(tool)
          return
        }

        if (event.key.toLowerCase() === 'c') {
          event.preventDefault()
          setClearConfirmOpen(true)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setTool, setClearConfirmOpen])

    return null
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**
  Run: `node tests/controls.test.mjs`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/components/KeyboardShortcuts.tsx tests/controls.test.mjs`
  Run: `git commit -m "refactor: trigger custom confirm dialog from C shortcut"`

---

### Task 4: UI Toolbar Buttons Simplification and ConfirmDialog Integration

**Files:**
- Modify: `src/components/Toolbar.tsx`
- Modify: `tests/controls.test.mjs`

- [ ] **Step 1: Write a failing test for Toolbar integration**
  Add a test inside `tests/controls.test.mjs` checking that `ConfirmDialog` and `Button` are imported and used in `Toolbar.tsx`.
  Add to the end of the file:
  ```javascript
  test('toolbar integrates ConfirmDialog and Button from UI library', () => {
    const toolbar = read('src/components/Toolbar.tsx')
    assert.match(toolbar, /import.*ConfirmDialog.*Button.*from '@kjaniec-dev\/ui'/)
    assert.match(toolbar, /<ConfirmDialog/)
    assert.match(toolbar, /<Button/)
  })
  ```

- [ ] **Step 2: Run tests to verify the test fails**
  Run: `node tests/controls.test.mjs`
  Expected: FAIL

- [ ] **Step 3: Modify Toolbar.tsx to use Button and ConfirmDialog**
  Update the imports, fetch the state and actions from `useVoxelStore`, use `<Button>` for the action items, and render `<ConfirmDialog>` at the bottom of the toolbar component.
  Target content:
  ```typescript
  import { Badge } from '@kjaniec-dev/ui'
  import { useVoxelStore, Tool } from '../store/voxelStore'
  import { exportGLTF, exportVox } from '../utils/export'
  ```
  Replacement content:
  ```typescript
  import { Badge, Button, ConfirmDialog } from '@kjaniec-dev/ui'
  import { useVoxelStore, Tool } from '../store/voxelStore'
  import { exportGLTF, exportVox } from '../utils/export'
  ```
  Target buttons content:
  ```typescript
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`${commandButton} bg-secondary text-secondary-foreground shadow-kj-sm hover:bg-secondary-hover`}
            title="Export glTF (.glb)"
            onClick={() => exportGLTF(voxels)}
          >
            glTF
          </button>
          <button
            type="button"
            className={`${commandButton} border border-border bg-surface/70 text-foreground shadow-kj-sm hover:bg-muted`}
            title="Export MagicaVoxel (.vox)"
            onClick={() => exportVox(voxels)}
          >
            .vox
          </button>
        </div>

        <div className="hidden h-8 w-px bg-border lg:block" />

        <div className="flex h-10 items-center gap-3">
          <Badge variant="neutral">{voxels.size} voxels</Badge>
          <button
            type="button"
            className={`${commandButton} bg-danger text-white shadow-kj-sm hover:bg-danger/90`}
            onClick={() => { if (confirm('Clear all voxels?')) clear() }}
          >
            Clear
          </button>
        </div>
      </div>
    )
  }
  ```
  Replacement content:
  ```typescript
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="w-24 font-bold shadow-kj-sm"
            title="Export glTF (.glb)"
            onClick={() => exportGLTF(voxels)}
          >
            glTF
          </Button>
          <Button
            variant="outline"
            className="w-24 bg-surface/70 font-bold shadow-kj-sm"
            title="Export MagicaVoxel (.vox)"
            onClick={() => exportVox(voxels)}
          >
            .vox
          </Button>
        </div>

        <div className="hidden h-8 w-px bg-border lg:block" />

        <div className="flex h-10 items-center gap-3">
          <Badge variant="neutral">{voxels.size} voxels</Badge>
          <Button
            variant="danger"
            className="w-24 font-bold shadow-kj-sm"
            onClick={() => setClearConfirmOpen(true)}
          >
            Clear
          </Button>
        </div>

        <ConfirmDialog
          open={isClearConfirmOpen}
          onClose={() => setClearConfirmOpen(false)}
          onConfirm={() => {
            clear()
            setClearConfirmOpen(false)
          }}
          title="Clear all voxels?"
          description="This action cannot be undone. You will lose all current voxel structures."
          confirmLabel="Clear"
          tone="danger"
        />
      </div>
    )
  }
  ```
  Wait! Let's check how `useVoxelStore` state is fetched in `Toolbar.tsx`.
  Target store imports/declarations:
  ```typescript
  export default function Toolbar() {
    const tool = useVoxelStore((s) => s.tool)
    const setTool = useVoxelStore((s) => s.setTool)
    const voxels = useVoxelStore((s) => s.voxels)
    const clear = useVoxelStore((s) => s.clear)
  ```
  Replacement store declarations:
  ```typescript
  export default function Toolbar() {
    const tool = useVoxelStore((s) => s.tool)
    const setTool = useVoxelStore((s) => s.setTool)
    const voxels = useVoxelStore((s) => s.voxels)
    const clear = useVoxelStore((s) => s.clear)
    const isClearConfirmOpen = useVoxelStore((s) => s.isClearConfirmOpen)
    const setClearConfirmOpen = useVoxelStore((s) => s.setClearConfirmOpen)
  ```

- [ ] **Step 4: Run tests to verify they pass**
  Run: `node tests/controls.test.mjs`
  Expected: PASS

- [ ] **Step 5: Run final build verification**
  Run: `npm run build`
  Expected: Build succeeds

- [ ] **Step 6: Commit**
  Run: `git add src/components/Toolbar.tsx tests/controls.test.mjs`
  Run: `git commit -m "feat: simplify toolbar buttons using Button and ConfirmDialog from UI library"`
