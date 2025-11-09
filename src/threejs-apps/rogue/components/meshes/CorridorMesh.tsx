'use client';

interface CorridorMeshProps {
  corridor: any;
  disableFog?: boolean;
}

export function CorridorMesh({ corridor, disableFog = false }: CorridorMeshProps) {
  if (!corridor.segments) return null;

  const opacity = disableFog ? 1.0 : (corridor.room.isSeen ? 1.0 : 0.3);

  return (
    <group>
      {corridor.segments.map((segment: any, idx: number) => {
        const width = segment.x2 - segment.x1;
        const height = segment.y2 - segment.y1;
        const centerX = segment.x1 + width / 2;
        const centerZ = segment.y1 + height / 2;

        return (
          <mesh key={idx} position={[centerX, 0.01, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[Math.abs(width), Math.abs(height)]} />
            <meshLambertMaterial color="#2a1a0a" opacity={opacity} transparent />
          </mesh>
        );
      })}
    </group>
  );
}
