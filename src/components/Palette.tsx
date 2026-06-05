import { Button, Card, CardContent, CardHeader, CardTitle } from '@kjaniec-dev/ui'
import { DEFAULT_PALETTE, useVoxelStore } from '../store/voxelStore'

export default function Palette() {
  const palette = useVoxelStore((s) => s.palette)
  const color = useVoxelStore((s) => s.color)
  const setColor = useVoxelStore((s) => s.setColor)
  const addToPalette = useVoxelStore((s) => s.addToPalette)
  const removeFromPalette = useVoxelStore((s) => s.removeFromPalette)
  const isSavedColor = palette.includes(color)

  const handleColorChange = (nextColor: string) => {
    setColor(nextColor)
  }

  return (
    <Card elevated className="absolute right-6 top-1/2 z-[100] m-6 w-80 -translate-y-1/2 select-none rounded-kj-sm border-border bg-card/95 shadow-kj-lg backdrop-blur-xl p-6">
      <CardHeader className="flex-row items-center justify-between gap-6 p-0">
        <div>
          <div className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Palette
          </div>
          <CardTitle className="text-sm">Active color</CardTitle>
        </div>
        <label
          className="relative grid h-11 w-11 cursor-pointer place-items-center overflow-hidden rounded-kj-sm border border-border bg-muted shadow-kj-sm transition-colors hover:bg-surface"
          title="Choose custom color"
        >
          <span className="h-6 w-6 rounded-kj-sm border border-white/30" style={{ background: color }} />
          <input
            type="color"
            value={color}
            aria-label="Choose custom color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </label>
      </CardHeader>

      <CardContent className="px-0 pb-0 pt-5">
        <div className="mb-5 flex items-center gap-4 rounded-kj-sm border border-border bg-muted/50 p-4">
          <label
            className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-kj-sm border-2 border-white/35 shadow-kj-sm"
            style={{ background: color }}
            title="Click to open color picker"
          >
            <input
              type="color"
              value={color}
              aria-label="Choose active color"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </label>
          <div>
            <div className="font-mono text-xs font-bold uppercase text-foreground">{color}</div>
            <div className="text-[0.65rem] text-muted-foreground">
              {isSavedColor ? 'Saved in palette' : 'Active only'}
            </div>
          </div>
        </div>

        {!isSavedColor && (
          <Button
            variant="secondary"
            size="sm"
            className="mb-5 !h-10 w-full !rounded-kj-sm !py-0 text-xs font-bold"
            onClick={() => addToPalette(color)}
          >
            + Save color
          </Button>
        )}

        <div className="grid grid-cols-5 gap-4">
          {palette.map((c) => {
            const canRemove = !DEFAULT_PALETTE.includes(c)
            return (
              <div key={c} className="relative h-9 w-9">
                <button
                  title={c}
                  aria-label={`Select color ${c}`}
                  onClick={() => setColor(c)}
                  className="h-9 w-9 cursor-pointer rounded-kj-sm border-0 p-0 transition-[box-shadow,transform] duration-150"
                  style={{
                    background: c,
                    boxShadow: c === color
                      ? `inset 0 0 0 3px #f8fafc, inset 0 0 0 6px ${c}66`
                      : 'inset 0 0 0 1px rgba(255,255,255,0.16)',
                  }}
                />
                {canRemove && (
                  <button
                    type="button"
                    aria-label={`Remove color ${c}`}
                    className="absolute -right-1.5 -top-1.5 h-4 w-4 cursor-pointer rounded-full border border-border bg-background p-0 text-[0.65rem] leading-[0.8rem] text-foreground shadow-kj-sm"
                    onClick={() => removeFromPalette(c)}
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
