import { Projects } from '@/data/projects';

export function getProjectBySlug(slug: string) {
  return Projects.find((project) => project.slug === slug);
}
