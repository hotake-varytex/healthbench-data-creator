/**
 * JSONL (JSON Lines) parsing and generation utilities
 *
 * JSONL format: One JSON object per line, newline-delimited
 * Used by HealthBench for dataset storage
 */

import type { HealthbenchExample } from '@/types/healthbench';

/**
 * Parse JSONL string into an array of HealthBench examples
 * @param jsonlString - Raw JSONL content
 * @returns Array of parsed examples with errors for invalid lines
 */
export function parseJsonl(jsonlString: string): {
  examples: HealthbenchExample[];
  errors: Array<{ line: number; error: string; raw: string }>;
} {
  const lines = jsonlString.split('\n').filter((line) => line.trim() !== '');
  const examples: HealthbenchExample[] = [];
  const errors: Array<{ line: number; error: string; raw: string }> = [];

  lines.forEach((line, index) => {
    try {
      const parsed = JSON.parse(line);
      // Basic validation - check for required fields
      if (!parsed.id || !parsed.theme || !parsed.source || !parsed.prompt || !parsed.rubrics) {
        errors.push({
          line: index + 1,
          error: 'Missing required fields (id, theme, source, prompt, or rubrics)',
          raw: line,
        });
      } else {
        examples.push(parsed as HealthbenchExample);
      }
    } catch (error) {
      errors.push({
        line: index + 1,
        error: error instanceof Error ? error.message : 'Invalid JSON',
        raw: line,
      });
    }
  });

  return { examples, errors };
}

/**
 * Convert an array of HealthBench examples to JSONL string
 * @param examples - Array of HealthBench examples
 * @param pretty - Whether to pretty-print each JSON object (default: false)
 * @returns JSONL string
 */
export function toJsonl(examples: HealthbenchExample[], pretty: boolean = false): string {
  return examples
    .map((example) => {
      if (pretty) {
        return JSON.stringify(example, null, 2);
      }
      return JSON.stringify(example);
    })
    .join('\n');
}

/**
 * Parse a single JSON line
 * @param line - Single JSON line
 * @returns Parsed example or null if invalid
 */
export function parseSingleLine(line: string): HealthbenchExample | null {
  try {
    const parsed = JSON.parse(line);
    // Basic validation
    if (!parsed.id || !parsed.theme || !parsed.source || !parsed.prompt || !parsed.rubrics) {
      return null;
    }
    return parsed as HealthbenchExample;
  } catch {
    return null;
  }
}

/**
 * Validate JSONL structure without parsing content
 * @param jsonlString - Raw JSONL content
 * @returns Validation result
 */
export function validateJsonlStructure(jsonlString: string): {
  isValid: boolean;
  lineCount: number;
  errors: Array<{ line: number; error: string }>;
} {
  const lines = jsonlString.split('\n').filter((line) => line.trim() !== '');
  const errors: Array<{ line: number; error: string }> = [];

  lines.forEach((line, index) => {
    try {
      JSON.parse(line);
    } catch (error) {
      errors.push({
        line: index + 1,
        error: error instanceof Error ? error.message : 'Invalid JSON',
      });
    }
  });

  return {
    isValid: errors.length === 0,
    lineCount: lines.length,
    errors,
  };
}

/**
 * Merge multiple JSONL strings
 * @param jsonlStrings - Array of JSONL strings
 * @param removeDuplicates - Whether to remove duplicate IDs (default: true)
 * @returns Merged JSONL string
 */
export function mergeJsonl(jsonlStrings: string[], removeDuplicates: boolean = true): string {
  const allExamples: HealthbenchExample[] = [];
  const seenIds = new Set<string>();

  jsonlStrings.forEach((jsonlString) => {
    const { examples } = parseJsonl(jsonlString);
    examples.forEach((example) => {
      if (removeDuplicates) {
        if (!seenIds.has(example.id)) {
          seenIds.add(example.id);
          allExamples.push(example);
        }
      } else {
        allExamples.push(example);
      }
    });
  });

  return toJsonl(allExamples);
}

/**
 * Split JSONL by a field value (e.g., by theme or difficulty)
 * @param jsonlString - Raw JSONL content
 * @param field - Field to split by (must be a string field)
 * @returns Map of field value to JSONL string
 */
export function splitJsonlByField(
  jsonlString: string,
  field: keyof HealthbenchExample | string
): Map<string, string> {
  const { examples } = parseJsonl(jsonlString);
  const splitMap = new Map<string, HealthbenchExample[]>();

  examples.forEach((example) => {
    // Handle nested fields (e.g., "metadata.difficulty")
    const value = getNestedValue(example, field);
    const key = value !== undefined ? String(value) : 'undefined';

    if (!splitMap.has(key)) {
      splitMap.set(key, []);
    }
    splitMap.get(key)!.push(example);
  });

  // Convert to JSONL strings
  const result = new Map<string, string>();
  splitMap.forEach((examples, key) => {
    result.set(key, toJsonl(examples));
  });

  return result;
}

/**
 * Get nested value from object by dot-notation path
 * @param obj - Object to get value from
 * @param path - Dot-notation path (e.g., "metadata.difficulty")
 * @returns Value or undefined
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Filter JSONL examples by a predicate function
 * @param jsonlString - Raw JSONL content
 * @param predicate - Function to test each example
 * @returns Filtered JSONL string
 */
export function filterJsonl(
  jsonlString: string,
  predicate: (example: HealthbenchExample) => boolean
): string {
  const { examples } = parseJsonl(jsonlString);
  const filtered = examples.filter(predicate);
  return toJsonl(filtered);
}

/**
 * Get statistics about a JSONL file
 * @param jsonlString - Raw JSONL content
 * @returns Statistics object
 */
export function getJsonlStats(jsonlString: string): {
  totalExamples: number;
  totalLines: number;
  parseErrors: number;
  averageLineLength: number;
  totalCharacters: number;
} {
  const lines = jsonlString.split('\n').filter((line) => line.trim() !== '');
  const { examples, errors } = parseJsonl(jsonlString);

  const totalCharacters = jsonlString.length;
  const averageLineLength = lines.length > 0 ? totalCharacters / lines.length : 0;

  return {
    totalExamples: examples.length,
    totalLines: lines.length,
    parseErrors: errors.length,
    averageLineLength: Math.round(averageLineLength),
    totalCharacters,
  };
}

/**
 * Format JSONL for better readability (pretty-print)
 * @param jsonlString - Raw JSONL content
 * @returns Pretty-printed JSONL string
 */
export function prettifyJsonl(jsonlString: string): string {
  const { examples } = parseJsonl(jsonlString);
  return toJsonl(examples, true);
}

/**
 * Minify JSONL (remove all unnecessary whitespace)
 * @param jsonlString - Raw JSONL content
 * @returns Minified JSONL string
 */
export function minifyJsonl(jsonlString: string): string {
  const { examples } = parseJsonl(jsonlString);
  return toJsonl(examples, false);
}
