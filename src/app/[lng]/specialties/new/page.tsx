'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { saveProject, projectExists } from '@/lib/storage';
import { slugify, getCurrentTimestamp } from '@/lib/utils';
import type { SpecialtyProject, AxisId } from '@/types/healthbench';
import { useTranslation } from '@/app/i18n/client';

const COMMON_AXES: AxisId[] = [
  'accuracy',
  'completeness',
  'context_awareness',
  'communication',
  'instruction_following',
  'safety',
];

export default function NewSpecialtyPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(lng, 'translation');
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAxes, setSelectedAxes] = useState<AxisId[]>([
    'accuracy',
    'completeness',
  ]);
  const [customAxis, setCustomAxis] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [newTheme, setNewTheme] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddAxis = () => {
    if (
      customAxis.trim() &&
      !selectedAxes.includes(customAxis.trim() as AxisId)
    ) {
      setSelectedAxes([...selectedAxes, customAxis.trim() as AxisId]);
      setCustomAxis('');
    }
  };

  const handleRemoveAxis = (axis: AxisId) => {
    setSelectedAxes(selectedAxes.filter((a) => a !== axis));
  };

  const handleAddTheme = () => {
    if (newTheme.trim() && !themes.includes(newTheme.trim())) {
      setThemes([...themes, newTheme.trim()]);
      setNewTheme('');
    }
  };

  const handleRemoveTheme = (theme: string) => {
    setThemes(themes.filter((t) => t !== theme));
  };

  const handleToggleAxis = (axis: AxisId) => {
    if (selectedAxes.includes(axis)) {
      setSelectedAxes(selectedAxes.filter((a) => a !== axis));
    } else {
      setSelectedAxes([...selectedAxes, axis]);
    }
  };

  const handleCreate = () => {
    // Validation
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (selectedAxes.length === 0) {
      setError('At least one evaluation axis is required');
      return;
    }

    const projectName = slugify(displayName);

    if (projectExists(projectName)) {
      setError(`A project with the name "${projectName}" already exists`);
      return;
    }

    setIsCreating(true);

    // Create project
    const now = getCurrentTimestamp();
    const newProject: SpecialtyProject = {
      name: projectName,
      displayName: displayName.trim(),
      description: description.trim() || 'No description provided',
      availableAxes: selectedAxes,
      commonThemes: themes,
      rubricTemplates: [],
      examples: [],
      metadata: {
        created_at: now,
        updated_at: now,
        version: '1.0.0',
      },
    };

    // Save to storage
    const success = saveProject(newProject);

    if (success) {
      router.push(`/${lng}/specialties/${projectName}`);
    } else {
      setError('Failed to create project. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${lng}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToDashboard')}
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          {t('common.createNewProject')}
        </h1>
        <p className="text-muted-foreground">
          {t('common.createNewProjectDesc')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 border border-destructive bg-destructive/10 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.basicInfo')}</CardTitle>
            <CardDescription>{t('common.basicInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('common.displayName')} *</Label>
              <Input
                id="displayName"
                placeholder={t('common.displayNamePlaceholder')}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError('');
                }}
              />
              {displayName && (
                <p className="text-xs text-muted-foreground">
                  Project ID:{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    {slugify(displayName)}
                  </code>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('common.descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('common.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Axes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.evaluationAxes')} *</CardTitle>
            <CardDescription>{t('common.evaluationAxesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common Axes */}
            <div>
              <Label className="mb-2 block">{t('common.commonAxes')}</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_AXES.map((axis) => (
                  <Badge
                    key={axis}
                    variant={
                      selectedAxes.includes(axis) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleToggleAxis(axis)}
                  >
                    {axis.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Selected Axes */}
            {selectedAxes.length > 0 && (
              <div>
                <Label className="mb-2 block">
                  {t('common.selectedAxes')} ({selectedAxes.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedAxes.map((axis) => (
                    <Badge key={axis} variant="default" className="gap-1">
                      {axis.replace(/_/g, ' ')}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveAxis(axis)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Axis */}
            <div>
              <Label className="mb-2 block">{t('common.addCustomAxis')}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., cultural_sensitivity"
                  value={customAxis}
                  onChange={(e) => setCustomAxis(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAxis();
                    }
                  }}
                />
                <Button onClick={handleAddAxis} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Themes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.commonThemes')}</CardTitle>
            <CardDescription>{t('common.commonThemesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme List */}
            {themes.length > 0 && (
              <div>
                <Label className="mb-2 block">
                  {t('common.themes')} ({themes.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme) => (
                    <Badge key={theme} variant="secondary" className="gap-1">
                      {theme}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveTheme(theme)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add Theme */}
            <div>
              <Label className="mb-2 block">{t('common.addTheme')}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('common.addThemePlaceholder')}
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTheme();
                    }
                  }}
                />
                <Button onClick={handleAddTheme} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('common.addThemeHint')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={`/${lng}`}>
            <Button variant="outline" disabled={isCreating}>
              {t('common.cancel')}
            </Button>
          </Link>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? t('common.creating') : t('common.createProject')}
          </Button>
        </div>
      </div>
    </div>
  );
}
