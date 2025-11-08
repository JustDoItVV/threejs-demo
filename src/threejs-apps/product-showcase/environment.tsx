import { Environment as DreiEnvironment } from '@react-three/drei';

export function Environment() {
  return (
    <>
      {/* HDR environment map for realistic reflections */}
      <DreiEnvironment preset="studio" background={false} />

      {/* Ambient light for overall visibility */}
      <ambientLight intensity={0.8} />

      {/* Hemisphere light for soft fill */}
      <hemisphereLight args={['#ffffff', '#666666', 0.6]} />

      {/* Key light (front) - stronger */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

      {/* Fill light - stronger */}
      <directionalLight position={[-3, 3, -3]} intensity={0.6} />

      {/* Back key light - much stronger to show Apple logo */}
      <directionalLight position={[0, 3, -8]} intensity={1.2} color="#ffffff" />

      {/* Top light for logo visibility */}
      <directionalLight position={[0, 8, -2]} intensity={0.8} color="#ffffff" />

      {/* Rim lights for edge highlighting - stronger */}
      <directionalLight position={[-8, 3, 0]} intensity={0.8} color="#6eb5ff" />
      <directionalLight position={[8, 3, 0]} intensity={0.8} color="#ff6eb5" />

      {/* Additional rim from bottom for depth */}
      <directionalLight position={[0, -3, 5]} intensity={0.4} color="#a0d8ff" />

      {/* Background gradient plane - slightly lighter */}
      <mesh position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  );
}
