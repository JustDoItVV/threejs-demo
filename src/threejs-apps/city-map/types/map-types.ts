import { Vector2, Vector3 } from 'three';

export type CameraMode = '2d' | '3d';
export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog';
export type MapObjectType = 'building' | 'road' | 'park' | 'water' | 'landmark';

export interface GeoCoordinate {
  lat: number;
  lon: number;
}

export interface MapCoordinate {
  x: number;
  z: number;
}

export interface Building {
  id: string;
  name?: string;
  coordinates: GeoCoordinate[];
  height: number;
  levels?: number;
  type?: string;
  color?: string;
  isLandmark?: boolean;
}

export interface Road {
  id: string;
  name?: string;
  coordinates: GeoCoordinate[];
  type: 'highway' | 'primary' | 'secondary' | 'residential' | 'pedestrian';
  width: number;
  lanes?: number;
}

export interface Park {
  id: string;
  name?: string;
  coordinates: GeoCoordinate[];
  type: 'park' | 'garden' | 'forest';
}

export interface Water {
  id: string;
  name?: string;
  coordinates: GeoCoordinate[];
  type: 'river' | 'lake' | 'pond';
}

export interface Landmark {
  id: string;
  name: string;
  position: GeoCoordinate;
  description?: string;
  height?: number;
  icon?: string;
}

export interface CityData {
  buildings: Building[];
  roads: Road[];
  parks: Park[];
  water: Water[];
  landmarks: Landmark[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

export interface MapSettings {
  showBuildings: boolean;
  showRoads: boolean;
  showParks: boolean;
  showWater: boolean;
  showLandmarks: boolean;
  showTraffic: boolean;
  shadows: boolean;
  weather: WeatherType;
  detailLevel: 'low' | 'medium' | 'high';
}

export interface SelectedObject {
  type: MapObjectType;
  id: string;
  name?: string;
  position: Vector3;
  data: Building | Road | Park | Water | Landmark;
}

export interface TrafficVehicle {
  id: string;
  position: Vector3;
  rotation: number;
  roadId: string;
  progress: number;
  speed: number;
  type: 'car' | 'bus' | 'truck';
}

export interface MeasurementPoint {
  position: Vector3;
  worldPosition: GeoCoordinate;
}

export interface Measurement {
  id: string;
  points: MeasurementPoint[];
  distance: number;
}
