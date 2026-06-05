import { useVoxelStore, Tool } from '../store/voxelStore'
import { exportGLTF, exportVox } from '../utils/export'

const TOOLS: { id: Tool; label: string; icon: string; hint: string }[] = [
  { id: 'add',    label: 'Add',    icon: '＋', hint: 'Left-click face to add voxel' },
  { id: 'remove', label: 'Remove', icon: '－', hint: 'Left-click voxel to remove' },
  { id: 'paint',  label: 'Paint',  icon: '◈',  hint: 'Left-click voxel to repaint' },
]

export default function Toolbar() {
  const tool = useVoxelStore((s) => s.tool)
  const setTool = useVoxelStore((s) => s.setTool)
  const voxels = useVoxelStore((s) => s.voxels)
  const clear = useVoxelStore((s) => s.clear)

  return (
    <div style={styles.toolbar}>
      {/* Logo */}
      <span style={styles.logo}>VoxPad</span>

      {/* Tool buttons */}
      <div style={styles.group}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            title={t.hint}
            onClick={() => setTool(t.id)}
            style={{ ...styles.btn, ...(tool === t.id ? styles.btnActive : {}) }}
          >
            <span style={styles.icon}>{t.icon}</span>
            <span style={styles.label}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.sep} />

      {/* Export */}
      <div style={styles.group}>
        <button style={styles.btn} title="Export glTF (.glb)" onClick={() => exportGLTF(voxels)}>
          <span style={styles.icon}>⬇</span>
          <span style={styles.label}>glTF</span>
        </button>
        <button style={styles.btn} title="Export MagicaVoxel (.vox)" onClick={() => exportVox(voxels)}>
          <span style={styles.icon}>⬇</span>
          <span style={styles.label}>.vox</span>
        </button>
      </div>

      <div style={styles.sep} />

      {/* Voxel count + clear */}
      <div style={styles.group}>
        <span style={styles.count}>{voxels.size} voxels</span>
        <button
          style={{ ...styles.btn, ...styles.danger }}
          onClick={() => { if (confirm('Clear all voxels?')) clear() }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(15,15,26,0.88)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '6px 14px',
    zIndex: 100,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  logo: {
    color: '#7c6fe0',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 4,
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  sep: {
    width: 1,
    height: 24,
    background: 'rgba(255,255,255,0.1)',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 7,
    color: '#ccc',
    cursor: 'pointer',
    padding: '4px 10px',
    fontSize: 12,
    fontFamily: 'system-ui, sans-serif',
    transition: 'background 0.15s',
  },
  btnActive: {
    background: 'rgba(124,111,224,0.35)',
    border: '1px solid rgba(124,111,224,0.6)',
    color: '#d0c8ff',
  },
  danger: {
    color: '#ff7070',
    border: '1px solid rgba(255,80,80,0.25)',
  },
  icon: { fontSize: 13 },
  label: { fontSize: 12 },
  count: {
    color: '#556',
    fontSize: 11,
    fontFamily: 'monospace',
    marginRight: 4,
  },
}
