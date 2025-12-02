import { Projects } from '@/data/projects';
import { ProjectCard } from './project-card';

export function ProjectGrid() {
  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold">Projects</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {Projects.map((project) => (
            <div key={project.slug} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
