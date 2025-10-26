import { Hero } from '@/components/home/hero';
import { ProjectGrid } from '@/components/home/project-grid';

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ProjectGrid />
    </main>
  );
}
