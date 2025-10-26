import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

import { ProjectCanvas } from '@/components/three/project-canvas';
import { Projects } from '@/data/projects';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { getProjectBySlug } from '@/utils';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Three.js Demo`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex-1">
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <IoArrowBack /> Back to Home
            </Button>
          </Link>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{project.title}</h1>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl">{project.description}</p>
          </div>

          <div className="w-full h-[600px] bg-muted rounded-lg overflow-hidden">
            <ProjectCanvas slug={project.slug} />
          </div>
        </div>
      </div>
    </main>
  );
}
