# Contributing to HealthBench Data Creator

Thank you for your interest in contributing to HealthBench Data Creator! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Code Style](#code-style)
- [Testing](#testing)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git

### Setting Up Development Environment

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/healthbench-data-creator.git
   cd healthbench-data-creator
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

4. **Run Type Checking**

   ```bash
   npm run type-check
   ```

5. **Run Linting**

   ```bash
   npm run lint
   ```

## Development Workflow

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write clear, concise code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   - Ensure the application runs without errors
   - Test in different browsers if UI changes
   - Verify HealthBench JSONL compatibility

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   # or
   git commit -m "fix: bug description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for code style changes (formatting, etc.)
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push and Create PR**
   ```bash
   git push origin your-branch-name
   ```
   Then create a Pull Request on GitHub.

## Reporting Bugs

When reporting bugs, please include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node.js version)
- **Error messages** or console logs

Use the [Bug Report Template](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues/new?template=bug_report.md).

## Suggesting Features

We welcome feature suggestions! Please provide:

- **Clear use case** - Why is this feature needed?
- **Proposed solution** - How would it work?
- **Alternatives considered** - What other approaches did you think about?
- **Additional context** - Any mockups, examples, or references

Use the [Feature Request Template](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues/new?template=feature_request.md).

## Submitting Pull Requests

### PR Guidelines

- **One feature/fix per PR** - Keep PRs focused and manageable
- **Write a clear title** - Following Conventional Commits format
- **Describe your changes** - Explain what and why, not just how
- **Link related issues** - Use "Closes #123" or "Fixes #456"
- **Update documentation** - If your changes affect usage
- **Ensure all checks pass** - Linting, type checking, tests

### PR Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release

### What Gets Merged?

- Bug fixes
- New features that align with project goals
- Performance improvements
- Documentation improvements
- Test additions
- Refactoring that improves code quality

### What Might Be Rejected?

- Breaking changes without discussion
- Features that don't align with HealthBench standards
- Insufficient documentation
- Code that doesn't follow project style
- Changes that significantly increase complexity

## Code Style

### TypeScript

- Use **TypeScript strict mode**
- Define explicit types for function parameters and return values
- Avoid `any` - use `unknown` if type is truly unknown
- Use type guards for runtime checks

### React

- Use **functional components** with hooks
- Keep components focused and single-responsibility
- Use `'use client'` directive only when necessary (client-side state, events)
- Prefer server components for static content

### Naming Conventions

- **Components**: PascalCase (e.g., `ExampleEditor.tsx`)
- **Files**: kebab-case for utilities (e.g., `validation.ts`)
- **Functions**: camelCase (e.g., `validateExample`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`)
- **Types/Interfaces**: PascalCase (e.g., `HealthbenchExample`)

### File Organization

```
src/
├── app/              # Next.js pages and layouts
├── components/       # React components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── specialty/   # Specialty-specific components
│   └── example/     # Example editing components
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

### Formatting

We use **Prettier** for code formatting. Run:

```bash
npm run format
```

### Linting

We use **ESLint** for code quality. Run:

```bash
npm run lint
```

Fix issues automatically:

```bash
npm run lint -- --fix
```

## Testing

Currently, we focus on:

- **Type safety** via TypeScript
- **Manual testing** in development
- **Validation** via Zod schemas

Future plans include:

- Unit tests for utilities
- Integration tests for components
- E2E tests for critical workflows

When contributing, please manually test:

1. Create a new specialty project
2. Add examples with rubrics
3. Export to JSONL
4. Import JSONL back
5. Validate data integrity

## Documentation

When adding features, please update:

- **README.md** if it affects usage
- **Code comments** for complex logic
- **Type definitions** with JSDoc comments
- **This CONTRIBUTING.md** if it affects contribution process

## Questions?

If you have questions:

- Open a [Discussion](https://github.com/YOUR_USERNAME/healthbench-data-creator/discussions)
- Check existing [Issues](https://github.com/YOUR_USERNAME/healthbench-data-creator/issues)
- Read the [README](./README.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HealthBench Data Creator! Your efforts help the medical AI research community create better evaluation datasets.
