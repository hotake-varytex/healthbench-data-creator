# Roadmap

This document outlines the planned features and improvements for HealthBench Data Creator.

## Current Version: 0.1.0 (MVP)

### Completed Features ✅

- [x] Project structure with Next.js 15 + TypeScript
- [x] Core type definitions for HealthBench data model
- [x] JSONL parsing and generation utilities
- [x] Zod-based validation schemas
- [x] localStorage-based persistence
- [x] Basic UI with shadcn/ui components
- [x] Main dashboard and project listing
- [x] OSS project files (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)

## Phase 1: MVP Completion (v0.1.0 - v0.2.0)

**Goal**: Basic data creation and editing functionality

### High Priority

- [ ] **Specialty Project Management**
  - [ ] Create new specialty projects
  - [ ] Edit project configuration (axes, themes, templates)
  - [ ] Delete projects with confirmation
  - [ ] Rename projects

- [ ] **Example Editor**
  - [ ] Create new examples
  - [ ] Edit existing examples
  - [ ] Delete examples
  - [ ] Basic form with all fields (id, theme, source, metadata)

- [ ] **Prompt/Chat Editor**
  - [ ] Add/remove chat turns
  - [ ] Role selection (patient/assistant/clinician/system)
  - [ ] Multi-line text input for content
  - [ ] Reorder turns (drag & drop)

- [ ] **Rubric Editor**
  - [ ] Add/remove rubric items
  - [ ] Criterion description input
  - [ ] Axis selection from project configuration
  - [ ] Points input (numeric)
  - [ ] Metadata (consensus, notes)

- [ ] **JSONL Import/Export**
  - [ ] Export individual projects as JSONL
  - [ ] Export selected examples
  - [ ] Import JSONL files
  - [ ] Merge vs replace options

- [ ] **Validation UI**
  - [ ] Real-time validation errors display
  - [ ] Validation warnings display
  - [ ] Pre-export validation check
  - [ ] Error highlighting in forms

### Medium Priority

- [ ] **Data Summary Dashboard**
  - [ ] Example count by theme
  - [ ] Difficulty distribution chart
  - [ ] Axis usage statistics
  - [ ] Average rubric points

- [ ] **Template Management**
  - [ ] Create rubric templates
  - [ ] Apply templates to new examples
  - [ ] Edit templates
  - [ ] Template library view

- [ ] **Search & Filter**
  - [ ] Search examples by ID or content
  - [ ] Filter by theme
  - [ ] Filter by difficulty
  - [ ] Filter by tags

## Phase 2: Enhanced Usability (v0.3.0 - v0.5.0)

**Goal**: Improve UX and add power-user features

### Features

- [ ] **Batch Operations**
  - [ ] Bulk edit metadata
  - [ ] Bulk tag assignment
  - [ ] Bulk delete with selection
  - [ ] Copy/duplicate examples

- [ ] **Advanced Validation**
  - [ ] Custom validation rules per project
  - [ ] Axis value constraints
  - [ ] Required field customization
  - [ ] Warning thresholds configuration

- [ ] **Improved Editor**
  - [ ] Markdown preview for text fields
  - [ ] Auto-save drafts
  - [ ] Undo/redo functionality
  - [ ] Keyboard shortcuts

- [ ] **Data Quality Tools**
  - [ ] Duplicate detection
  - [ ] Consistency checks across examples
  - [ ] Rubric completeness scoring
  - [ ] Theme standardization suggestions

- [ ] **Export Options**
  - [ ] Export to CSV for analysis
  - [ ] Export statistics/reports
  - [ ] Split JSONL by criteria
  - [ ] Pretty-print JSONL option

- [ ] **UI Improvements**
  - [ ] Dark mode
  - [ ] Customizable theme colors
  - [ ] Responsive mobile layout
  - [ ] Accessibility improvements (WCAG AA)

## Phase 3: Collaboration Features (v0.6.0 - v1.0.0)

**Goal**: Enable team collaboration and version control

### Features

- [ ] **Backend Integration**
  - [ ] Optional server-side storage
  - [ ] PostgreSQL/SQLite database support
  - [ ] REST API for data access
  - [ ] Authentication (optional)

