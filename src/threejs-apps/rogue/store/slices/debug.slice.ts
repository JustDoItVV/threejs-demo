import { StateCreator } from 'zustand';

import { Store } from '../';
import { IPosition } from '../../types';

export interface IDebugSlice {
  showGrid: boolean;
  showAxes: boolean;
  enableFreeCameraControl: boolean;
  godMode: boolean;
  isPanelOpen: boolean;
  cameraZoom: number;
  showMarkers: boolean;
  disableFog: boolean;
  characterPos: IPosition | null;
  cameraPos: IPosition | null;
  roomInfo: {
    fieldX?: number;
    fieldY?: number;
    sizeX?: number;
    sizeY?: number;
  } | null;
  entityCount: {
    rooms: number;
    enemies: number;
    items: number;
    corridors: number;
  };

  updateDebugOnModel: () => void;

  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleFreeCameraControl: () => void;
  toggleGodMode: () => void;
  togglePanel: () => void;
  setCameraZoom: (zoom: number) => void;
  toggleMarkers: () => void;
  toggleFog: () => void;
  setCharacterPos: (pos: IPosition | null) => void;
  setCameraPos: (pos: IPosition | null) => void;
  setRoomInfo: (pos: { fieldX: number; fieldY: number; sizeX: number; sizeY: number } | null) => void;
  setEntityCount: (info: { rooms: number; enemies: number; items: number; corridors: number }) => void;
}

export const createDebugSlice: StateCreator<
  Store,
  [],
  [],
  IDebugSlice
> = (set, get) => ({
  showGrid: false,
  showAxes: false,
  enableFreeCameraControl: false,
  godMode: false,
  isPanelOpen: false,
  cameraZoom: 50,
  showMarkers: false,
  disableFog: false,
  characterPos: null,
  cameraPos: null,
  roomInfo: null,
  entityCount: {
    rooms: 0,
    enemies: 0,
    items: 0,
    corridors: 0,
  },

  updateDebugOnModel: () => {
    const model = get().controller?.model;
    const level = model?.gameSession.level;
    const characterPos = model?.gameSession.character.position;
    const room = characterPos?.room;
    set({
      characterPos,
      roomInfo: { fieldX: room?.fieldX, fieldY: room?.fieldY, sizeX: room?.sizeX, sizeY: room?.sizeY },
      entityCount: { rooms: level?.rooms.length ?? 0, enemies: level?.enemies.length ?? 0, items: level?.items.length ?? 0, corridors: level?.corridors.length ?? 0 },
    });
  },

  toggleGrid: () => set({ showGrid: !get().showGrid }),

  toggleAxes: () => set({ showAxes: !get().showAxes }),

  toggleFreeCameraControl: () => set({ enableFreeCameraControl: !get().enableFreeCameraControl }),

  togglePanel: () => set({ isPanelOpen: !get().isPanelOpen }),

  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),

  toggleMarkers: () => set({ showMarkers: !get().showMarkers }),

  toggleFog: () => set({ disableFog: !get().disableFog }),

  setCharacterPos: (pos) => set({ characterPos: pos }),

  setCameraPos: (pos) => set({ cameraPos: pos }),

  setRoomInfo: (info) => set({ roomInfo: info }),

  setEntityCount: (info) => set({ entityCount: info }),

  toggleGodMode: () => {
    const state = get();
    const { controller, godMode, updateDebugOnModel, _triggerRender } = state;
    const model = controller?.model;
    if (!model || !model.gameSession.character) return;

    const newGodMode = !godMode;

    if (newGodMode) {
      const char = model.gameSession.character;
      char.hp = 9999;
      char.maxHp = 9999;
      char.str = 999;
      char.dex = 999;
      char.gold = 9999;
    }

    set({ godMode: newGodMode });
    updateDebugOnModel();
    _triggerRender();
  },
});
