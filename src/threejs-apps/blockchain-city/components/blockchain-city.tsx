import { useEffect, useRef, useState } from 'react';

import { useBlockchainStore } from '../store';
import { BlockBuilding } from './block-building';
import { TransactionParticles } from './transaction-particles';

export function BlockchainCity() {
  const blocks = useBlockchainStore((state) => state.blocks);
  const getBlockPosition = useBlockchainStore((state) => state.getBlockPosition);
  const initializeWithBlocks = useBlockchainStore((state) => state.initializeWithBlocks);
  const [newBlockHashes, setNewBlockHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (blocks.length === 0) {
      initializeWithBlocks(5);
    }
  }, [blocks.length, initializeWithBlocks]);

  const prevBlocksCountRef = useRef(blocks.length);

  useEffect(() => {
    if (blocks.length > prevBlocksCountRef.current) {
      const newHashes = new Set(newBlockHashes);
      for (let i = prevBlocksCountRef.current; i < blocks.length; i++) {
        newHashes.add(blocks[i].hash);
      }
      setNewBlockHashes(newHashes);

      setTimeout(() => {
        setNewBlockHashes(new Set());
      }, 1000);
    }
    prevBlocksCountRef.current = blocks.length;
  }, [blocks, blocks.length, newBlockHashes]);

  return (
    <group>
      {/* Ground plane - centered at origin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Grid helper - centered at origin */}
      <gridHelper args={[150, 75, '#1e293b', '#1e293b']} position={[0, 0, 0]} />

      {/* Render all blocks */}
      {blocks.map((block) => {
        const position = getBlockPosition(block.hash);

        // Skip if position not found
        if (!position) return null;

        const isNew = newBlockHashes.has(block.hash);

        return <BlockBuilding key={block.hash} block={block} position={position} isNew={isNew} />;
      })}

      {/* Transaction particles */}
      <TransactionParticles count={500} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0e1a', 30, 80]} />
    </group>
  );
}
