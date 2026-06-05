import { useRef, useMemo, useCallback } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useVoxelStore, parseKey } from '../store/voxelStore'

const GEO = new THREE.BoxGeometry(1, 1, 1)
const dummy = new THREE.Object3D()

export default function VoxelMesh() {
  const voxels = useVoxelStore((s) => s.voxels)
  const tool = useVoxelStore((s) => s.tool)
  const addVoxel = useVoxelStore((s) => s.addVoxel)
  const removeVoxel = useVoxelStore((s) => s.removeVoxel)
  const paintVoxel = useVoxelStore((s) => s.paintVoxel)

  // Gather entries once per render
  const entries = useMemo(() => [...voxels.entries()], [voxels])

  // Build per-color instanced meshes
  const byColor = useMemo(() => {
    const map = new Map<string, Array<{ x: number; y: number; z: number }>>()
    for (const [k, color] of entries) {
      const pos = parseKey(k)
      if (!map.has(color)) map.set(color, [])
      map.get(color)!.push(pos)
    }
    return map
  }, [entries])

  const handlePointer = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      const face = e.face
      if (!face) return
      const pos = e.object.userData as { x: number; y: number; z: number } | undefined
      if (!pos) return
      const n = face.normal

      if (tool === 'remove') {
        removeVoxel(pos.x, pos.y, pos.z)
      } else if (tool === 'paint') {
        paintVoxel(pos.x, pos.y, pos.z)
      } else {
        // add on adjacent face
        addVoxel(
          pos.x + Math.round(n.x),
          pos.y + Math.round(n.y),
          pos.z + Math.round(n.z),
        )
      }
    },
    [tool, addVoxel, removeVoxel, paintVoxel],
  )

  return (
    <>
      {[...byColor.entries()].map(([color, positions]) => (
        <InstancedColor
          key={color}
          color={color}
          positions={positions}
          onPointerDown={handlePointer}
        />
      ))}
    </>
  )
}

interface InstancedColorProps {
  color: string
  positions: Array<{ x: number; y: number; z: number }>
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void
}

function InstancedColor({ color, positions, onPointerDown }: InstancedColorProps) {
  const ref = useRef<THREE.InstancedMesh>(null)

  const matrixArray = useMemo(() => {
    const arr: THREE.Matrix4[] = []
    for (const p of positions) {
      dummy.position.set(p.x, p.y, p.z)
      dummy.updateMatrix()
      arr.push(dummy.matrix.clone())
    }
    return arr
  }, [positions])

  // Apply matrices imperatively (can't do it declaratively with R3F)
  const meshRef = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      if (!mesh) return
      // store ref value manually
      ;(ref as React.MutableRefObject<THREE.InstancedMesh | null>).current = mesh
      matrixArray.forEach((m, i) => mesh.setMatrixAt(i, m))
      mesh.instanceMatrix.needsUpdate = true
    },
    [matrixArray],
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[GEO, undefined, positions.length]}
      onPointerDown={(e) => {
        // Tag each instance so handlePointer knows which voxel
        const idx = e.instanceId ?? 0
        e.object.userData = positions[idx]
        onPointerDown(e)
      }}
    >
      <meshStandardMaterial color={color} />
    </instancedMesh>
  )
}
