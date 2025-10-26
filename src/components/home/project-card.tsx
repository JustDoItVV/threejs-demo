import Link from 'next/link';

import { Project } from '@/types';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-2">
        <div className="relative w-full h-60 bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Coming Soon</p>
        </div>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
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
