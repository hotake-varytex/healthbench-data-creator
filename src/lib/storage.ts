/**
 * Browser localStorage wrapper for persisting application state
 *
 * Provides type-safe storage with versioning and migration support
 */

import type { AppStorage, SpecialtyProject } from '@/types/healthbench';
import { safeJsonParse, isBrowser } from './utils';
import { validateSpecialtyProject } from './validation';
import sampleData from './sample-data.json';
import { convertToInternal, OpenAIHealthBenchExample } from './adapters/healthbench';

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'healthbench-data-creator';
const STORAGE_VERSION = '1.0.0';

// ============================================================================
// Default State
// ============================================================================

/**
 * Get default application storage
 */
function getDefaultStorage(): AppStorage {
  // Process sample data
  const sampleExamples = (sampleData as unknown as OpenAIHealthBenchExample[]).map(convertToInternal);

  // Extract themes
  const themes = new Set<string>();
  sampleExamples.forEach(ex => ex.theme.forEach(t => themes.add(t)));

  // Extract axes
  const axes = new Set<string>();
  sampleExamples.forEach(ex => ex.rubrics.forEach(r => axes.add(r.axis)));

  const sampleProject: SpecialtyProject = {
    name: 'sample-project',
    displayName: 'Sample Project',
    description: 'A sample project with HealthBench data.',
    availableAxes: Array.from(axes),
    commonThemes: Array.from(themes),
    rubricTemplates: [],
    examples: sampleExamples,
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  return {
    version: STORAGE_VERSION,
    projects: [sampleProject],
    settings: {
      defaultLanguage: 'en',
      defaultAuthor: undefined,
      theme: 'system',
    },
    lastModified: new Date().toISOString(),
  };
}

// ============================================================================
// Storage Operations
// ============================================================================

/**
 * Load application state from localStorage
 * @returns Application storage or default state if not found
 */
export function loadStorage(): AppStorage {
  if (!isBrowser()) {
    return getDefaultStorage();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultStorage();
    }

    const parsed = safeJsonParse<AppStorage>(stored, getDefaultStorage());

    // Version migration (if needed in the future)
    if (parsed.version !== STORAGE_VERSION) {
      return migrateStorage(parsed);
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load storage:', error);
    return getDefaultStorage();
  }
}

/**
 * Save application state to localStorage
 * @param storage - Application storage to save
 */
export function saveStorage(storage: AppStorage): void {
  if (!isBrowser()) {
    return;
  }

  try {
    storage.lastModified = new Date().toISOString();
    const serialized = JSON.stringify(storage);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save storage:', error);
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please export your data and clear some projects.');
    }
  }
}

/**
 * Clear all application data from localStorage
 */
export function clearStorage(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Migrate storage from old version to current version
 * @param oldStorage - Old storage structure
 * @returns Migrated storage
 */
function migrateStorage(_oldStorage: any): AppStorage {
  // For now, just return default storage
  // In the future, implement version-specific migrations
  console.warn('Storage version mismatch, resetting to default');
  return getDefaultStorage();
}

// ============================================================================
// Project Operations
// ============================================================================

/**
 * Get all specialty projects
 * @returns Array of specialty projects
 */
export function getProjects(): SpecialtyProject[] {
  const storage = loadStorage();
  return storage.projects;
}

/**
 * Get a specific project by name
 * @param name - Project name
 * @returns Project or undefined if not found
 */
export function getProject(name: string): SpecialtyProject | undefined {
  const storage = loadStorage();
  return storage.projects.find((p) => p.name === name);
}

/**
 * Save or update a project
 * @param project - Project to save
 * @returns Success status
 */
export function saveProject(project: SpecialtyProject): boolean {
  try {
    // Validate project before saving
    const validation = validateSpecialtyProject(project);
    if (!validation.isValid) {
      console.error('Invalid project:', validation.errors);
      return false;
    }

    const storage = loadStorage();
    const existingIndex = storage.projects.findIndex((p) => p.name === project.name);

    if (existingIndex >= 0) {
      // Update existing project
      storage.projects[existingIndex] = {
        ...project,
        metadata: {
          ...project.metadata,
          updated_at: new Date().toISOString(),
        },
      };
    } else {
      // Add new project
      storage.projects.push(project);
    }

    saveStorage(storage);
    return true;
  } catch (error) {
    console.error('Failed to save project:', error);
    return false;
  }
}

/**
 * Delete a project
 * @param name - Project name
 * @returns Success status
 */
export function deleteProject(name: string): boolean {
  try {
    const storage = loadStorage();
    storage.projects = storage.projects.filter((p) => p.name !== name);
    saveStorage(storage);
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

/**
 * Check if a project name already exists
 * @param name - Project name to check
 * @returns True if name exists
 */
export function projectExists(name: string): boolean {
  const storage = loadStorage();
  return storage.projects.some((p) => p.name === name);
}

/**
 * Rename a project
 * @param oldName - Current project name
 * @param newName - New project name
 * @returns Success status
 */
export function renameProject(oldName: string, newName: string): boolean {
  try {
    if (projectExists(newName)) {
      console.error('Project with new name already exists');
      return false;
    }

    const storage = loadStorage();
    const project = storage.projects.find((p) => p.name === oldName);
    if (!project) {
      console.error('Project not found');
      return false;
    }

    project.name = newName;
    project.metadata.updated_at = new Date().toISOString();
    saveStorage(storage);
    return true;
  } catch (error) {
    console.error('Failed to rename project:', error);
    return false;
  }
}

// ============================================================================
// Settings Operations
// ============================================================================

/**
 * Get application settings
 * @returns Current settings
 */
export function getSettings() {
  const storage = loadStorage();
  return storage.settings;
}

/**
 * Update application settings
 * @param settings - Partial settings to update
 */
export function updateSettings(settings: Partial<AppStorage['settings']>): void {
  const storage = loadStorage();
  storage.settings = { ...storage.settings, ...settings };
  saveStorage(storage);
}

// ============================================================================
// Import/Export Operations
// ============================================================================

/**
 * Export all data as JSON string
 * @returns JSON string of all application data
 */
export function exportAllData(): string {
  const storage = loadStorage();
  return JSON.stringify(storage, null, 2);
}

/**
 * Import data from JSON string
 * @param jsonString - JSON string of application data
 * @param merge - Whether to merge with existing data (default: false)
 * @returns Success status
 */
export function importAllData(jsonString: string, merge: boolean = false): boolean {
  try {
    const imported = JSON.parse(jsonString) as AppStorage;

    if (merge) {
      const existing = loadStorage();
      // Merge projects (avoid duplicates by name)
      const existingNames = new Set(existing.projects.map((p) => p.name));
      const newProjects = imported.projects.filter((p) => !existingNames.has(p.name));
      existing.projects.push(...newProjects);
      saveStorage(existing);
    } else {
      // Replace all data
      saveStorage(imported);
    }

    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get storage statistics
 * @returns Storage usage information
 */
export function getStorageStats(): {
  totalProjects: number;
  totalExamples: number;
  storageSize: number; // bytes
  lastModified: string;
} {
  const storage = loadStorage();
  const totalExamples = storage.projects.reduce((sum, p) => sum + p.examples.length, 0);

  // Estimate storage size
  let storageSize = 0;
  if (isBrowser()) {
    const stored = localStorage.getItem(STORAGE_KEY);
    storageSize = stored ? new Blob([stored]).size : 0;
  }

  return {
    totalProjects: storage.projects.length,
    totalExamples,
    storageSize,
    lastModified: storage.lastModified,
  };
}

/**
 * Check if storage is available
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
