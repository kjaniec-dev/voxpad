import { Badge, ConfirmDialog, Button } from '@kjaniec-dev/ui'
import { useVoxelStore, Tool } from '../store/voxelStore'
import { exportGLTF, exportVox } from '../utils/export'

const TOOLS: { value: Tool; label: string }[] = [
  { value: 'add', label: 'Add' },
  { value: 'remove', label: 'Remove' },
  { value: 'paint', label: 'Paint' },
]

const commandButton =
  'grid h-10 w-24 place-items-center rounded-kj-sm px-4 text-[0.78rem] font-bold leading-none transition-colors'

export default function Toolbar() {
  const tool = useVoxelStore((s) => s.tool)
  const setTool = useVoxelStore((s) => s.setTool)
  const voxels = useVoxelStore((s) => s.voxels)
  const clear = useVoxelStore((s) => s.clear)
  const isClearConfirmOpen = useVoxelStore((s) => s.isClearConfirmOpen)
  const setClearConfirmOpen = useVoxelStore((s) => s.setClearConfirmOpen)

  return (
    <div className="absolute left-4 right-4 top-4 z-[100] flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-kj-sm border border-border bg-card/95 px-6 py-4 shadow-kj-lg backdrop-blur-xl">
      <div className="flex h-10 items-center gap-3 pr-1">
        <span className="grid h-8 w-8 place-items-center rounded-kj-sm bg-primary text-sm font-black text-primary-foreground shadow-kj-glow">
          V
        </span>
        <span className="text-sm font-black tracking-[0.08em] text-foreground">VoxPad</span>
      </div>

      <div className="grid grid-cols-3 rounded-kj-sm border border-border bg-muted/55 p-1.5" role="group" aria-label="Voxel tool">
        {TOOLS.map((item, index) => {
          const active = item.value === tool

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={active}
              className={`${commandButton} ${
                active
                  ? 'bg-primary text-primary-foreground shadow-kj-glow'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              }`}
              onClick={() => setTool(item.value)}
            >
              <span className="flex items-center gap-2">
                <span className={active ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}>
                  {index + 1}
                </span>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="hidden h-8 w-px bg-border lg:block" />

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
