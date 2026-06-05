import { useRef } from 'react'
import { useVoxelStore } from '../store/voxelStore'

export default function Palette() {
  const palette = useVoxelStore((s) => s.palette)
  const color = useVoxelStore((s) => s.color)
  const setColor = useVoxelStore((s) => s.setColor)
  const addToPalette = useVoxelStore((s) => s.addToPalette)
  const pickerRef = useRef<HTMLInputElement>(null)

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Palette</div>

      {/* Current color swatch + native picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{ ...styles.current, background: color }}
          title="Click to open color picker"
          onClick={() => pickerRef.current?.click()}
        />
        <input
          ref={pickerRef}
          type="color"
          value={color}
          style={{ display: 'none' }}
          onChange={(e) => {
            setColor(e.target.value)
            addToPalette(e.target.value)
          }}
        />
        <span style={styles.hex}>{color}</span>
      </div>

      {/* Swatches grid */}
      <div style={styles.grid}>
        {palette.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => setColor(c)}
            style={{
              ...styles.swatch,
              background: c,
              outline: c === color ? '2px solid #fff' : '2px solid transparent',
              outlineOffset: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(15,15,26,0.88)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 10px',
    zIndex: 100,
    minWidth: 108,
    userSelect: 'none',
  },
  title: {
    color: '#666',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'system-ui',
    marginBottom: 10,
  },
  current: {
    width: 28,
    height: 28,
    borderRadius: 6,
    cursor: 'pointer',
    border: '2px solid rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  hex: {
    color: '#aaa',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'transform 0.1s',
  },
}
