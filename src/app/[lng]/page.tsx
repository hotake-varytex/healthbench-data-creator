'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FolderOpen, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProjects, getStorageStats } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import type { SpecialtyProject } from '@/types/healthbench';
import { useTranslation } from '../i18n/client';

export default function Home({ params: { lng } }: { params: { lng: string } }) {
    const { t } = useTranslation(lng, 'translation');
    const [projects, setProjects] = useState<SpecialtyProject[]>([]);
    const [stats, setStats] = useState({ totalProjects: 0, totalExamples: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            const loadedProjects = getProjects();
            const storageStats = getStorageStats();
            setProjects(loadedProjects);
            setStats({
                totalProjects: storageStats.totalProjects,
                totalExamples: storageStats.totalExamples,
            });
            setIsLoading(false);
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                    {t('description')}
                </p>
                <Separator className="mb-6" />
                <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{stats.totalProjects}</p>
                            <p className="text-sm text-muted-foreground">Specialty Projects</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{stats.totalExamples}</p>
                            <p className="text-sm text-muted-foreground">Total Examples</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No specialty projects yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                            Get started by creating your first specialty project. Each project
                            can contain multiple HealthBench examples with rubrics and
                            metadata.
                        </p>
                        <Link href={`/${lng}/specialties/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Project
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Your Specialty Projects</h2>
                        <Link href={`/${lng}/specialties/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project.name}
                                href={`/${lng}/specialties/${project.name}`}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="mb-1">
                                                    {project.displayName}
                                                </CardTitle>
                                                <Badge variant="outline" className="text-xs">
                                                    {project.name}
                                                </Badge>
                                            </div>
                                            <FolderOpen className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Examples:</span>
                                                <span className="font-semibold">
                                                    {project.examples.length}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Axes:</span>
                                                <span className="font-semibold">
                                                    {project.availableAxes.length}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Templates:</span>
                                                <span className="font-semibold">
                                                    {project.rubricTemplates.length}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    Updated: {formatDate(project.metadata.updated_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Info Section */}
            <div className="mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('features.creation.title')}</CardTitle>
                        <CardDescription>
                            {t('features.creation.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1">
                                1. {t('features.creation.title')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t('features.creation.description')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">
                                2. {t('features.validation.title')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t('features.validation.description')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">
                                3. {t('features.export.title')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t('features.export.description')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
