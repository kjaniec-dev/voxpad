import { Badge } from '@kjaniec-dev/ui'
import { useVoxelStore } from '../store/voxelStore'

const HINTS: Record<string, string> = {
  add:    'Click a voxel face to place • 1 Add • 2 Remove • 3 Paint • Right-drag to rotate • Middle-drag to pan',
  remove: 'Click a voxel to remove it • 1 Add • 2 Remove • 3 Paint • Right-drag to rotate • Middle-drag to pan',
  paint:  'Click a voxel to repaint with active color • 1 Add • 2 Remove • 3 Paint • Right-drag to rotate • Middle-drag to pan',
}

export default function HelpHint() {
  const tool = useVoxelStore((s) => s.tool)
  return (
    <Badge
      variant="neutral"
      className="pointer-events-none absolute bottom-3 left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap border border-border bg-card/85 px-4 py-1.5 text-[0.7rem] font-semibold text-muted-foreground shadow-kj-md backdrop-blur-xl"
    >
      {HINTS[tool]}
    </Badge>
  )
}
