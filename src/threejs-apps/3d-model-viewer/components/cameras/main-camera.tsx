'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { CameraControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

import { useStore } from '../../store';

export function MainCamera() {
  const cameraType = useStore((state) => state.cameraType);
  const currentModelId = useStore((state) => state.modelId);
  const modelBounds = useStore((state) => state.modelBounds);

  const orbitControlsEnabled = useStore((state) => state.orbitControlsEnabled);
  const cameraMoveTrigger = useStore((state) => state.cameraMoveTrigger);
  const cameraPresetTrigger = useStore((state) => state.cameraPresetTrigger);
  const clearCameraMoveTrigger = useStore((state) => state.clearCameraMoveTrigger);
  const clearCameraPresetTrigger = useStore((state) => state.clearCameraPresetTrigger);
  const triggerCameraPreset = useStore((state) => state.triggerCameraPreset);

  const cameraControlsRef = useRef<CameraControls>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null);
  const { size } = useThree();
  const lastModelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!cameraMoveTrigger || !cameraControlsRef.current) return;

    const { position, target } = cameraMoveTrigger;

    cameraControlsRef.current
      .setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        true // smooth transition
      )
      .then(() => {
        clearCameraMoveTrigger();
      });
  }, [cameraMoveTrigger, clearCameraMoveTrigger]);

  useEffect(() => {
    if (!cameraPresetTrigger || !modelBounds || !cameraControlsRef.current) return;

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    modelBounds.getCenter(center);
    modelBounds.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2.5;

    let position: [number, number, number];

    switch (cameraPresetTrigger) {
      case 'front':
        position = [center.x, center.y, center.z + distance];
        break;
      case 'side':
        position = [center.x + distance, center.y, center.z];
        break;
      case 'top':
        position = [center.x, center.y + distance, center.z + 0.1];
        break;
      case 'angle':
        position = [center.x + distance * 0.5, center.y + distance * 0.5, center.z + distance];
        break;
      default:
        return;
    }

    cameraControlsRef.current
      .setLookAt(
        position[0],
        position[1],
        position[2],
        center.x,
        center.y,
        center.z,
        true // smooth transition
      )
      .then(() => {
        clearCameraPresetTrigger();
      });
  }, [cameraPresetTrigger, modelBounds, clearCameraPresetTrigger]);

  useEffect(() => {
    if (!modelBounds || !cameraControlsRef.current || !currentModelId) return;
    if (lastModelIdRef.current === currentModelId) return;

    const box = new THREE.Box3().copy(modelBounds);

    cameraControlsRef.current
      .fitToBox(box, true, {
        paddingLeft: 0.5,
        paddingRight: 0.5,
        paddingBottom: 0.5,
        paddingTop: 0.5,
      })
      .then(() => {
        triggerCameraPreset('angle');
      });

    lastModelIdRef.current = currentModelId;
  }, [modelBounds, currentModelId, triggerCameraPreset]);

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.enabled = orbitControlsEnabled;
    }
  }, [orbitControlsEnabled]);

  const lastCameraTypeRef = useRef<string>(cameraType);

  useEffect(() => {
    if (lastCameraTypeRef.current === cameraType) {
      lastCameraTypeRef.current = cameraType;
      return;
    }

    if (!modelBounds) return;

    triggerCameraPreset('angle');

    lastCameraTypeRef.current = cameraType;
  }, [cameraType, modelBounds, triggerCameraPreset]);

  return (
    <>
      {cameraType === 'perspective' && (
        <PerspectiveCamera ref={perspectiveCameraRef} makeDefault position={[3, 3, 6]} fov={50} />
      )}

      {cameraType === 'orthographic' && (
        <OrthographicCamera
          ref={orthographicCameraRef}
          makeDefault
          position={[3, 3, 6]}
          zoom={100}
          left={-size.width / 2}
          right={size.width / 2}
          top={size.height / 2}
          bottom={-size.height / 2}
          near={0.1}
          far={1000}
        />
      )}

      <CameraControls
        ref={cameraControlsRef}
        minDistance={1}
        maxDistance={50}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}
