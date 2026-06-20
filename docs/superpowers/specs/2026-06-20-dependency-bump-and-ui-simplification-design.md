# Design Spec: Upgrade UI Kit & Simplify Components

We are upgrading `@kjaniec-dev/design` and `@kjaniec-dev/ui` to version `0.7.2` to leverage recent components, styling tokens, and layout features. We will also simplify custom elements in the VoxPad UI by integrating native library components.

---

## 1. Upgraded Dependencies

We will bump package versions in `package.json` to `^0.7.2`.

- `@kjaniec-dev/design`: `^0.7.2`
- `@kjaniec-dev/ui`: `^0.7.2`

Correspondingly, we will update the E2E version check assertions in `tests/controls.test.mjs`.

---

## 2. Shared Dialog State in Store

To support triggering the `ConfirmDialog` via both the UI button and the global keyboard shortcut (`C`), we will introduce dialog visibility state in the voxel store.

### Changes to `src/store/voxelStore.ts`

- Add `isClearConfirmOpen: boolean` to `VoxelState`.
- Add `setClearConfirmOpen: (open: boolean) => void` to `VoxelState`.
- Implement `setClearConfirmOpen` in `useVoxelStore` to toggle the boolean.

---

## 3. Keyboard Shortcuts Integration

Update `src/components/KeyboardShortcuts.tsx`:
- Instead of using `window.confirm('Clear all voxels?')` and calling `clear()` synchronously, the `c`/`C` keypress will call `setClearConfirmOpen(true)`.

---

## 4. UI Toolbar Buttons Simplification

We will import `Button` and `ConfirmDialog` from `@kjaniec-dev/ui` in `src/components/Toolbar.tsx`.

- **glTF Export Button**: Convert to `<Button variant="secondary" className="w-24 font-bold shadow-kj-sm" ...>`
- **.vox Export Button**: Convert to `<Button variant="outline" className="w-24 bg-surface/70 font-bold shadow-kj-sm" ...>`
- **Clear Button**: Convert to `<Button variant="danger" className="w-24 font-bold shadow-kj-sm" onClick={() => setClearConfirmOpen(true)} ...>`
- **ConfirmDialog Component**: Render `<ConfirmDialog>` in the Toolbar (or main application layout), bound to `isClearConfirmOpen` and `setClearConfirmOpen`.

---

## 5. E2E Tests Compatibility

We will verify that `tests/controls.test.mjs` runs and passes successfully:
- Update version checks to `^0.7.2`.
- Ensure regex assertions for `commandButton` and other specific UI behaviors are preserved.
