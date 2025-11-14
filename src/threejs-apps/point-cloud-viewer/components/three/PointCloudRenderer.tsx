'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { usePointCloudStore, selectPointCloud, selectPointSize, selectPointBudget } from '../../store/point-cloud-store';
import { applyLOD, calculateCenter } from '../../utils/point-cloud-optimizer';

export function PointCloudRenderer() {
  const pointCloud = usePointCloudStore(selectPointCloud);
  const pointSize = usePointCloudStore(selectPointSize);
  const pointBudget = usePointCloudStore(selectPointBudget);

  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  // Calculate cloud center for LOD
  const cloudCenter = useMemo(() => {
    if (!pointCloud) return new THREE.Vector3();
    return calculateCenter(pointCloud.points);
  }, [pointCloud]);

  // Apply LOD and create geometry
  const { geometry, material } = useMemo(() => {
    if (!pointCloud) return { geometry: null, material: null };

    // Apply LOD based on point budget
    const lodResult = applyLOD(
      pointCloud.points,
      pointCloud.colors,
      camera.position,
      cloudCenter,
      pointBudget
    );

    // Create geometry
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(lodResult.positions, 3));

    if (lodResult.colors) {
      geo.setAttribute('color', new THREE.BufferAttribute(lodResult.colors, 3));
    }

    geo.computeBoundingSphere();

    // Create material
    const mat = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: lodResult.colors ? true : false,
      color: lodResult.colors ? undefined : 0xffffff,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, [pointCloud, pointBudget, cloudCenter, camera.position, pointSize]);

  // Update material properties when point size changes
  useEffect(() => {
    if (material) {
      material.size = pointSize;
      material.needsUpdate = true;
    }
  }, [material, pointSize]);

  // Cleanup
  useEffect(() => {
    return () => {
      geometry?.dispose();
      material?.dispose();
    };
  }, [geometry, material]);

  // Update LOD on camera movement (throttled)
  const lastUpdateRef = useRef(0);
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    // Update LOD every 0.5 seconds
    if (now - lastUpdateRef.current > 0.5) {
      lastUpdateRef.current = now;
      // LOD update would happen here in a more sophisticated implementation
    }
  });

  if (!geometry || !material) return null;

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
