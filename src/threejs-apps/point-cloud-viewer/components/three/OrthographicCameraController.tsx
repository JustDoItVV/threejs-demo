'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrthographicCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { selectOrthographicConfig, usePointCloudStore } from '../../store/point-cloud-store';

export function OrthographicCameraController() {
  const config = usePointCloudStore(selectOrthographicConfig);
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const { gl } = useThree();

  const targetRef = useRef(new THREE.Vector3(config.target.x, config.target.y, config.target.z));
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      const delta = e.deltaY * -0.001;
      const newZoom = cameraRef.current.zoom * (1 + delta);
      cameraRef.current.zoom = Math.max(config.minZoom, Math.min(config.maxZoom, newZoom));
      cameraRef.current.updateProjectionMatrix();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent browser context menu
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // Left click for panning
        isDraggingRef.current = true;
        previousMouseRef.current = { x: e.clientX, y: e.clientY };
      } else if (e.button === 2) {
        // Right click for rotation
        isDraggingRef.current = true;
        previousMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cameraRef.current) return;

      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;

      if (e.buttons === 1) {
        // Left button - pan camera (move target)
        const panSpeed = config.panSpeed / cameraRef.current.zoom;
        targetRef.current.x -= deltaX * panSpeed;
        targetRef.current.y += deltaY * panSpeed;
      } else if (e.buttons === 2) {
        // Right button - rotate camera
        rotationRef.current += deltaX * config.rotationSpeed * 0.01;
      }

      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [config, gl]);

  useFrame(() => {
    if (!cameraRef.current) return;

    // Update camera position to look at target
    const distance = 100;
    const angle = rotationRef.current;

    cameraRef.current.position.set(
      targetRef.current.x + Math.cos(angle) * distance,
      targetRef.current.y + Math.sin(angle) * distance,
      targetRef.current.z + 50
    );

    cameraRef.current.lookAt(targetRef.current);
    cameraRef.current.updateMatrixWorld();
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      zoom={config.zoom}
      near={0.1}
      far={10000}
      position={[config.position.x, config.position.y, config.position.z]}
    />
  );
}
