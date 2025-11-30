'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Plus,
    Trash2,
    Save,
    MessageSquare,
    ListChecks,
    CheckCircle2,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    HealthbenchExample,
    ChatTurn,
    RubricItem,
    AxisId,
} from '@/types/healthbench';

interface ExampleFormProps {
    initialData?: Partial<HealthbenchExample>;
    availableAxes: AxisId[];
    commonThemes: string[];
    onSave: (example: HealthbenchExample) => void;
    onCancel: () => void;
}

export function ExampleForm({
    initialData,
    availableAxes,
    commonThemes,
    onSave,
    onCancel,
}: ExampleFormProps) {
    const [id, setId] = useState(initialData?.id || uuidv4());
    const [themes, setThemes] = useState<string[]>(initialData?.theme || []);
    const [newTheme, setNewTheme] = useState('');
    const [prompt, setPrompt] = useState<ChatTurn[]>(
        initialData?.prompt || [{ role: 'patient', content: '' }]
    );
    const [rubrics, setRubrics] = useState<RubricItem[]>(
        initialData?.rubrics && initialData.rubrics.length > 0
            ? initialData.rubrics
            : [
                {
                    criterion_id: uuidv4(),
                    criterion: '',
                    axis: availableAxes[0] || 'accuracy',
                    points: 5,
                },
            ]
    );
    const [idealCompletion, setIdealCompletion] = useState<string>(
        initialData?.ideal_completions?.[0]?.content || ''
    );

    // --- Themes ---
    const addTheme = () => {
        if (newTheme && !themes.includes(newTheme)) {
            setThemes([...themes, newTheme]);
            setNewTheme('');
        }
    };

    const removeTheme = (theme: string) => {
        setThemes(themes.filter((t) => t !== theme));
    };

    // --- Prompt ---
    const addTurn = () => {
        setPrompt([...prompt, { role: 'assistant', content: '' }]);
    };

    const updateTurn = (index: number, field: keyof ChatTurn, value: string) => {
        const newPrompt = [...prompt];
        newPrompt[index] = { ...newPrompt[index], [field]: value };
        setPrompt(newPrompt);
    };

    const removeTurn = (index: number) => {
        setPrompt(prompt.filter((_, i) => i !== index));
    };

    // --- Rubrics ---
    const addRubric = () => {
        setRubrics([
            ...rubrics,
            {
                criterion_id: uuidv4(),
                criterion: '',
                axis: availableAxes[0] || 'accuracy',
                points: 5,
            },
        ]);
    };

    const updateRubric = (
        index: number,
        field: keyof RubricItem,
        value: any
    ) => {
        const newRubrics = [...rubrics];
        newRubrics[index] = { ...newRubrics[index], [field]: value };
        setRubrics(newRubrics);
    };

    const removeRubric = (index: number) => {
        setRubrics(rubrics.filter((_, i) => i !== index));
    };

    // --- Save ---
    const handleSave = () => {
        if (!id || prompt.length === 0) {
            alert('ID and Prompt are required');
            return;
        }

        const example: HealthbenchExample = {
            id,
            theme: themes,
            source: initialData?.source || 'manual',
            prompt,
            rubrics,
            ideal_completions: idealCompletion
                ? [
                    {
                        id: uuidv4(),
                        content: idealCompletion,
                        metadata: { type: 'ideal' },
                    },
                ]
                : [],
            metadata: {
                ...initialData?.metadata,
                updated_at: new Date().toISOString(),
            },
        };

        onSave(example);
    };

    return (
        <div className="space-y-8">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="id">Example ID</Label>
                        <div className="flex gap-2">
                            <Input
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="unique-id-123"
                            />
                            <Button
                                variant="outline"
                                onClick={() => setId(uuidv4())}
                                title="Generate New ID"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Themes</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {themes.map((theme) => (
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
                        <div className="flex gap-2">
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
                        {commonThemes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs text-muted-foreground mr-2">
                                    Suggested:
                                </span>
                                {commonThemes
                                    .filter((t) => !themes.includes(t))
                                    .map((t) => (
                                        <Badge
                                            key={t}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                if (!themes.includes(t)) setThemes([...themes, t]);
                                            }}
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Prompt / Chat */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Conversation Prompt
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {prompt.map((turn, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="w-32 flex-shrink-0">
                                <Select
                                    value={turn.role}
                                    onValueChange={(val) =>
                                        updateTurn(index, 'role', val as any)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="patient">Patient</SelectItem>
                                        <SelectItem value="assistant">Assistant</SelectItem>
                                        <SelectItem value="clinician">Clinician</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Textarea
                                value={turn.content}
                                onChange={(e) => updateTurn(index, 'content', e.target.value)}
                                placeholder="Enter message content..."
                                className="flex-1 min-h-[100px]"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeTurn(index)}
                                disabled={prompt.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addTurn} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Turn
                    </Button>
                </CardContent>
            </Card>

            {/* Ideal Completion */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Ideal Completion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={idealCompletion}
                        onChange={(e) => setIdealCompletion(e.target.value)}
                        placeholder="Enter the ideal response for this scenario..."
                        className="min-h-[150px]"
                    />
                </CardContent>
            </Card>

            {/* Rubrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5" />
                        Evaluation Rubrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rubrics.map((rubric, index) => (
                        <div key={rubric.criterion_id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="grid gap-4 flex-1 mr-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Axis</Label>
                                            <Select
                                                value={rubric.axis}
                                                onValueChange={(val) =>
                                                    updateRubric(index, 'axis', val)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableAxes.map((axis) => (
                                                        <SelectItem key={axis} value={axis}>
                                                            {axis}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Points</Label>
                                            <Input
                                                type="number"
                                                value={rubric.points}
                                                onChange={(e) =>
                                                    updateRubric(index, 'points', parseInt(e.target.value))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Criterion</Label>
                                        <Textarea
                                            value={rubric.criterion}
                                            onChange={(e) =>
                                                updateRubric(index, 'criterion', e.target.value)
                                            }
                                            placeholder="Describe the evaluation criterion..."
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeRubric(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addRubric} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Rubric
                    </Button>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4 sticky bottom-4 bg-background p-4 border-t shadow-lg rounded-lg">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Example
                </Button>
            </div>
        </div>
    );
}
