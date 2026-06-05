import { create } from 'zustand'

export type Tool = 'add' | 'remove' | 'paint'

export interface VoxelKey {
  x: number
  y: number
  z: number
}

export type VoxelMap = Map<string, string> // key -> hex color

function key(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}

function parseKey(k: string): VoxelKey {
  const [x, y, z] = k.split(',').map(Number)
  return { x, y, z }
}

const DEFAULT_PALETTE = [
  '#e63946', '#f4a261', '#e9c46a', '#2a9d8f',
  '#457b9d', '#a8dadc', '#f1faee', '#264653',
  '#8338ec', '#fb5607', '#ffbe0b', '#3a86ff',
  '#06d6a0', '#ef476f', '#ffd166', '#118ab2',
]

function buildInitialVoxels(): VoxelMap {
  const m: VoxelMap = new Map()
  // 8×1×8 ground plane
  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      m.set(key(x, 0, z), '#457b9d')
    }
  }
  // small structure
  const accent = '#e63946'
  m.set(key(3, 1, 3), accent)
  m.set(key(4, 1, 3), accent)
  m.set(key(3, 1, 4), accent)
  m.set(key(4, 1, 4), accent)
  m.set(key(3, 2, 3), '#f4a261')
  m.set(key(4, 2, 4), '#f4a261')
  return m
}

interface VoxelState {
  voxels: VoxelMap
  tool: Tool
  color: string
  palette: string[]
  addVoxel: (x: number, y: number, z: number) => void
  removeVoxel: (x: number, y: number, z: number) => void
  paintVoxel: (x: number, y: number, z: number) => void
  setTool: (t: Tool) => void
  setColor: (c: string) => void
  addToPalette: (c: string) => void
  removeFromPalette: (c: string) => void
  clear: () => void
}

export const useVoxelStore = create<VoxelState>((set, get) => ({
  voxels: buildInitialVoxels(),
  tool: 'add',
  color: DEFAULT_PALETTE[0],
  palette: DEFAULT_PALETTE,

  addVoxel: (x, y, z) =>
    set((s) => {
      const m = new Map(s.voxels)
      m.set(key(x, y, z), s.color)
      return { voxels: m }
    }),

  removeVoxel: (x, y, z) =>
    set((s) => {
      const m = new Map(s.voxels)
      m.delete(key(x, y, z))
      return { voxels: m }
    }),

  paintVoxel: (x, y, z) =>
    set((s) => {
      if (!s.voxels.has(key(x, y, z))) return s
      const m = new Map(s.voxels)
      m.set(key(x, y, z), s.color)
      return { voxels: m }
    }),

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),

  addToPalette: (c) =>
    set((s) => ({
      palette: s.palette.includes(c) ? s.palette : [...s.palette, c],
    })),

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

export { key, parseKey, DEFAULT_PALETTE }