- [ ] **GitHub Integration**
  - [ ] Export to GitHub repository
  - [ ] Sync with GitHub-hosted datasets
  - [ ] Pull request workflow for data changes
  - [ ] Commit history view

- [ ] **Multi-user Collaboration**
  - [ ] User accounts (optional)
  - [ ] Shared projects
  - [ ] Comment threads on examples
  - [ ] Change tracking and audit log

- [ ] **Version Control**
  - [ ] Example versioning
  - [ ] Rollback to previous versions
  - [ ] Diff view between versions
  - [ ] Branching for experimental data

- [ ] **Review Workflow**
  - [ ] Example status (draft/review/approved)
  - [ ] Reviewer assignment
  - [ ] Review comments and approvals
  - [ ] Quality gates before export

## Phase 4: AI-Assisted Features (v1.1.0+)

**Goal**: Leverage LLMs to accelerate data creation

### Features

- [ ] **AI-Assisted Generation**
  - [ ] Generate synthetic patient scenarios
  - [ ] Suggest rubric criteria based on scenario
  - [ ] Auto-generate ideal completions
  - [ ] Theme/tag suggestions

- [ ] **Quality Assistance**
  - [ ] AI-powered validation suggestions
  - [ ] Identify ambiguous rubrics
  - [ ] Suggest missing evaluation axes
  - [ ] Medical accuracy pre-check (with disclaimers)

- [ ] **Translation Support**
  - [ ] Translate scenarios to other languages
  - [ ] Multi-language dataset management
  - [ ] Language-specific validation

- [ ] **Smart Templates**
  - [ ] Learn from existing examples
  - [ ] Suggest templates based on specialty
  - [ ] Auto-complete based on patterns

## Phase 5: Advanced Evaluation Integration (v2.0.0+)

**Goal**: Deeper integration with evaluation workflows

### Features

- [ ] **simple-evals Integration**
  - [ ] Direct API integration
  - [ ] Run evaluations from UI
  - [ ] View evaluation results
  - [ ] Compare model performance

- [ ] **Evaluation Results Analysis**
  - [ ] Import evaluation results
  - [ ] Visualize model scores per rubric
  - [ ] Identify problematic examples
  - [ ] Suggest data improvements based on eval results

- [ ] **Dataset Quality Metrics**
  - [ ] Inter-rater reliability calculations
  - [ ] Rubric discrimination analysis
  - [ ] Difficulty calibration
  - [ ] Coverage analysis (theme/axis distribution)

- [ ] **Model-Specific Datasets**
  - [ ] Create datasets targeting specific models
  - [ ] Track model performance over time
  - [ ] A/B testing for rubric variations

## Long-term Vision

### Infrastructure
- [ ] Cloud-hosted version (optional SaaS)
- [ ] Desktop app (Electron/Tauri)
- [ ] Mobile companion app (view-only)
- [ ] Plugin system for extensibility

### Community Features
- [ ] Public dataset registry
- [ ] Share templates and rubrics
- [ ] Community-contributed specialties
- [ ] Discussion forum integration

### Advanced Analytics
- [ ] Statistical analysis tools
- [ ] Data quality dashboards
- [ ] Benchmarking against public datasets
- [ ] Export to common ML formats

### Integrations
- [ ] Notion/Confluence export
- [ ] Slack/Discord notifications
- [ ] Zapier integration
- [ ] LangSmith/LangFuse integration

## Contributing to the Roadmap

We welcome feedback on this roadmap! If you have ideas for features or improvements:

1. **Open an Issue**: [GitHub Issues](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues)
2. **Start a Discussion**: [GitHub Discussions](https://github.com/YOUR_USERNAME/healthbench-data-creator/discussions)
3. **Submit a PR**: If you want to implement a feature yourself

## Versioning

We follow [Semantic Versioning](https://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, backward compatible

## Release Schedule

- **MVP (v0.1.0)**: Q1 2025
- **Phase 1 Complete (v0.2.0)**: Q2 2025
- **Phase 2 Complete (v0.5.0)**: Q3 2025
- **Phase 3 Complete (v1.0.0)**: Q4 2025

*Note: Dates are estimates and subject to change based on community contributions and priorities.*

---

Last updated: 2025-01-16
