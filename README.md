# HealthBench Data Creator

**A modern web tool for creating, editing, and validating OpenAI HealthBench-compliant datasets**

> Unofficial, HealthBench-compatible tool. Not affiliated with or endorsed by OpenAI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

## Overview

HealthBench Data Creator is an open-source web application designed for medical professionals and researchers to create, edit, validate, and export datasets in the **OpenAI HealthBench** format. This tool focuses exclusively on **data creation** — evaluation and scoring are handled by OpenAI's [`simple-evals`](https://github.com/openai/simple-evals) framework.

### What is HealthBench?

[HealthBench](https://github.com/openai/simple-evals/tree/main/healthcare_data) is OpenAI's benchmark for evaluating AI models on healthcare-related tasks. It consists of:
- **Scenarios**: Multi-turn conversations between patients, assistants, and clinicians
- **Rubrics**: Detailed evaluation criteria across multiple axes (accuracy, completeness, communication, etc.)
- **Metadata**: Difficulty levels, specialties, themes, and consensus information

HealthBench data is stored in JSONL format, with each line representing one complete scenario with its rubrics and metadata.

### Project Mission

> Enable physicians and researchers to create high-quality, HealthBench-compliant datasets through an intuitive GUI, with built-in validation and reproducibility.

**This tool does NOT perform evaluation** — it creates the data that can then be evaluated using `simple-evals`.

## Key Features

- 🏥 **Specialty Management**: Organize datasets by medical specialty (e.g., kampobench, cardiology, mental health)
- ✏️ **Rich Editing Interface**: GUI for editing all HealthBench fields (prompts, rubrics, ideal completions, metadata)
- 📋 **Template System**: Reusable templates for axes, themes, and rubrics per specialty
- ✅ **Real-time Validation**: Client-side schema validation with clear error reporting
- 📊 **Data Summary Dashboard**: Visualize scenario distribution, themes, difficulty levels
- 📥📤 **JSONL Import/Export**: Seamless integration with existing HealthBench datasets
- 🔄 **Version Control Ready**: Designed to work with Git-based workflows

## Technology Stack

### Core Framework
- **Next.js 15** (App Router) - Modern React framework with server components
- **TypeScript 5.0** - Type-safe development
- **React 19** - Latest React features

### UI Library Selection

After evaluating multiple options, we chose **shadcn/ui + Radix UI + Tailwind CSS** for the following reasons:

| Library | Pros | Cons | Score |
|---------|------|------|-------|
| **shadcn/ui + Radix** | ✅ Copy-paste components (full control)<br>✅ Excellent form handling with React Hook Form<br>✅ Accessible by default (Radix primitives)<br>✅ Tailwind-based (easy customization)<br>✅ Active community & Next.js integration | ⚠️ Requires manual component setup | ⭐⭐⭐⭐⭐ |
| MUI | ✅ Comprehensive component library<br>✅ Mature ecosystem | ❌ Heavy bundle size<br>❌ Harder to customize deeply | ⭐⭐⭐ |
| Mantine | ✅ Great form support<br>✅ Good documentation | ⚠️ Less Tailwind-friendly<br>⚠️ Smaller ecosystem | ⭐⭐⭐⭐ |
| Chakra UI | ✅ Good DX<br>✅ Theme system | ⚠️ Moving to v3 (instability)<br>⚠️ CSS-in-JS overhead | ⭐⭐⭐ |

**Decision: shadcn/ui + Radix UI + Tailwind CSS**

Rationale:
- **Form-heavy application**: We need robust form handling for complex nested data (rubrics, chat turns). React Hook Form integration is excellent.
- **Customization**: Copy-paste model means we own the components and can adapt them to HealthBench-specific needs.
- **Performance**: No runtime CSS-in-JS, Tailwind compiles to minimal CSS.
- **Accessibility**: Radix UI primitives ensure WCAG compliance out of the box.
- **Developer Experience**: Great TypeScript support, Next.js 15 compatible.

### Additional Libraries
- **zod** - Runtime schema validation
- **react-hook-form** - Form state management
- **zustand** - Lightweight global state (if needed)
- **lucide-react** - Icon library
- **recharts** - Data visualization for summary dashboard

## Architecture

### Project Structure

```
healthbench-data-creator/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Dashboard / Specialty list
│   │   ├── specialties/
│   │   │   ├── [name]/
│   │   │   │   └── page.tsx           # Specialty detail view
│   │   │   └── new/
│   │   │       └── page.tsx           # Create new specialty
│   │   └── api/
│   │       └── validate/
│   │           └── route.ts           # Optional validation endpoint
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── specialty/
│   │   │   ├── SpecialtyCard.tsx
│   │   │   └── SpecialtyForm.tsx
│   │   ├── example/
│   │   │   ├── ExampleEditor.tsx      # Main editor for one HealthBench record
│   │   │   ├── PromptEditor.tsx       # Chat turn editor
│   │   │   ├── RubricEditor.tsx       # Rubric criteria editor
│   │   │   ├── IdealCompletionEditor.tsx
│   │   │   └── MetadataEditor.tsx
│   │   ├── template/
│   │   │   ├── AxesManager.tsx        # Manage available axes
│   │   │   ├── ThemeManager.tsx       # Manage themes
│   │   │   └── RubricTemplates.tsx    # Reusable rubric templates
│   │   ├── io/
│   │   │   ├── JsonlImporter.tsx
│   │   │   └── JsonlExporter.tsx
│   │   └── dashboard/
│   │       └── SummaryPanel.tsx       # Statistics & charts
│   ├── lib/
│   │   ├── jsonl.ts                   # JSONL parsing/generation
│   │   ├── validation.ts              # Zod schemas & validation logic
│   │   ├── storage.ts                 # localStorage wrapper
│   │   └── utils.ts                   # Utility functions
│   └── types/
│       └── healthbench.ts             # TypeScript type definitions
├── public/
│   └── screenshots/                   # Documentation screenshots
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── components.json                    # shadcn/ui config
├── LICENSE                            # MIT License
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── ROADMAP.md
```

### Data Flow

```
User Input (GUI Forms)
        ↓
Component State (React Hook Form)
        ↓
Validation Layer (Zod Schemas)
        ↓
Local Storage / State Management
        ↓
JSONL Export (Download)
        ↓
simple-evals (External evaluation)
```

### State Management Strategy

**Phase 1 (MVP)**:
- Local component state with `useState` and `useReducer`
- React Hook Form for form state
- localStorage for persistence

**Phase 2 (Future)**:
- Zustand for global state if complexity grows
- Potential backend integration (file system, database, or GitHub API)

## Data Model

The core TypeScript types are designed to map directly to HealthBench's JSONL format:

```typescript
// Chat roles in multi-turn conversations
type ChatRole = "patient" | "assistant" | "clinician" | "system";

// A single turn in the conversation
interface ChatTurn {
  role: ChatRole;
  content: string;
}

// Model-generated ideal responses
interface IdealCompletion {
  id: string;
  content: string;
  metadata?: {
    author?: string;
    notes?: string;
  };
}

// Evaluation axes (extensible)
type AxisId =
  | "accuracy"
  | "completeness"
  | "context_awareness"
  | "communication"
  | "instruction_following"
  | string; // Allow custom axes

// Individual rubric criterion
interface RubricItem {
  criterion_id: string;
  criterion: string;
  axis: AxisId;
  points: number;
  metadata?: {
    consensus?: boolean;
    notes?: string;
  };
}

// Example-level metadata
interface ExampleMetadata {
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
  specialty?: string;
  created_by?: string;
  created_at?: string; // ISO8601
  tags?: string[];
}

// Complete HealthBench example (one JSONL line)
interface HealthbenchExample {
  id: string;
  theme: string[];
  source: string;
  prompt: ChatTurn[];
  ideal_completions?: IdealCompletion[];
  rubrics: RubricItem[];
  metadata?: ExampleMetadata;
}

// Specialty project configuration
interface SpecialtyProject {
  name: string;
  description: string;
  availableAxes: AxisId[];
  commonThemes: string[];
  rubricTemplates: RubricTemplate[];
  examples: HealthbenchExample[];
  metadata: {
    created_at: string;
    updated_at: string;
    version: string;
  };
}
```

### Validation Strategy

Using **Zod** for runtime validation:

1. **Schema Definition**: Zod schemas mirror TypeScript types
2. **Real-time Validation**: Form fields validate on blur/change
3. **Pre-export Validation**: Full validation before JSONL export
4. **Error Reporting**: User-friendly error messages with field highlighting

Key validations:
- Required fields (id, theme, source, prompt, rubrics)
- ID uniqueness across examples and criterion_ids
- Valid axis values against specialty configuration
- Proper chat turn structure (role + content)
- Points >= 0 in rubrics
- Valid ISO8601 timestamps

## Setup

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/healthbench-data-creator.git
cd healthbench-data-creator

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Creating a New Specialty

1. Navigate to the home page
2. Click "New Specialty"
3. Configure:
   - Specialty name (e.g., "kampobench")
   - Available evaluation axes
   - Common themes
   - Rubric templates
4. Start adding examples

### Editing a HealthBench Example

1. Select a specialty
2. Click "New Example" or select an existing one
3. Fill in:
   - **ID**: Unique identifier
   - **Theme**: Select from configured themes (multi-select)
   - **Source**: Data source description
   - **Prompt**: Add chat turns (patient/clinician/assistant)
   - **Ideal Completions**: Optional model responses
   - **Rubrics**: Add evaluation criteria
   - **Metadata**: Difficulty, tags, author info
4. Real-time validation ensures data integrity
5. Save to specialty project

### Importing Existing Data

1. Go to specialty view
2. Click "Import JSONL"
3. Select a HealthBench-compliant JSONL file
4. Review imported examples
5. Edit as needed

### Exporting Data

1. Select examples to export (or export all)
2. Click "Export JSONL"
3. Download file
4. Use with `simple-evals` for evaluation

### Using with simple-evals

```bash
# After exporting JSONL from this tool
git clone https://github.com/openai/simple-evals.git
cd simple-evals

# Place your exported JSONL in the healthcare_data directory
cp /path/to/exported/data.jsonl healthcare_data/kampobench/my_custom_set.jsonl

# Run evaluation (follow simple-evals documentation)
python run_eval.py healthcare kampobench
```

## Screenshots

![Dashboard](./public/screenshots/dashboard.png)
*Main dashboard showing specialty projects*

![Example Editor](./public/screenshots/example-editor.png)
*Editing a HealthBench example with rubrics*

![Summary View](./public/screenshots/summary.png)
*Data statistics and theme distribution*

## Development

### Code Style

- **ESLint** + **Prettier** for code formatting
- **TypeScript strict mode** enabled
- **Component structure**: One component per file
- **Naming**: PascalCase for components, camelCase for functions

### Running Tests

```bash
# Unit tests (when implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Reporting bugs
- Suggesting features
- Submitting pull requests
- Code review process

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features:

- [ ] **Phase 1 (MVP)**: Basic editing, validation, import/export
- [ ] **Phase 2**: Template system, advanced validation
- [ ] **Phase 3**: Collaboration features (GitHub integration)
- [ ] **Phase 4**: LLM-assisted data generation
- [ ] **Phase 5**: Backend with multi-user support

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **OpenAI** for the HealthBench benchmark and simple-evals framework
- **Radix UI** and **shadcn/ui** for accessible component primitives
- The open-source medical AI community

## Support

- 🐛 [Report a bug](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues)
- 💡 [Request a feature](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues)
- 📖 [Documentation](https://github.com/YOUR_USERNAME/healthbench-data-creator/wiki)

## Citation

If you use this tool in your research, please cite:

```bibtex
@software{healthbench_data_creator,
  title = {HealthBench Data Creator},
  author = {Your Name},
  year = {2025},
  url = {https://github.com/YOUR_USERNAME/healthbench-data-creator}
}
```

---

Made with ❤️ for the medical AI research community
