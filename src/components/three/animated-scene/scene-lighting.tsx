export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[10, -10, -5]} intensity={0.5} color="#ff0080" />
    </>
  );
}
