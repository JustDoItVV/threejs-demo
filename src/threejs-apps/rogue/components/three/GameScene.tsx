'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { OrthographicCamera } from '@react-three/drei';

import { Enemy, Item, Room } from '../../core/types/game-types';
import { selectCharacter, selectRooms, useRogueStore } from '../../store/rogue-store';
// import { CorridorMesh } from '../meshes/CorridorMesh';
import { RoomMesh } from '../meshes/RoomMesh';
import { CharacterSprite } from '../sprites/CharacterSprite';
import { DoorSprite } from '../sprites/DoorSprite';
import { EnemySprite } from '../sprites/EnemySprite';
import { ItemSprite } from '../sprites/ItemSprite';

THREE.Object3D.DEFAULT_UP.set(0, 1, 1);

// Camera offset for 45° side view (Y and Z equal for 45° angle)
const CAMERA_OFFSET = { x: 0, y: -8, z: 8 };

export function GameScene() {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [cameraZoom, setCameraZoom] = useState(50);
  const [useBasicMat, setUseBasicMat] = useState(false);
  const [disableFog, setDisableFog] = useState(false);

  const character = useRogueStore(selectCharacter);
  const rooms = useRogueStore(selectRooms);

  const corridors = useRogueStore((state) => state.corridors);
  const door = useRogueStore((state) => state.door);
  const items = useRogueStore((state) => state.items);
  const enemies = useRogueStore((state) => state.enemies);
  const initController = useRogueStore((state) => state.initController);

  // Initialize controller on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initController();
  }, [initController]);

  // Debug info and camera controls
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const charRoom = character?.position?.room;

    // Always initialize rogueDebug
    // @ts-expect-error -- tmp
    window.rogueDebug = {
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
    };

    // Camera controls
    const worldX = charRoom ? charRoom.fieldX + character.position.x : 0;
    const worldY = charRoom ? charRoom.fieldY + character.position.y : 0;

    // @ts-expect-error -- tmp
    window.rogueCameraControls = {
      lookAtCharacter: () => {
        if (cameraRef.current && charRoom) {
          cameraRef.current.position.set(
            worldX + CAMERA_OFFSET.x,
            worldY + CAMERA_OFFSET.y,
            CAMERA_OFFSET.z
          );
          cameraRef.current.lookAt(worldX, worldY, 0.5);
          cameraRef.current.updateProjectionMatrix();
        }
      },
      lookAtRoomCenter: () => {
        if (cameraRef.current && charRoom) {
          const centerX = charRoom.fieldX + charRoom.sizeX / 2;
          const centerY = charRoom.fieldY + charRoom.sizeY / 2;
          cameraRef.current.position.set(
            centerX + CAMERA_OFFSET.x,
            centerY + CAMERA_OFFSET.y,
            CAMERA_OFFSET.z
          );
          cameraRef.current.lookAt(centerX, centerY, 0.5);
          cameraRef.current.updateProjectionMatrix();
        }
      },
      resetCamera: () => {
        if (cameraRef.current) {
          cameraRef.current.position.set(
            10 + CAMERA_OFFSET.x,
            10 + CAMERA_OFFSET.y,
            CAMERA_OFFSET.z
          );
          cameraRef.current.lookAt(10, 10, 0.5);
          cameraRef.current.updateProjectionMatrix();
        }
      },
      setZoom: (zoom: number) => {
        setCameraZoom(zoom);
        if (cameraRef.current) {
          cameraRef.current.zoom = zoom;
          cameraRef.current.updateProjectionMatrix();
        }
      },
      toggleMarkers: (show: boolean) => {
        setShowMarkers(show);
      },
      toggleFogOfWar: () => {
        setDisableFog((prev) => !prev);
      },
      useBasicMaterial: () => {
        setUseBasicMat((prev) => !prev);
      },
    };
  }, [character, rooms, corridors, enemies, items, disableFog, useBasicMat]);

  // Force camera to correct position on mount and character updates
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
        // onUpdate={(camera) => camera.lookAt(new THREE.Vector3(worldX, worldY, 0.5))}
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

          <gridHelper args={[100, 20, '#444444', '#222222']} position={[0, 0, 0]} />
          <axesHelper args={[10]} />
        </>
      )}

      {rooms.map((room: Room, idx: number) => (
        <RoomMesh
          key={`room-${idx}`}
          room={room}
          useBasicMaterial={useBasicMat}
          disableFog={disableFog}
        />
      ))}

      {/* {corridors.map((corridor: any, idx: number) => (
        <CorridorMesh key={`corridor-${idx}`} corridor={corridor} disableFog={disableFog} />
      ))} */}

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
