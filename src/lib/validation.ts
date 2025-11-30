/**
 * Validation schemas and functions using Zod
 *
 * These schemas provide runtime validation for HealthBench data structures
 */

import { z } from 'zod';
import type {
  HealthbenchExample,
  ValidationError,
  ValidationResult,
} from '@/types/healthbench';

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Chat role schema
 */
export const chatRoleSchema = z.enum(['patient', 'assistant', 'clinician', 'system']);

/**
 * Chat turn schema
 */
export const chatTurnSchema = z.object({
  role: chatRoleSchema,
  content: z.string().min(1, 'Content cannot be empty'),
});

/**
 * Ideal completion schema
 */
export const idealCompletionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  content: z.string().min(1, 'Content cannot be empty'),
  metadata: z
    .object({
      author: z.string().optional(),
      notes: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

/**
 * Axis ID schema (standard axes + custom)
 */
export const axisIdSchema = z.string().min(1, 'Axis ID cannot be empty');

/**
 * Rubric item schema
 */
export const rubricItemSchema = z.object({
  criterion_id: z.string().min(1, 'Criterion ID is required'),
  criterion: z.string().min(1, 'Criterion description is required'),
  axis: axisIdSchema,
  points: z.number().min(0, 'Points must be non-negative'),
  metadata: z
    .object({
      consensus: z.boolean().optional(),
      notes: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

/**
 * Difficulty level schema
 */
export const difficultyLevelSchema = z.enum(['easy', 'medium', 'hard']);

/**
 * Example metadata schema
 */
export const exampleMetadataSchema = z
  .object({
    difficulty: difficultyLevelSchema.optional(),
    language: z.string().optional(),
    specialty: z.string().optional(),
    created_by: z.string().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    tags: z.array(z.string()).optional(),
    version: z.string().optional(),
  })
  .passthrough();

/**
 * HealthBench example schema
 */
export const healthbenchExampleSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  theme: z.array(z.string().min(1)).min(1, 'At least one theme is required'),
  source: z.string().min(1, 'Source is required'),
  prompt: z.array(chatTurnSchema).min(1, 'At least one chat turn is required'),
  ideal_completions: z.array(idealCompletionSchema).optional(),
  rubrics: z.array(rubricItemSchema).min(1, 'At least one rubric is required'),
  metadata: exampleMetadataSchema.optional(),
});

/**
 * Rubric template schema
 */
export const rubricTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required'),
  description: z.string(),
  items: z.array(rubricItemSchema.omit({ criterion_id: true })),
  metadata: z
    .object({
      created_at: z.string().datetime().optional(),
      created_by: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Specialty project schema
 */
export const specialtyProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string(),
  availableAxes: z.array(axisIdSchema).min(1, 'At least one axis is required'),
  commonThemes: z.array(z.string()),
  rubricTemplates: z.array(rubricTemplateSchema),
  examples: z.array(healthbenchExampleSchema),
  metadata: z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    version: z.string(),
    created_by: z.string().optional(),
    language: z.string().optional(),
  }),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a HealthBench example
 * @param example - Example to validate
 * @returns Validation result with errors and warnings
 */
export function validateHealthbenchExample(example: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Schema validation
  const result = healthbenchExampleSchema.safeParse(example);
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.push({
        field: err.path.join('.'),
        message: err.message,
        severity: 'error',
      });
    });
    return { isValid: false, errors, warnings };
  }

  const validatedExample = result.data;

  // Additional business logic validations

  // 1. Check for duplicate criterion IDs
  const criterionIds = new Set<string>();
  validatedExample.rubrics.forEach((rubric, index) => {
    if (criterionIds.has(rubric.criterion_id)) {
      errors.push({
        field: `rubrics[${index}].criterion_id`,
        message: `Duplicate criterion ID: ${rubric.criterion_id}`,
        severity: 'error',
      });
    }
    criterionIds.add(rubric.criterion_id);
  });

  // 2. Warn if no ideal completions
  if (!validatedExample.ideal_completions || validatedExample.ideal_completions.length === 0) {
    warnings.push({
      field: 'ideal_completions',
      message: 'No ideal completions provided (recommended for evaluation)',
      severity: 'warning',
    });
  }

  // 3. Check for duplicate ideal completion IDs
  if (validatedExample.ideal_completions) {
    const completionIds = new Set<string>();
    validatedExample.ideal_completions.forEach((completion, index) => {
      if (completionIds.has(completion.id)) {
        errors.push({
          field: `ideal_completions[${index}].id`,
          message: `Duplicate ideal completion ID: ${completion.id}`,
          severity: 'error',
        });
      }
      completionIds.add(completion.id);
    });
  }

  // 4. Warn if prompt has only one turn
  if (validatedExample.prompt.length === 1) {
    warnings.push({
      field: 'prompt',
      message: 'Only one chat turn in prompt (multi-turn conversations are typical)',
      severity: 'warning',
    });
  }

  // 5. Warn if total rubric points is very low or very high
  const totalPoints = validatedExample.rubrics.reduce((sum, r) => sum + r.points, 0);
  if (totalPoints < 5) {
    warnings.push({
      field: 'rubrics',
      message: `Total points (${totalPoints}) seems low for a complete evaluation`,
      severity: 'warning',
    });
  }
  if (totalPoints > 100) {
    warnings.push({
      field: 'rubrics',
      message: `Total points (${totalPoints}) seems unusually high`,
      severity: 'warning',
    });
  }

  // 6. Warn if no metadata
  if (!validatedExample.metadata) {
    warnings.push({
      field: 'metadata',
      message: 'No metadata provided (recommended for organization)',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a specialty project
 * @param project - Project to validate
 * @returns Validation result with errors and warnings
 */
export function validateSpecialtyProject(project: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Schema validation
  const result = specialtyProjectSchema.safeParse(project);
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.push({
        field: err.path.join('.'),
        message: err.message,
        severity: 'error',
      });
    });
    return { isValid: false, errors, warnings };
  }

  const validatedProject = result.data;

  // Additional validations

  // 1. Check for duplicate example IDs
  const exampleIds = new Set<string>();
  validatedProject.examples.forEach((example, index) => {
    if (exampleIds.has(example.id)) {
      errors.push({
        field: `examples[${index}].id`,
        message: `Duplicate example ID: ${example.id}`,
        severity: 'error',
      });
    }
    exampleIds.add(example.id);
  });

  // 2. Validate each example
  validatedProject.examples.forEach((example, index) => {
    const exampleValidation = validateHealthbenchExample(example);
    exampleValidation.errors.forEach((err) => {
      errors.push({
        field: `examples[${index}].${err.field}`,
        message: err.message,
        severity: err.severity,
      });
    });
    exampleValidation.warnings.forEach((warn) => {
      warnings.push({
        field: `examples[${index}].${warn.field}`,
        message: warn.message,
        severity: warn.severity,
      });
    });
  });

  // 3. Check if examples use axes not in availableAxes
  const availableAxesSet = new Set(validatedProject.availableAxes);
  validatedProject.examples.forEach((example, exampleIndex) => {
    example.rubrics.forEach((rubric, rubricIndex) => {
      if (!availableAxesSet.has(rubric.axis)) {
        warnings.push({
          field: `examples[${exampleIndex}].rubrics[${rubricIndex}].axis`,
          message: `Axis "${rubric.axis}" is not in the project's availableAxes`,
          severity: 'warning',
        });
      }
    });
  });

  // 4. Warn if no examples
  if (validatedProject.examples.length === 0) {
    warnings.push({
      field: 'examples',
      message: 'Project has no examples',
      severity: 'warning',
    });
  }

  // 5. Check for duplicate template IDs
  const templateIds = new Set<string>();
  validatedProject.rubricTemplates.forEach((template, index) => {
    if (templateIds.has(template.id)) {
      errors.push({
        field: `rubricTemplates[${index}].id`,
        message: `Duplicate template ID: ${template.id}`,
        severity: 'error',
      });
    }
    templateIds.add(template.id);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Quick validation - just check if basic structure is valid
 * @param data - Data to validate
 * @param schema - Zod schema to use
 * @returns True if valid, false otherwise
 */
export function quickValidate<T>(data: unknown, schema: z.ZodSchema<T>): boolean {
  return schema.safeParse(data).success;
}

/**
 * Get user-friendly error messages from Zod errors
 * @param error - Zod error object
 * @returns Array of readable error messages
 */
export function formatZodErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
}

/**
 * Validate array of examples and return valid ones with errors
 * @param examples - Examples to validate
 * @returns Object with valid examples and errors
 */
export function validateExampleBatch(examples: unknown[]): {
  valid: HealthbenchExample[];
  invalid: Array<{ index: number; example: unknown; errors: ValidationError[] }>;
} {
  const valid: HealthbenchExample[] = [];
  const invalid: Array<{ index: number; example: unknown; errors: ValidationError[] }> = [];

  examples.forEach((example, index) => {
    const result = validateHealthbenchExample(example);
    if (result.isValid) {
      valid.push(example as HealthbenchExample);
    } else {
      invalid.push({
        index,
        example,
        errors: result.errors,
      });
    }
  });

  return { valid, invalid };
}
