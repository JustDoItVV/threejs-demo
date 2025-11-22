'use client';

import { TILE_SIZE } from '../../config/game.coofig';

export function ChickenModel() {
  const scale = TILE_SIZE / 2;

  return (
    <group position={[0, 0, 10]} rotation={[Math.PI / 2, Math.PI, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.35 * scale, 16, 16]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.3 * scale, 0.2 * scale]} castShadow>
        <sphereGeometry args={[0.2 * scale, 16, 16]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.28 * scale, 0.35 * scale]} castShadow>
        <coneGeometry args={[0.08 * scale, 0.15 * scale, 4]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>

      {/* Comb (red crest on head) */}
      <mesh position={[0, 0.45 * scale, 0.15 * scale]} castShadow>
        <boxGeometry args={[0.1 * scale, 0.15 * scale, 0.1 * scale]} />
        <meshLambertMaterial color="#FF0000" />
      </mesh>
      <mesh position={[-0.05 * scale, 0.48 * scale, 0.15 * scale]} castShadow>
        <sphereGeometry args={[0.05 * scale, 8, 8]} />
        <meshLambertMaterial color="#FF0000" />
      </mesh>
      <mesh position={[0.05 * scale, 0.48 * scale, 0.15 * scale]} castShadow>
        <sphereGeometry args={[0.05 * scale, 8, 8]} />
        <meshLambertMaterial color="#FF0000" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1 * scale, 0.35 * scale, 0.28 * scale]} castShadow>
        <sphereGeometry args={[0.04 * scale, 8, 8]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1 * scale, 0.35 * scale, 0.28 * scale]} castShadow>
        <sphereGeometry args={[0.04 * scale, 8, 8]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Wattle (red thing under beak) */}
      <mesh position={[0, 0.22 * scale, 0.3 * scale]} castShadow>
        <sphereGeometry args={[0.06 * scale, 8, 8]} />
        <meshLambertMaterial color="#FF0000" />
      </mesh>

      {/* Wings */}
      <mesh position={[-0.25 * scale, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.25 * scale, 0.35 * scale]} />
        <meshLambertMaterial color="#F5F5F5" />
      </mesh>
      <mesh position={[0.25 * scale, 0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.25 * scale, 0.35 * scale]} />
        <meshLambertMaterial color="#F5F5F5" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12 * scale, -0.25 * scale, 0.05 * scale]} castShadow>
        <cylinderGeometry args={[0.03 * scale, 0.03 * scale, 0.2 * scale, 8]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      <mesh position={[0.12 * scale, -0.25 * scale, 0.05 * scale]} castShadow>
        <cylinderGeometry args={[0.03 * scale, 0.03 * scale, 0.2 * scale, 8]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.12 * scale, -0.35 * scale, 0.1 * scale]} castShadow>
        <boxGeometry args={[0.08 * scale, 0.02 * scale, 0.12 * scale]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      <mesh position={[0.12 * scale, -0.35 * scale, 0.1 * scale]} castShadow>
        <boxGeometry args={[0.08 * scale, 0.02 * scale, 0.12 * scale]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>

      {/* Tail feathers */}
      <mesh position={[0, 0.1 * scale, -0.3 * scale]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.2 * scale, 0.3 * scale, 0.05 * scale]} />
        <meshLambertMaterial color="#F5F5F5" />
      </mesh>
    </group>
  );
}
