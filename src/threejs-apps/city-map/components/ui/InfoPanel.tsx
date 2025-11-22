import { X } from 'lucide-react';

import { Button } from '@/libs/ui/button';

import { useMapStore } from '../../store/map-store';
import { Building } from '../../types/map-types';

export function InfoPanel() {
  const { selectedObject, setSelectedObject } = useMapStore();

  if (!selectedObject) return null;

  const building = selectedObject.data as Building;

  return (
    <div className="absolute bottom-4 left-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-10">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {building.name || 'Здание'}
        </h3>
        <Button
          onClick={() => setSelectedObject(null)}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {building.type && (
          <div className="flex justify-between">
            <span className="font-medium">Тип:</span>
            <span>{building.type}</span>
          </div>
        )}

        {building.height > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Высота:</span>
            <span>{building.height.toFixed(1)} м</span>
          </div>
        )}

        {building.levels && building.levels > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Этажей:</span>
            <span>{building.levels}</span>
          </div>
        )}

        {building.isLandmark && (
          <div className="mt-3 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
            <span className="text-amber-800 dark:text-amber-200 font-medium">
              Достопримечательность
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
