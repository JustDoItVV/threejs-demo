import { getAssetPath } from '@/libs/ui/utils';

import { DefaultModel } from '../types';

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

export const DEFAULT_MODELS: DefaultModel[] = [
  {
    id: 'velvet-sofa',
    name: 'Velvet Sofa',
    url: getAssetPath('/models/velvet-sofa.glb'),
    format: 'glb',
    size: '3.1 MB',
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    url: getAssetPath('/models/iphone-14-pro.glb'),
    format: 'glb',
    size: '1.5 MB',
  },
  {
    id: 'chair-damask',
    name: 'Chair Damask',
    url: getAssetPath('/models/chair-damask.glb'),
    format: 'glb',
    size: '2.0 MB',
  },
  {
    id: 'lantern',
    name: 'Lantern',
    url: getAssetPath('/models/lantern.glb'),
    format: 'glb',
    size: '9.2 MB',
  },
  {
    id: 'tree',
    name: 'Tree',
    url: getAssetPath('/models/tree.fbx'),
    format: 'fbx',
    size: '4.5 MB',
  },
  {
    id: 'teamug',
    name: 'Tea Mug',
    url: getAssetPath('/models/teamug.fbx'),
    format: 'fbx',
    size: '1.3 MB',
  },
  {
    id: 'cottage',
    name: 'Cottage',
    url: getAssetPath('/models/cottage.fbx'),
    format: 'fbx',
    size: '125 KB',
  },
  {
    id: 'sword',
    name: 'Sword',
    url: getAssetPath('/models/sword.fbx'),
    format: 'fbx',
    size: '79 KB',
  },
  {
    id: 'armadillo',
    name: 'Armadillo',
    url: getAssetPath('/models/armadillo.obj'),
    format: 'obj',
    size: '4.5 MB',
  },
  {
    id: 'stanford-bunny',
    name: 'Stanford Bunny',
    url: getAssetPath('/models/stanford-bunny.obj'),
    format: 'obj',
    size: '2.3 MB',
  },
  {
    id: 'homer',
    name: 'Homer',
    url: getAssetPath('/models/homer.obj'),
    format: 'obj',
    size: '362 KB',
  },
  {
    id: 'cow',
    name: 'Cow',
    url: getAssetPath('/models/cow.obj'),
    format: 'obj',
    size: '176 KB',
  },
];

export const MATERIAL_TYPES = [
  { name: 'Standard', value: 'standard' },
  { name: 'Metallic', value: 'metallic' },
  { name: 'Matte', value: 'matte' },
  { name: 'Glossy', value: 'glossy' },
];

export const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#f0f0f0' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Silver', value: '#c0c0c0' },
];

export interface ExternalLink {
  url: string;
  name: string;
  size: string;
  canInsert: boolean; // true for '+', false for '?' and '-'
  isWarning: boolean; // true for '?'
  isTexture: boolean; // true for '-'
}

export const EXTERNAL_LINKS: ExternalLink[] = [
  {
    url: 'https://drive.google.com/uc?export=download&id=1-pd-MkcYRByNIaOCdLTZwBXa953t5Yva',
    name: 'church.png',
    size: '203.6 Mb',
    canInsert: false,
    isWarning: true,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=15gWy9EEvU1Sx-ZzRFcy_HIXlPohm887H',
    name: 'dragon.fbx',
    size: '6 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1An8gROTNiDt5zsegV-jLgqzVHoD19rDY',
    name: 'beautiful-game.glb',
    size: '41 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1MmTYX4NaltPjMfAqdBfZYxEZgVqYLYzG',
    name: 'beetle.jpg',
    size: '13.4 Mb',
    canInsert: false,
    isWarning: false,
    isTexture: true,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1ftcUBFHJXQJh8ne9bGnn-jiUhOgDPiZl',
    name: 'beetle.obj',
    size: '19.5 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1iUNHRq8UY4y2az1fbe6-AHxMBaflkcO9',
    name: 'golden-tiger.jpg',
    size: '18.3 Mb',
    canInsert: false,
    isWarning: false,
    isTexture: true,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1kaLMqUOJ9B1PtbTFStFKUx5jPV8SxIp4',
    name: 'boombox.glb',
    size: '10.1 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1oeini229tKKBKnSaJjRQkTZrUuFi9T_h',
    name: 'chair.fbx',
    size: '1.8 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1pKIFBs0JYA2yAf1AITribAJcFftTKNRG',
    name: 'church.obj',
    size: '194.2 Mb',
    canInsert: false,
    isWarning: true,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1rZiV-9A4B4FIg14QAFKKAlWKa3nVus5K',
    name: 'golden-tiger.obj',
    size: '140 Mb',
    canInsert: false,
    isWarning: true,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1s1DuQ942tBhhknt-34Uqn0SYQ99UXB-R',
    name: 'plant.fbx',
    size: '5.1 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
  {
    url: 'https://drive.google.com/uc?export=download&id=1tQEoNiFEFamHiakR7SFRiWZ2dRqU-wfM',
    name: 'performance-test.glb',
    size: '36.2 Mb',
    canInsert: true,
    isWarning: false,
    isTexture: false,
  },
];
