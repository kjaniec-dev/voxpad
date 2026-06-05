import { Badge } from '@kjaniec-dev/ui'
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
