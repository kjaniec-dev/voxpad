import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import VoxelMesh from './VoxelMesh'
import Ground from './Ground'

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [12, 10, 16], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0f0f1a']} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.3} color="#aaccff" />

      <Environment preset="city" />

      <VoxelMesh />
      <Ground />

      <Grid
        position={[3.5, -0.505, 3.5]}
        args={[64, 64]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334"
        sectionSize={8}
        sectionThickness={1}
        sectionColor="#446"
        fadeDistance={60}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        target={[3.5, 1, 3.5]}
        minDistance={2}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2 - 0.05}
        mouseButtons={{
          LEFT: undefined as unknown as import('three').MOUSE,
          MIDDLE: 0 as import('three').MOUSE,
          RIGHT: 2 as import('three').MOUSE,
        }}
      />
    </Canvas>
  )
}
