'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Upload,
  Plus,
  Settings,
  Trash2,
  BarChart3,
} from 'lucide-react';
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
import { getProject, deleteProject, saveProject } from '@/lib/storage';
import { importHealthBenchData, exportHealthBenchData } from '@/lib/adapters/healthbench';
import { downloadFile, readFileAsText, formatDate } from '@/lib/utils';
import {
  calculateProjectStats,
  calculateQualityScore,
} from '@/lib/statistics';
import type { SpecialtyProject } from '@/types/healthbench';
import { useTranslation } from '@/app/i18n/client';

export default function SpecialtyDetailPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(lng, 'translation');
  const params = useParams();
  const router = useRouter();
  const projectName = params.name as string;

  const [project, setProject] = useState<SpecialtyProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadProject = () => {
      const loadedProject = getProject(projectName);
      setProject(loadedProject || null);
      setIsLoading(false);
    };

    loadProject();
  }, [projectName]);

  const handleExport = () => {
    if (!project) return;

    const jsonl = exportHealthBenchData(project.examples);
    const filename = `${project.name}-${new Date().toISOString().split('T')[0]
      }.jsonl`;
    downloadFile(jsonl, filename, 'application/x-ndjson');
  };

  const handleImport = async () => {
    if (!project) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jsonl';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const content = await readFileAsText(file);
        // Try parsing as HealthBench format
        const examples = importHealthBenchData(content);

        if (examples.length === 0) {
          alert('No valid examples found or failed to parse file.');
          return;
        }

        // Merge logic: Check for duplicates by ID
        const newExamples = [...project.examples];
        let updatedCount = 0;
        let addedCount = 0;

        examples.forEach(newEx => {
          const index = newExamples.findIndex(ex => ex.id === newEx.id);
          if (index >= 0) {
            // Update existing
            newExamples[index] = newEx;
            updatedCount++;
          } else {
            // Add new
            newExamples.push(newEx);
            addedCount++;
          }
        });

        const updatedProject = {
          ...project,
          examples: newExamples,
          metadata: {
            ...project.metadata,
            updated_at: new Date().toISOString(),
          }
        };

        if (saveProject(updatedProject)) {
          setProject(updatedProject);
          alert(`Import successful:\n- Added: ${addedCount}\n- Updated: ${updatedCount}`);
        } else {
          alert('Failed to save imported examples.');
        }
      } catch (error) {
        alert('Failed to import JSONL file');
        console.error(error);
      }
    };

    input.click();
  };

  const handleDelete = () => {
    if (!project) return;

    const success = deleteProject(project.name);
    if (success) {
      router.push(`/${lng}`);
    } else {
      alert('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">
              {t('common.projectNotFound')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('common.projectNotFoundDesc', { name: projectName })}
            </p>
            <Link href={`/${lng}`}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.backToDashboard')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateProjectStats(project);
  const quality = calculateQualityScore(project);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${lng}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToDashboard')}
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.displayName}</h1>
            <p className="text-muted-foreground mb-2">{project.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{project.name}</Badge>
              <span className="text-sm text-muted-foreground">
                Updated: {formatDate(project.metadata.updated_at)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              {t('common.importJsonl')}
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={project.examples.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('common.exportJsonl')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('common.totalExamples')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalExamples}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('common.avgRubrics')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.averageRubricsPerExample}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('common.avgTurns')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageTurnsPerPrompt}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('common.qualityScore')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{quality.score}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Examples Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('common.examples')}</CardTitle>
                  <CardDescription>{t('common.manageExamples')}</CardDescription>
                </div>
                <Link href={`/${lng}/specialties/${projectName}/examples/new`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('common.newExample')}
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {project.examples.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('common.noExamples')}
                  </p>
                  <Link href={`/${lng}/specialties/${projectName}/examples/new`}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('common.createFirstExample')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {project.examples.slice(0, 10).map((example) => (
                    <Link
                      key={example.id}
                      href={`/${lng}/specialties/${projectName}/examples/${encodeURIComponent(example.id)}`}
                    >
                      <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold mb-1">{example.id}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {example.theme.slice(0, 3).map((theme) => (
                                <Badge
                                  key={theme}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {example.prompt.length} turns •{' '}
                              {example.rubrics.length} rubrics
                            </p>
                          </div>
                          {example.metadata?.difficulty && (
                            <Badge
                              variant={
                                example.metadata.difficulty === 'hard'
                                  ? 'destructive'
                                  : example.metadata.difficulty === 'medium'
                                    ? 'default'
                                    : 'outline'
                              }
                            >
                              {example.metadata.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {project.examples.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      + {project.examples.length - 10} more examples
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.configuration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  {t('common.evaluationAxes')}
                </Label>
                <div className="flex flex-wrap gap-1">
                  {project.availableAxes.map((axis) => (
                    <Badge key={axis} variant="outline" className="text-xs">
                      {axis.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  {t('common.commonThemes')}
                </Label>
                {project.commonThemes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {project.commonThemes.slice(0, 10).map((theme) => (
                      <Badge
                        key={theme}
                        variant="secondary"
                        className="text-xs"
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {t('common.noThemes')}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  {t('common.rubricTemplates')}
                </Label>
                <p className="text-2xl font-bold">
                  {project.rubricTemplates.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('common.reusableTemplates')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/${lng}/specialties/${projectName}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  {t('common.editConfiguration')}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.deleteProject')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t('common.deleteProject')}</CardTitle>
              <CardDescription>
                {t('common.deleteProjectConfirm', {
                  name: project.displayName,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t('common.delete')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
