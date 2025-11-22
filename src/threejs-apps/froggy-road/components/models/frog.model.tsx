'use client';

import { TILE_SIZE } from '../../config/game.coofig';

export function FrogModel() {
  const scale = TILE_SIZE / 2;

  return (
    <group position={[0, 0, 3]} rotation={[Math.PI / 2, Math.PI, 0]}>
      {/* Frog body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5 * scale, 0.3 * scale, 0.6 * scale]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>

      {/* Frog head */}
      <mesh position={[0, 0.25 * scale, 0.15 * scale]} castShadow>
        <boxGeometry args={[0.4 * scale, 0.25 * scale, 0.3 * scale]} />
        <meshLambertMaterial color="#66BB6A" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12 * scale, 0.4 * scale, 0.25 * scale]} castShadow>
        <sphereGeometry args={[0.08 * scale, 16, 16]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>
      <mesh position={[0.12 * scale, 0.4 * scale, 0.25 * scale]} castShadow>
        <sphereGeometry args={[0.08 * scale, 16, 16]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.12 * scale, 0.4 * scale, 0.32 * scale]} castShadow>
        <sphereGeometry args={[0.04 * scale, 16, 16]} />
        <meshLambertMaterial color="#000" />
      </mesh>
      <mesh position={[0.12 * scale, 0.4 * scale, 0.32 * scale]} castShadow>
        <sphereGeometry args={[0.04 * scale, 16, 16]} />
        <meshLambertMaterial color="#000" />
      </mesh>

      {/* Front legs */}
      <mesh position={[-0.2 * scale, -0.1 * scale, 0.2 * scale]} castShadow>
        <boxGeometry args={[0.12 * scale, 0.12 * scale, 0.3 * scale]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
      <mesh position={[0.2 * scale, -0.1 * scale, 0.2 * scale]} castShadow>
        <boxGeometry args={[0.12 * scale, 0.12 * scale, 0.3 * scale]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>

      {/* Back legs */}
      <mesh position={[-0.25 * scale, -0.1 * scale, -0.15 * scale]} castShadow>
        <boxGeometry args={[0.1 * scale, 0.1 * scale, 0.2 * scale]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
      <mesh position={[0.25 * scale, -0.1 * scale, -0.15 * scale]} castShadow>
        <boxGeometry args={[0.1 * scale, 0.1 * scale, 0.2 * scale]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}
