import { useVoxelStore } from '../store/voxelStore'

const HINTS: Record<string, string> = {
  add:    'Click a voxel face to place • Middle-drag to rotate • Right-drag to pan',
  remove: 'Click a voxel to remove it • Middle-drag to rotate • Right-drag to pan',
  paint:  'Click a voxel to repaint with active colour • Middle-drag to rotate',
}

export default function HelpHint() {
  const tool = useVoxelStore((s) => s.tool)
  return (
    <div style={styles.hint}>
      {HINTS[tool]}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  hint: {
    position: 'absolute',
    bottom: 14,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(15,15,26,0.75)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    color: '#556',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 11,
    padding: '5px 14px',
    pointerEvents: 'none',
    zIndex: 100,
    whiteSpace: 'nowrap',
  },
}
