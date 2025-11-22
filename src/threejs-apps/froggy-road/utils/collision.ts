import * as THREE from 'three';

import { ICoordinates } from '../types';

export interface BoundingBoxSize {
  x: number;
  y: number;
  z: number;
}

const tempPlayerBox = new THREE.Box3();
const tempObjectBox = new THREE.Box3();
const tempMinPlayer = new THREE.Vector3();
const tempMaxPlayer = new THREE.Vector3();
const tempMinObject = new THREE.Vector3();
const tempMaxObject = new THREE.Vector3();

let isPlayerBoxInUse = false;

export function createBoundingBox(
  position: ICoordinates,
  halfSize: BoundingBoxSize
): THREE.Box3 {
  let box: THREE.Box3;
  let min: THREE.Vector3;
  let max: THREE.Vector3;

  if (!isPlayerBoxInUse) {
    isPlayerBoxInUse = true;
    box = tempPlayerBox;
    min = tempMinPlayer;
    max = tempMaxPlayer;
  } else {
    box = tempObjectBox;
    min = tempMinObject;
    max = tempMaxObject;
  }

  min.set(position.x - halfSize.x, position.y - halfSize.y, position.z - halfSize.z);
  max.set(position.x + halfSize.x, position.y + halfSize.y, position.z + halfSize.z);

  box.set(min, max);
  return box;
}

export function resetBoundingBoxPool(): void {
  isPlayerBoxInUse = false;
}

export function checkCollision(box1: THREE.Box3, box2: THREE.Box3): boolean {
  return box1.intersectsBox(box2);
}

const tempIntersection = new THREE.Box3();
const tempIntersectionSize = new THREE.Vector3();
const tempBox1Size = new THREE.Vector3();

export function getOverlapPercentage(box1: THREE.Box3, box2: THREE.Box3): number {
  if (!checkCollision(box1, box2)) return 0;

  tempIntersection.copy(box1).intersect(box2);
  tempIntersection.getSize(tempIntersectionSize);

  box1.getSize(tempBox1Size);

  const intersectionVolume =
    tempIntersectionSize.x * tempIntersectionSize.y * tempIntersectionSize.z;
  const box1Volume = tempBox1Size.x * tempBox1Size.y * tempBox1Size.z;

  if (box1Volume === 0) return 0;

  return intersectionVolume / box1Volume;
}

export function getOverlapRatio(box1: THREE.Box3, box2: THREE.Box3): number {
  if (!checkCollision(box1, box2)) return 0;

  tempIntersection.copy(box1).intersect(box2);
  tempIntersection.getSize(tempIntersectionSize);

  box1.getSize(tempBox1Size);

  const intersectionArea = tempIntersectionSize.x * tempIntersectionSize.y;
  const box1Area = tempBox1Size.x * tempBox1Size.y;

  if (box1Area === 0) return 0;

  return intersectionArea / box1Area;
}
