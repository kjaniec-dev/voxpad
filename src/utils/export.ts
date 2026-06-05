import * as THREE from 'three'
import { VoxelMap, parseKey } from '../store/voxelStore'

// ── glTF export ──────────────────────────────────────────────────────────────
export async function exportGLTF(voxels: VoxelMap): Promise<void> {
  const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js')

  const scene = new THREE.Scene()
  const geo = new THREE.BoxGeometry(1, 1, 1)

  // Group voxels by color to minimise draw calls in exported file
  const byColor = new Map<string, THREE.Vector3[]>()
  for (const [k, color] of voxels) {
    const { x, y, z } = parseKey(k)
    if (!byColor.has(color)) byColor.set(color, [])
    byColor.get(color)!.push(new THREE.Vector3(x, y, z))
  }

  for (const [color, positions] of byColor) {
    const mat = new THREE.MeshStandardMaterial({ color })
    const mesh = new THREE.InstancedMesh(geo, mat, positions.length)
    const dummy = new THREE.Object3D()
    positions.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    scene.add(mesh)
  }

  const exporter = new GLTFExporter()
  exporter.parse(
    scene,
    (result) => {
      const blob = new Blob(
        [result instanceof ArrayBuffer ? result : JSON.stringify(result)],
        { type: result instanceof ArrayBuffer ? 'model/gltf-binary' : 'model/gltf+json' },
      )
      downloadBlob(blob, result instanceof ArrayBuffer ? 'voxpad.glb' : 'voxpad.gltf')
    },
    (err) => console.error('GLTF export error', err),
    { binary: true },
  )
}

// ── MagicaVoxel .vox export ───────────────────────────────────────────────────
// Minimal writer — supports single chunk palette + XYZI
export function exportVox(voxels: VoxelMap): void {
  if (voxels.size === 0) return

  // Build palette (max 255 colours; index 0 reserved by spec)
  const colorSet = new Set<string>()
  for (const color of voxels.values()) colorSet.add(color)
  const palette = [...colorSet].slice(0, 255)
  const colorIndex = new Map(palette.map((c, i) => [c, i + 1]))

  // Determine bounds
  let maxX = 0, maxY = 0, maxZ = 0
  for (const k of voxels.keys()) {
    const { x, y, z } = parseKey(k)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
    maxZ = Math.max(maxZ, z)
  }
  const sX = maxX + 1, sY = maxY + 1, sZ = maxZ + 1

  const voxelCount = voxels.size
  // SIZE chunk: 12 bytes content
  // XYZI chunk: 4 + 4*n bytes content
  // RGBA chunk: 256*4 bytes content
  const sizeChunkSize = 12
  const xyziChunkSize = 4 + 4 * voxelCount
  const rgbaChunkSize = 256 * 4

  // Total: file header(8) + MAIN header(12) + SIZE(12+sizeChunkSize) + XYZI(12+xyziChunkSize) + RGBA(12+rgbaChunkSize)
  const mainChildrenSize =
    (12 + sizeChunkSize) + (12 + xyziChunkSize) + (12 + rgbaChunkSize)
  const totalSize = 8 + 12 + mainChildrenSize

  const buf = new ArrayBuffer(totalSize)
  const dv = new DataView(buf)
  let offset = 0

  function writeId(id: string) {
    for (let i = 0; i < 4; i++) dv.setUint8(offset++, id.charCodeAt(i))
  }
  function writeI32(n: number) { dv.setInt32(offset, n, true); offset += 4 }

  // File header
  writeId('VOX ')
  writeI32(150) // version

  // MAIN chunk
  writeId('MAIN')
  writeI32(0)
  writeI32(mainChildrenSize)

  // SIZE chunk
  writeId('SIZE')
  writeI32(sizeChunkSize)
  writeI32(0)
  writeI32(sX); writeI32(sZ); writeI32(sY) // MagicaVoxel: x,z,y

  // XYZI chunk
  writeId('XYZI')
  writeI32(xyziChunkSize)
  writeI32(0)
  writeI32(voxelCount)
  for (const [k, color] of voxels) {
    const { x, y, z } = parseKey(k)
    dv.setUint8(offset++, x)
    dv.setUint8(offset++, z) // MagicaVoxel z = our y
    dv.setUint8(offset++, y)
    dv.setUint8(offset++, colorIndex.get(color) ?? 1)
  }

  // RGBA chunk
  writeId('RGBA')
  writeI32(rgbaChunkSize)
  writeI32(0)
  for (let i = 0; i < 256; i++) {
    const hex = palette[i - 1] // index 0 is unused
    if (hex) {
      const n = parseInt(hex.replace('#', ''), 16)
      dv.setUint8(offset++, (n >> 16) & 0xff)
      dv.setUint8(offset++, (n >> 8) & 0xff)
      dv.setUint8(offset++, n & 0xff)
      dv.setUint8(offset++, 255)
    } else {
      offset += 4
    }
  }

  downloadBlob(new Blob([buf], { type: 'application/octet-stream' }), 'voxpad.vox')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
