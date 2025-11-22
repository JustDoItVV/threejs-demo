import { useRef, useState } from 'react';
import * as THREE from 'three';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { adjustColorByActivity, getBlockColor } from '../core/color-gradient';
import { useBlockchainStore } from '../store';
import { BlockData, BlockPosition } from '../types';

interface BlockBuildingProps {
  block: BlockData;
  position: BlockPosition;
  isNew?: boolean;
}

export function BlockBuilding({ block, position, isNew = false }: BlockBuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectedBlock = useBlockchainStore((state) => state.selectedBlock);
  const selectBlock = useBlockchainStore((state) => state.selectBlock);
  const totalBlocks = useBlockchainStore((state) => state.blocks.length);

  const isSelected = selectedBlock?.hash === block.hash;

  const baseSize = 1;
  const height = Math.max(0.5, block.transactions.length * 0.3);
  const width = baseSize + (block.transactions.length / 20) * 0.5;
  const depth = baseSize + (block.transactions.length / 20) * 0.5;

  const getColor = () => {
    if (isSelected) return 'white'; // amber for selected
    if (hovered) return '#60a5fa'; // light blue for hover

    const baseColor = getBlockColor(block.index, totalBlocks);

    const txCount = block.transactions.length;
    const activityLevel = Math.min(txCount / 15, 1);

    return adjustColorByActivity(baseColor, activityLevel * 0.3);
  };

  const targetScale = useRef(1);
  const currentScale = useRef(isNew ? 0 : 1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (currentScale.current < targetScale.current) {
      currentScale.current = Math.min(currentScale.current + delta * 2, targetScale.current);
      meshRef.current.scale.setScalar(currentScale.current);
    }

    if (hovered || isSelected) {
      meshRef.current.position.y =
        position.y + height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position.y + height / 2,
        delta * 5
      );
    }
  });

  const handleClick = () => {
    selectBlock(isSelected ? null : block);
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={currentScale.current}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0.1}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Block number label */}
      <Text
        position={[0, height + 0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        #{block.index}
      </Text>

      {/* Base platform */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[width * 0.6, width * 0.7, 0.1, 8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Transaction indicators (small cubes) */}
      {block.transactions.slice(0, 10).map((tx, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = width * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = height * 0.2 + (i % 3) * 0.2;

        return (
          <mesh key={tx.id} position={[x, y, z]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
