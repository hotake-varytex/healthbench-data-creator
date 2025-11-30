/**
 * Type definitions for HealthBench-compliant data structures
 *
 * These types map directly to the OpenAI HealthBench JSONL format.
 * Reference: https://github.com/openai/simple-evals/tree/main/healthcare_data
 */

// ============================================================================
// Chat / Prompt Types
// ============================================================================

/**
 * Roles in a multi-turn medical conversation
 * - patient: The patient describing symptoms or asking questions
 * - assistant: AI model responses
 * - clinician: Human medical professional
 * - system: System-level instructions
 */
export type ChatRole = 'patient' | 'assistant' | 'clinician' | 'system';

/**
 * A single turn in a conversation
 */
export interface ChatTurn {
  role: ChatRole;
  content: string;
}

// ============================================================================
// Ideal Completions
// ============================================================================

/**
 * An ideal/reference completion for the scenario
 * Used as a gold standard for model evaluation
 */
export interface IdealCompletion {
  id: string;
  content: string;
  metadata?: {
    author?: string;        // Who wrote this ideal completion
    notes?: string;         // Additional context
    [key: string]: unknown; // Allow custom metadata
  };
}

// ============================================================================
// Rubrics / Evaluation Criteria
// ============================================================================

/**
 * Standard evaluation axes from HealthBench
 * Extensible to allow custom axes per specialty
 */
export type AxisId =
  | 'accuracy'              // Medical accuracy of information
  | 'completeness'          // Thoroughness of response
  | 'context_awareness'     // Understanding of patient context
  | 'communication'         // Clarity and empathy
  | 'instruction_following' // Adherence to given instructions
  | 'safety'                // Avoidance of harmful advice
  | 'cultural_sensitivity'  // Cultural competence
  | string;                 // Allow custom axes

/**
 * A single rubric criterion for evaluation
 */
export interface RubricItem {
  criterion_id: string;  // Unique ID for this criterion
  criterion: string;     // Description of what is being evaluated
  axis: AxisId;          // Which evaluation dimension this belongs to
  points: number;        // Maximum points for this criterion
  metadata?: {
    consensus?: boolean; // Whether this criterion has consensus among evaluators
    notes?: string;      // Additional context for evaluators
    [key: string]: unknown;
  };
}

/**
 * Template for reusable rubric items
 */
export interface RubricTemplate {
  id: string;
  name: string;
  description: string;
  items: Omit<RubricItem, 'criterion_id'>[]; // IDs will be generated when used
  metadata?: {
    created_at?: string;
    created_by?: string;
    tags?: string[];
  };
}

// ============================================================================
// Example Metadata
// ============================================================================

/**
 * Difficulty levels for scenarios
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Metadata for a HealthBench example
 */
export interface ExampleMetadata {
  difficulty?: DifficultyLevel;
  language?: string;        // ISO 639-1 code (e.g., "en", "ja")
  specialty?: string;       // Medical specialty
  created_by?: string;      // Author
  created_at?: string;      // ISO8601 timestamp
  updated_at?: string;      // ISO8601 timestamp
  tags?: string[];          // Free-form tags
  version?: string;         // Data version
  [key: string]: unknown;   // Allow custom metadata
}

// ============================================================================
// Complete HealthBench Example
// ============================================================================

/**
 * A complete HealthBench example (one line in JSONL output)
 *
 * This represents a single scenario with:
 * - A multi-turn conversation prompt
 * - Evaluation rubrics
 * - Optional ideal completions
 * - Metadata for organization and analysis
 */
export interface HealthbenchExample {
  id: string;                           // Unique identifier
  theme: string[];                      // Categories/themes (e.g., ["diagnosis", "cardiology"])
  source: string;                       // Data source description
  prompt: ChatTurn[];                   // Multi-turn conversation
  ideal_completions?: IdealCompletion[]; // Reference answers
  rubrics: RubricItem[];                // Evaluation criteria
  metadata?: ExampleMetadata;           // Additional information
}

// ============================================================================
// Specialty Project Configuration
// ============================================================================

/**
 * Configuration for a specialty-specific project
 * (e.g., kampobench, cardiology, mental_health)
 */
export interface SpecialtyProject {
  name: string;                    // Project name (slug-friendly)
  displayName: string;             // Human-readable name
  description: string;             // Project description
  availableAxes: AxisId[];         // Evaluation axes to use
  commonThemes: string[];          // Predefined theme options
  rubricTemplates: RubricTemplate[]; // Reusable rubric templates
  examples: HealthbenchExample[];  // All scenarios in this project
  metadata: {
    created_at: string;
    updated_at: string;
    version: string;
    created_by?: string;
    language?: string;
  };
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  field: string;      // Field path (e.g., "rubrics[0].criterion_id")
  message: string;    // Human-readable error message
  severity: 'error' | 'warning'; // Error severity
}

/**
 * Result of validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Application-level storage structure
 */
export interface AppStorage {
  version: string;
  projects: SpecialtyProject[];
  settings: {
    defaultLanguage: string;
    defaultAuthor?: string;
    theme: 'light' | 'dark' | 'system';
  };
  lastModified: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid ChatRole
 */
export function isChatRole(value: unknown): value is ChatRole {
  return (
    typeof value === 'string' &&
    ['patient', 'assistant', 'clinician', 'system'].includes(value)
  );
}

/**
 * Type guard to check if a value is a valid DifficultyLevel
 */
export function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return typeof value === 'string' && ['easy', 'medium', 'hard'].includes(value);
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Partial HealthbenchExample for creating new examples
 */
export type NewHealthbenchExample = Omit<HealthbenchExample, 'id'> & {
  id?: string; // Optional during creation, will be generated if not provided
};

/**
 * Stats for a specialty project
 */
export interface ProjectStats {
  totalExamples: number;
  themeDistribution: Record<string, number>;
  difficultyDistribution: Record<DifficultyLevel, number>;
  axisDistribution: Record<string, number>;
  averageRubricsPerExample: number;
  averageTurnsPerPrompt: number;
  languageDistribution: Record<string, number>;
}
