'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { OrthographicCamera } from '@react-three/drei';

import {
  selectCameraZoom,
  selectCharacter,
  selectCorridors,
  selectDisableFog,
  selectDoor,
  selectEnemies,
  selectItems,
  selectRooms,
  selectShowMarkers,
  useRogueStore,
} from '../../store/rogue-store';
import { Corridor, Enemy, Item, Room } from '../../types/game-types';
import { CorridorMesh } from '../meshes/CorridorMesh';
import { RoomMesh } from '../meshes/RoomMesh';
import { CharacterSprite } from '../sprites/CharacterSprite';
import { DoorSprite } from '../sprites/DoorSprite';
import { EnemySprite } from '../sprites/EnemySprite';
import { ItemSprite } from '../sprites/ItemSprite';

// Camera offset for 45° side view (Y and Z equal for 45° angle)
const CAMERA_OFFSET = { x: 0, y: -8, z: 8 };

export function GameScene() {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const originalUpRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Store selectors
  const character = useRogueStore(selectCharacter);
  const rooms = useRogueStore(selectRooms);
  const corridors = useRogueStore(selectCorridors);
  const door = useRogueStore(selectDoor);
  const items = useRogueStore(selectItems);
  const enemies = useRogueStore(selectEnemies);
  const initialize = useRogueStore((state) => state.initialize);

  // Debug & Camera state from store
  const showMarkers = useRogueStore(selectShowMarkers);
  const cameraZoom = useRogueStore(selectCameraZoom);
  const disableFog = useRogueStore(selectDisableFog);
  const setDebugInfo = useRogueStore((state) => state.setDebugInfo);

  // Save and restore THREE.Object3D.DEFAULT_UP to prevent affecting other apps
  useEffect(() => {
    // Save original DEFAULT_UP
    originalUpRef.current.copy(THREE.Object3D.DEFAULT_UP);

    // Set custom DEFAULT_UP for rogue game (45° isometric view)
    THREE.Object3D.DEFAULT_UP.set(0, 1, 1);

    // Restore original DEFAULT_UP on unmount
    return () => {
      THREE.Object3D.DEFAULT_UP.copy(originalUpRef.current);
    };
  }, []);

  // Initialize model on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initialize();
  }, [initialize]);

  // Update debug info when game state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const charRoom = character?.position?.room;

    setDebugInfo({
      characterPos: charRoom
        ? {
            x: charRoom.fieldX + character.position.x,
            y: charRoom.fieldY + character.position.y,
          }
        : null,
      cameraPos: cameraRef.current
        ? {
            x: cameraRef.current.position.x,
            y: cameraRef.current.position.y,
            z: cameraRef.current.position.z,
          }
        : null,
      roomInfo: charRoom
        ? {
            fieldX: charRoom.fieldX,
            fieldY: charRoom.fieldY,
            sizeX: charRoom.sizeX,
            sizeY: charRoom.sizeY,
          }
        : null,
      entityCount: {
        rooms: rooms.length,
        enemies: enemies.length,
        items: items.length,
        corridors: corridors.length,
      },
    });
  }, [character, rooms, corridors, enemies, items, setDebugInfo]);

  // Update camera zoom when it changes in store
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.zoom = cameraZoom;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [cameraZoom]);

  // Force camera to correct position on character movement
  useEffect(() => {
    if (cameraRef.current && character?.position?.room) {
      const charRoom = character.position.room;
      const worldX = charRoom.fieldX + character.position.x;
      const worldY = charRoom.fieldY + character.position.y;

      cameraRef.current.position.set(
        worldX + CAMERA_OFFSET.x,
        worldY + CAMERA_OFFSET.y,
        CAMERA_OFFSET.z
      );
      cameraRef.current.lookAt(worldX, worldY, 0.5);
      cameraRef.current.updateProjectionMatrix();
    }
  }, [character?.position?.room, character?.position?.x, character?.position?.y]);

  const hasRoom = character?.position?.room;

  // If no room yet (game not started), show placeholder scene
  if (!hasRoom || rooms.length === 0) {
    return <>Loading ...</>;
  }

  const charRoom = character.position.room;
  const worldX = charRoom.fieldX + character.position.x;
  const worldY = charRoom.fieldY + character.position.y;
  const cameraPosition = new THREE.Vector3(
    worldX + CAMERA_OFFSET.x,
    worldY + CAMERA_OFFSET.y,
    CAMERA_OFFSET.z
  );

  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={cameraPosition}
        zoom={cameraZoom}
        near={0.1}
        far={1000}
        rotation={[-Math.PI / 4, 0, 0]}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[worldX + 10, worldY + 10, 20]} intensity={1.0} castShadow />
      <hemisphereLight args={['#ffffff', '#8B4513', 0.4]} />

      {showMarkers && (
        <>
          <mesh position={[worldX, worldY, 1]}>
            <boxGeometry args={[0.5, 0.5, 2]} />
            <meshBasicMaterial color="red" />
          </mesh>

          <mesh
            position={[
              charRoom.fieldX + charRoom.sizeX / 2,
              charRoom.fieldY + charRoom.sizeY / 2,
              1,
            ]}
          >
            <boxGeometry args={[0.3, 0.3, 1.5]} />
            <meshBasicMaterial color="green" />
          </mesh>

          {/* Main grid: cells every 1 unit (major lines) */}
          <gridHelper args={[100, 100, '#555555', '#333333']} position={[0, 0, 0]} />
          {/* Sub grid: lines every 0.5 units (minor lines) */}
          <gridHelper args={[100, 200, '#333333', '#1a1a1a']} position={[0, 0, -0.01]} />
          <axesHelper args={[10]} />
        </>
      )}

      {rooms.map((room: Room, idx: number) => (
        <RoomMesh
          key={`room-${idx}`}
          room={room}
          useBasicMaterial={false}
          disableFog={disableFog}
        />
      ))}

      {corridors.map((corridor: Corridor, idx: number) => (
        <CorridorMesh key={`corridor-${idx}`} corridor={corridor} disableFog={disableFog} />
      ))}

      {door && <DoorSprite door={door} />}

      {items.map((item: Item, idx: number) => (
        <ItemSprite key={`item-${idx}`} item={item} />
      ))}

      {enemies.map((enemy: Enemy, idx: number) => (
        <EnemySprite key={`enemy-${idx}`} enemy={enemy} />
      ))}

      {character && <CharacterSprite character={character} />}
    </>
  );
}
