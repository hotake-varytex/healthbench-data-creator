'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExampleForm } from '@/components/example-form';
import { getProject, saveProject } from '@/lib/storage';
import type { HealthbenchExample } from '@/types/healthbench';

export default function NewExamplePage({
    params: { lng },
}: {
    params: { lng: string };
}) {
    const params = useParams();
    const router = useRouter();
    const projectName = params.name as string;

    const project = getProject(projectName);

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleSave = (example: HealthbenchExample) => {
        const updatedProject = {
            ...project,
            examples: [...project.examples, example],
            metadata: {
                ...project.metadata,
                updated_at: new Date().toISOString(),
            },
        };

        if (saveProject(updatedProject)) {
            router.push(`/${lng}/specialties/${projectName}`);
        } else {
            alert('Failed to save example');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Project
                </Button>
                <h1 className="text-3xl font-bold">Create New Example</h1>
                <p className="text-muted-foreground">
                    Add a new scenario to {project.displayName}
                </p>
            </div>

            <ExampleForm
                availableAxes={project.availableAxes}
                commonThemes={project.commonThemes}
                onSave={handleSave}
                onCancel={() => router.back()}
            />
        </div>
    );
}
