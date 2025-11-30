/**
 * Statistics and analytics utilities for HealthBench data
 */

import type { SpecialtyProject, ProjectStats, DifficultyLevel, HealthbenchExample } from '@/types/healthbench';

/**
 * Calculate comprehensive statistics for a specialty project
 * @param project - Specialty project to analyze
 * @returns Project statistics
 */
export function calculateProjectStats(project: SpecialtyProject): ProjectStats {
  const examples = project.examples;

  // Initialize counters
  const themeDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<DifficultyLevel, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };
  const axisDistribution: Record<string, number> = {};
  const languageDistribution: Record<string, number> = {};

  let totalRubrics = 0;
  let totalTurns = 0;

  // Analyze each example
  examples.forEach((example) => {
    // Count themes
    example.theme.forEach((theme) => {
      themeDistribution[theme] = (themeDistribution[theme] || 0) + 1;
    });

    // Count difficulty
    const difficulty = example.metadata?.difficulty;
    if (difficulty && difficulty in difficultyDistribution) {
      difficultyDistribution[difficulty]++;
    }

    // Count axes from rubrics
    example.rubrics.forEach((rubric) => {
      axisDistribution[rubric.axis] = (axisDistribution[rubric.axis] || 0) + 1;
      totalRubrics++;
    });

    // Count prompt turns
    totalTurns += example.prompt.length;

    // Count languages
    const language = example.metadata?.language || 'unknown';
    languageDistribution[language] = (languageDistribution[language] || 0) + 1;
  });

  // Calculate averages
  const totalExamples = examples.length;
  const averageRubricsPerExample = totalExamples > 0 ? totalRubrics / totalExamples : 0;
  const averageTurnsPerPrompt = totalExamples > 0 ? totalTurns / totalExamples : 0;

  return {
    totalExamples,
    themeDistribution,
    difficultyDistribution,
    axisDistribution,
    averageRubricsPerExample: Math.round(averageRubricsPerExample * 10) / 10, // 1 decimal place
    averageTurnsPerPrompt: Math.round(averageTurnsPerPrompt * 10) / 10,
    languageDistribution,
  };
}

/**
 * Get summary statistics for a single example
 * @param example - HealthBench example
 * @returns Summary object
 */
export function getExampleSummary(example: HealthbenchExample): {
  rubricCount: number;
  totalPoints: number;
  turnCount: number;
  hasIdealCompletions: boolean;
  axesUsed: string[];
  wordCount: number;
} {
  const rubricCount = example.rubrics.length;
  const totalPoints = example.rubrics.reduce((sum, r) => sum + r.points, 0);
  const turnCount = example.prompt.length;
  const hasIdealCompletions = Boolean(example.ideal_completions && example.ideal_completions.length > 0);
  const axesUsed = [...new Set(example.rubrics.map((r) => r.axis))];

  // Calculate approximate word count from prompt
  const wordCount = example.prompt.reduce((sum, turn) => {
    return sum + turn.content.split(/\s+/).length;
  }, 0);

  return {
    rubricCount,
    totalPoints,
    turnCount,
    hasIdealCompletions,
    axesUsed,
    wordCount,
  };
}

/**
 * Find examples missing critical data
 * @param examples - Array of examples to check
 * @returns Examples with issues
 */
export function findIncompleteExamples(examples: HealthbenchExample[]): {
  example: HealthbenchExample;
  issues: string[];
}[] {
  const incomplete: { example: HealthbenchExample; issues: string[] }[] = [];

  examples.forEach((example) => {
    const issues: string[] = [];

    if (!example.ideal_completions || example.ideal_completions.length === 0) {
      issues.push('No ideal completions');
    }

    if (example.rubrics.length < 3) {
      issues.push('Less than 3 rubrics');
    }

    if (example.prompt.length < 2) {
      issues.push('Less than 2 chat turns');
    }

    if (!example.metadata?.difficulty) {
      issues.push('No difficulty level set');
    }

    if (example.theme.length === 0) {
      issues.push('No themes assigned');
    }

    const totalPoints = example.rubrics.reduce((sum, r) => sum + r.points, 0);
    if (totalPoints < 5) {
      issues.push('Total rubric points very low');
    }

    if (issues.length > 0) {
      incomplete.push({ example, issues });
    }
  });

  return incomplete;
}

/**
 * Compare two projects statistically
 * @param project1 - First project
 * @param project2 - Second project
 * @returns Comparison object
 */
