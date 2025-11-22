import { useEffect, useRef } from 'react';

import { MAP_CONFIG } from '../../config/map.config';
import { useMapStore } from '../../store/map-store';

export function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cityData, selectedObject } = useMapStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cityData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = MAP_CONFIG.UI.miniMapSize;
    canvas.width = size;
    canvas.height = size;

    // Очищаем canvas
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(0, 0, size, size);

    // Вычисляем масштаб
    const bounds = cityData.bounds;
    const latRange = bounds.maxLat - bounds.minLat;
    const lonRange = bounds.maxLon - bounds.minLon;
    const scale = size / Math.max(latRange, lonRange);

    const offsetX = size / 2;
    const offsetY = size / 2;

    // Рисуем здания
    ctx.fillStyle = '#B0B0B0';
    cityData.buildings.forEach((building) => {
      if (building.coordinates.length < 3) return;

      ctx.beginPath();
      building.coordinates.forEach((coord, i) => {
        const x = offsetX + (coord.lon - MAP_CONFIG.CENTER.lon) * scale * 1000;
        const y = offsetY - (coord.lat - MAP_CONFIG.CENTER.lat) * scale * 1000;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();

      // Подсветка выбранного здания
      if (selectedObject && selectedObject.id === building.id) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Рисуем дороги
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 1;
    cityData.roads.forEach((road) => {
      if (road.coordinates.length < 2) return;

      ctx.beginPath();
      road.coordinates.forEach((coord, i) => {
        const x = offsetX + (coord.lon - MAP_CONFIG.CENTER.lon) * scale * 1000;
        const y = offsetY - (coord.lat - MAP_CONFIG.CENTER.lat) * scale * 1000;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });

    // Рисуем парки
    ctx.fillStyle = '#4CAF50';
    cityData.parks.forEach((park) => {
      if (park.coordinates.length < 3) return;

      ctx.beginPath();
      park.coordinates.forEach((coord, i) => {
        const x = offsetX + (coord.lon - MAP_CONFIG.CENTER.lon) * scale * 1000;
        const y = offsetY - (coord.lat - MAP_CONFIG.CENTER.lat) * scale * 1000;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
    });

    // Рисуем центр (точка)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [cityData, selectedObject]);

  if (!cityData) return null;

  return (
    <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 z-10">
      <div className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 text-center">
        Миникарта
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 dark:border-gray-600 rounded"
      />
    </div>
  );
}
