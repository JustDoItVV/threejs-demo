import { selectController, selectRenderTrigger, useStore } from '../../store';

export function GameSceneLights() {
  useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const character = controller?.getEntitiesToRender().character;
  const charRoom = character?.position.room;

  if (!charRoom) return null;

  const worldX = charRoom.fieldX + character.position.x;
  const worldY = charRoom.fieldY + character.position.y;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[worldX + 10, worldY + 10, 20]} intensity={1.0} castShadow />
      <hemisphereLight args={['#ffffff', '#8B4513', 0.4]} />
    </>
  );
}
