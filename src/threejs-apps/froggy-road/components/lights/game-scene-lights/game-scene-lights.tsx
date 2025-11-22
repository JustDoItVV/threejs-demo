'use client';

export function GameSceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.5} position={[-100, -100, 200]} />
    </>
  );
}
