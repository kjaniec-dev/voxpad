import { ThreeEvent } from '@react-three/fiber'
import { useVoxelStore } from '../store/voxelStore'

export default function Ground() {
  const tool = useVoxelStore((s) => s.tool)
  const addVoxel = useVoxelStore((s) => s.addVoxel)

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (tool !== 'add') return
    e.stopPropagation()
    const x = Math.floor(e.point.x + 0.5)
    const z = Math.floor(e.point.z + 0.5)
    addVoxel(x, 0, z)
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[3.5, -0.51, 3.5]}
      onPointerDown={handleClick}
      receiveShadow
    >
      <planeGeometry args={[64, 64]} />
      <meshStandardMaterial color="#1a1a2e" transparent opacity={0.6} />
    </mesh>
  )
}
