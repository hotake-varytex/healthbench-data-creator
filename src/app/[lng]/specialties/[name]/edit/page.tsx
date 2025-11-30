'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProject, saveProject } from '@/lib/storage';
import { useTranslation } from '@/app/i18n/client';
import type { AxisId } from '@/types/healthbench';

const DEFAULT_AXES: AxisId[] = [
    'accuracy',
    'completeness',
    'context_awareness',
    'communication',
    'instruction_following',
    'safety',
    'cultural_sensitivity',
];

export default function EditConfigurationPage({
    params: { lng },
}: {
    params: { lng: string };
}) {
    const params = useParams();
    const router = useRouter();
    const projectName = params.name as string;

    const [project] = useState(getProject(projectName));
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [availableAxes, setAvailableAxes] = useState<AxisId[]>([]);
    const [commonThemes, setCommonThemes] = useState<string[]>([]);
    const [newTheme, setNewTheme] = useState('');
    const [newAxis, setNewAxis] = useState('');

    useEffect(() => {
        if (project) {
            setDisplayName(project.displayName);
            setDescription(project.description);
            setAvailableAxes(project.availableAxes);
            setCommonThemes(project.commonThemes);
        }
    }, [project]);

    if (!project) {
        return <div>Project not found</div>;
    }

    // --- Themes ---
    const addTheme = () => {
        if (newTheme && !commonThemes.includes(newTheme)) {
            setCommonThemes([...commonThemes, newTheme]);
            setNewTheme('');
        }
    };

    const removeTheme = (theme: string) => {
        setCommonThemes(commonThemes.filter((t) => t !== theme));
    };

    // --- Axes ---
    const toggleAxis = (axis: AxisId) => {
        if (availableAxes.includes(axis)) {
            setAvailableAxes(availableAxes.filter((a) => a !== axis));
        } else {
            setAvailableAxes([...availableAxes, axis]);
        }
    };

    const addCustomAxis = () => {
        if (newAxis && !availableAxes.includes(newAxis)) {
            setAvailableAxes([...availableAxes, newAxis]);
            setNewAxis('');
        }
    };

    // --- Save ---
    const handleSave = () => {
        if (!displayName) {
            alert('Display Name is required');
            return;
        }

        const updatedProject = {
            ...project,
            displayName,
            description,
            availableAxes,
            commonThemes,
            metadata: {
                ...project.metadata,
                updated_at: new Date().toISOString(),
            },
        };

        if (saveProject(updatedProject)) {
            router.push(`/${lng}/specialties/${projectName}`);
        } else {
            alert('Failed to save configuration');
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
                <h1 className="text-3xl font-bold">Edit Configuration</h1>
                <p className="text-muted-foreground">
                    Configure settings for {project.name}
                </p>
            </div>

            <div className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Evaluation Axes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Evaluation Axes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2 block">Standard Axes</Label>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_AXES.map((axis) => (
                                    <Badge
                                        key={axis}
                                        variant={availableAxes.includes(axis) ? 'default' : 'outline'}
                                        className="cursor-pointer hover:bg-primary/90"
                                        onClick={() => toggleAxis(axis)}
                                    >
                                        {axis.replace(/_/g, ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label className="mb-2 block">Custom Axes</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {availableAxes
                                    .filter((axis) => !DEFAULT_AXES.includes(axis))
                                    .map((axis) => (
                                        <Badge key={axis} variant="secondary">
                                            {axis}
                                            <button
                                                onClick={() => toggleAxis(axis)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                                <Input
                                    value={newAxis}
                                    onChange={(e) => setNewAxis(e.target.value)}
                                    placeholder="Add custom axis..."
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomAxis()}
                                />
                                <Button variant="outline" onClick={addCustomAxis}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Common Themes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Common Themes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {commonThemes.map((theme) => (
                                <Badge key={theme} variant="secondary">
                                    {theme}
                                    <button
                                        onClick={() => removeTheme(theme)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                            <Input
                                value={newTheme}
                                onChange={(e) => setNewTheme(e.target.value)}
                                placeholder="Add a theme..."
                                onKeyDown={(e) => e.key === 'Enter' && addTheme()}
                            />
                            <Button variant="outline" onClick={addTheme}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4 sticky bottom-4 bg-background p-4 border-t shadow-lg rounded-lg">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
}
