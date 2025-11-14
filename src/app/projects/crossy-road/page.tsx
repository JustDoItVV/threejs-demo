import { Metadata } from 'next';

import { CrossyRoad } from '@/threejs-apps/crossy-road';

export const metadata: Metadata = {
  title: 'Crossy Road - Three.js Demo',
  description: 'Classic Crossy Road game clone built with Three.js and React',
};

export default function CrossyRoadPage() {
  return (
    <div className="w-full h-screen">
      <CrossyRoad />
    </div>
  );
}
