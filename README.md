# HealthBench Data Creator

**A modern web tool for creating, editing, and validating OpenAI HealthBench-compliant datasets**

> Unofficial, HealthBench-compatible tool. Not affiliated with or endorsed by OpenAI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

## Overview

HealthBench Data Creator is an open-source web application to create, edit, validate, and export datasets in the **OpenAI HealthBench** format. This tool focuses on **data creation** — evaluation and scoring are handled by OpenAI's [`simple-evals`](https://github.com/openai/simple-evals) framework.

### What is HealthBench?

[HealthBench](https://github.com/openai/simple-evals/tree/main/healthcare_data) is OpenAI's benchmark for evaluating AI models on healthcare-related tasks. It consists of:
- **Scenarios**: Multi-turn conversations between patients, assistants, and clinicians
- **Rubrics**: Detailed evaluation criteria across multiple axes (accuracy, completeness, communication, etc.)
- **Metadata**: Difficulty levels, specialties, themes, and consensus information

HealthBench data is stored in JSONL format, with each line representing one complete scenario with its rubrics and metadata.

### Project Mission

Enable physicians and researchers to create high-quality, HealthBench-compliant datasets through an intuitive GUI, with built-in validation and reproducibility. **This tool does NOT perform evaluation** — it creates the data that can then be evaluated using `simple-evals`.

## Key Features

- 🏥 **Specialty Management**: Organize datasets by medical specialty (e.g., kampobench, cardiology, mental health)
- ✏️ **Rich Editing Interface**: GUI for editing all HealthBench fields (prompts, rubrics, ideal completions, metadata)
- 📋 **Template System**: Reusable templates for axes, themes, and rubrics per specialty
- ✅ **Real-time Validation**: Client-side schema validation with clear error reporting
- 📊 **Data Summary Dashboard**: Visualize scenario distribution, themes, difficulty levels
- 📥📤 **JSONL Import/Export**: Seamless integration with existing HealthBench datasets
- 🔄 **Version Control Ready**: Designed to work with Git-based workflows

## Quick Start

### Prerequisites
- Node.js 18.17 or later

### Install & Run

```bash
git clone https://github.com/hotake-varytex/healthbench-data-creator.git
cd healthbench-data-creator
npm install
npm run dev
# open http://localhost:3000
```

### Export/Import
- Export: select examples → **Export JSONL** → download for `simple-evals`.
- Import: **Import JSONL** → pick a HealthBench-compliant file → review and edit.

More setup details: see [SETUP.md](./SETUP.md). Architecture and design notes: see [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md).

## Setup

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/hotake-varytex/healthbench-data-creator.git
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

- 🐛 [Report a bug](https://github.com/hotake-varytex/healthbench-data-creator/issues)
- 💡 [Request a feature](https://github.com/hotake-varytex/healthbench-data-creator/issues)
- 📖 [Documentation](https://github.com/hotake-varytex/healthbench-data-creator/wiki)

## Citation

If you use this tool in your research, please cite:

```bibtex
@software{healthbench_data_creator,
  title = {HealthBench Data Creator},
  author = {hayato otake},
  year = {2025},
  url = {https://github.com/hotake-varytex/healthbench-data-creator}
}
```

---

Made with ❤️ for the medical AI research community
