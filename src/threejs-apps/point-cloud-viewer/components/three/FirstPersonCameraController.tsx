'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { selectFirstPersonConfig, usePointCloudStore } from '../../store/point-cloud-store';

export function FirstPersonCameraController() {
  const config = usePointCloudStore(selectFirstPersonConfig);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { gl } = useThree();

  const keysPressed = useRef<Set<string>>(new Set());
  const rotationRef = useRef({ pitch: config.rotation.x, yaw: config.rotation.y });
  const isPointerLockedRef = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLockedRef.current) return;

      rotationRef.current.yaw -= e.movementX * config.lookSensitivity;
      rotationRef.current.pitch -= e.movementY * config.lookSensitivity;

      // Clamp pitch to prevent camera flip
      rotationRef.current.pitch = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, rotationRef.current.pitch)
      );
    };

    const handleClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isPointerLockedRef.current = document.pointerLockElement === canvas;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [config, gl]);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const speed = keysPressed.current.has('ShiftLeft') || keysPressed.current.has('ShiftRight')
      ? config.movementSpeed * config.fastMovementMultiplier
      : config.movementSpeed;

    // Get camera direction
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // Movement
    if (keysPressed.current.has('KeyW') || keysPressed.current.has('ArrowUp')) {
      camera.position.addScaledVector(direction, -speed * delta);
    }
    if (keysPressed.current.has('KeyS') || keysPressed.current.has('ArrowDown')) {
      camera.position.addScaledVector(direction, speed * delta);
    }
    if (keysPressed.current.has('KeyA') || keysPressed.current.has('ArrowLeft')) {
      camera.position.addScaledVector(right, speed * delta);
    }
    if (keysPressed.current.has('KeyD') || keysPressed.current.has('ArrowRight')) {
      camera.position.addScaledVector(right, -speed * delta);
    }
    if (keysPressed.current.has('Space')) {
      camera.position.z += config.verticalSpeed * delta;
    }
    if (keysPressed.current.has('ControlLeft') || keysPressed.current.has('ControlRight')) {
      camera.position.z -= config.verticalSpeed * delta;
    }

    // Apply rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotationRef.current.yaw;
    camera.rotation.x = rotationRef.current.pitch;
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      near={0.1}
      far={10000}
      position={[config.position.x, config.position.y, config.position.z]}
    />
  );
}