export function compareProjects(
  project1: SpecialtyProject,
  project2: SpecialtyProject
): {
  name1: string;
  name2: string;
  stats1: ProjectStats;
  stats2: ProjectStats;
  differences: {
    exampleCountDiff: number;
    commonThemes: string[];
    commonAxes: string[];
    uniqueThemes1: string[];
    uniqueThemes2: string[];
  };
} {
  const stats1 = calculateProjectStats(project1);
  const stats2 = calculateProjectStats(project2);

  const themes1 = new Set(Object.keys(stats1.themeDistribution));
  const themes2 = new Set(Object.keys(stats2.themeDistribution));
  const axes1 = new Set(Object.keys(stats1.axisDistribution));
  const axes2 = new Set(Object.keys(stats2.axisDistribution));

  const commonThemes = [...themes1].filter((t) => themes2.has(t));
  const commonAxes = [...axes1].filter((a) => axes2.has(a));
  const uniqueThemes1 = [...themes1].filter((t) => !themes2.has(t));
  const uniqueThemes2 = [...themes2].filter((t) => !themes1.has(t));

  return {
    name1: project1.displayName,
    name2: project2.displayName,
    stats1,
    stats2,
    differences: {
      exampleCountDiff: stats1.totalExamples - stats2.totalExamples,
      commonThemes,
      commonAxes,
      uniqueThemes1,
      uniqueThemes2,
    },
  };
}

/**
 * Get chart data for theme distribution
 * @param stats - Project statistics
 * @returns Array suitable for recharts
 */
export function getThemeChartData(stats: ProjectStats): Array<{ name: string; count: number }> {
  return Object.entries(stats.themeDistribution)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 themes
}

/**
 * Get chart data for difficulty distribution
 * @param stats - Project statistics
 * @returns Array suitable for recharts
 */
export function getDifficultyChartData(stats: ProjectStats): Array<{ name: string; count: number }> {
  return [
    { name: 'Easy', count: stats.difficultyDistribution.easy },
    { name: 'Medium', count: stats.difficultyDistribution.medium },
    { name: 'Hard', count: stats.difficultyDistribution.hard },
  ];
}

/**
 * Get chart data for axis distribution
 * @param stats - Project statistics
 * @returns Array suitable for recharts
 */
export function getAxisChartData(stats: ProjectStats): Array<{ name: string; count: number }> {
  return Object.entries(stats.axisDistribution)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate data quality score (0-100)
 * @param project - Specialty project
 * @returns Quality score and breakdown
 */
export function calculateQualityScore(project: SpecialtyProject): {
  score: number;
  breakdown: {
    completeness: number;
    consistency: number;
    richness: number;
  };
} {
  const examples = project.examples;
  if (examples.length === 0) {
    return { score: 0, breakdown: { completeness: 0, consistency: 0, richness: 0 } };
  }

  // Completeness: Examples have all recommended fields
  let completenessScore = 0;
  examples.forEach((example) => {
    let exampleScore = 0;
    if (example.ideal_completions && example.ideal_completions.length > 0) exampleScore += 20;
    if (example.metadata?.difficulty) exampleScore += 20;
    if (example.theme.length > 0) exampleScore += 20;
    if (example.rubrics.length >= 3) exampleScore += 20;
    if (example.prompt.length >= 2) exampleScore += 20;
    completenessScore += exampleScore;
  });
  completenessScore = completenessScore / examples.length;

  // Consistency: Examples follow similar patterns
  const rubricsPerExample = examples.map((e) => e.rubrics.length);
  const avgRubrics = rubricsPerExample.reduce((a, b) => a + b, 0) / rubricsPerExample.length;
  const rubricVariance =
    rubricsPerExample.reduce((sum, count) => sum + Math.pow(count - avgRubrics, 2), 0) /
    rubricsPerExample.length;
  const consistencyScore = Math.max(0, 100 - rubricVariance * 10);

  // Richness: Variety in themes, axes, difficulty
  const stats = calculateProjectStats(project);
  const themeVariety = Object.keys(stats.themeDistribution).length;
  const axisVariety = Object.keys(stats.axisDistribution).length;
  const difficultyVariety =
    (stats.difficultyDistribution.easy > 0 ? 1 : 0) +
    (stats.difficultyDistribution.medium > 0 ? 1 : 0) +
    (stats.difficultyDistribution.hard > 0 ? 1 : 0);
  const richnessScore = Math.min(100, (themeVariety * 10 + axisVariety * 10 + difficultyVariety * 10));

  const score = Math.round((completenessScore + consistencyScore + richnessScore) / 3);

  return {
    score,
    breakdown: {
      completeness: Math.round(completenessScore),
      consistency: Math.round(consistencyScore),
      richness: Math.round(richnessScore),
    },
  };
}
