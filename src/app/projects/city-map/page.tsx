import { Metadata } from 'next';

import { CityMapViewer } from '@/threejs-apps/city-map';

export const metadata: Metadata = {
  title: '3D City Map - Moscow | Three.js Demo',
  description:
    'Interactive 3D map of Moscow center with switchable camera views, dynamic weather, animated traffic, and distance measurement tool.',
};

export default function CityMapPage() {
  return (
    <main className="w-full h-screen">
      <CityMapViewer />
    </main>
  );
}
