import Image from 'next/image';
import Link from 'next/link';

import { Project } from '@/types';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';
import { getAssetPath } from '@/ui/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-2 flex flex-col">
        <div className="relative w-full h-60 bg-muted overflow-hidden shrink-0">
          {project.thumbnail ? (
            <Image
              src={getAssetPath(project.thumbnail)}
              alt={project.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          )}
        </div>
        <CardContent className="p-6 space-y-3 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <p className="text-muted-foreground leading-relaxed flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
