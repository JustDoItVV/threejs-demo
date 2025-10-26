import { Projects } from '@/data/projects';
import { ProjectCard } from './project-card';

export function ProjectGrid() {
  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
