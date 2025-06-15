# Contributing to BTR Risk

Thank you for your interest in contributing to BTR Risk! This document provides guidelines for contributing to the project. All participants are expected to be respectful and inclusive in all interactions. Harassment of any kind is not tolerated.

## Tech Stack

BTR Risk is built with modern web technologies optimized for performance and developer experience:

### Core Technologies

- **Frontend Framework**: React >v19 with React DOM
- **Build Tool**: Next.js >v15 for fast development and optimized static exports with code splitting
- **Language**: JavaScript with React JSX components
- **State Management**: Context API with useReducer for centralized state, Zustand for client state
- **Routing**: Next.js App Router with lazy loading and static export support

### UI & Styling

- **UI Components**: Material-UI (MUI) >v7 with comprehensive component library
  - `@mui/material`: Core components (Box, Typography, Card, etc.)
  - `@mui/icons-material`: MD Icon library with 2000+ icons
  - `@mui/x-charts`: Advanced charting components (BarChart, LineChart, PieChart)
- **Styling System**: Emotion (CSS-in-JS) for styled components and theme support
- **Math Rendering**: KaTeX v0.16.22 for mathematical expressions and formulas

### Development Tools

- **Linting**: ESLint >v8.50 with Next.js configuration and Oxlint >v1.1.0 for fast linting
- **Formatting**: Prettier >v3.5 for consistent code style
- **Type System**: Pure JavaScript with JSDoc comments for type hints where beneficial
- **Hot Reload**: Next.js Fast Refresh with Turbopack for instant development feedback

### Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting and lazy loading for route-based components
- **Bundle Analysis**: Custom webpack configuration for manual chunk splitting and optimal caching
- **Memoization**: React.memo and useMemo for component optimization
- **Asset Optimization**: Next.js built-in Terser minification, tree-shaking, and static export optimization

## Prerequisites

Before contributing, ensure you have the following installed:

### Required

- **Bun**: Primary package manager and runtime (recommended)
- **Git**: For version control
- **Python 3**: For pre-commit hooks (usually pre-installed on macOS/Linux)
- **UV**: Fast Python package installer (recommended for pre-commit)

### Installation

Install Bun if you haven't already:

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Or via npm (if you have Node.js)
npm install -g bun
```

Install UV for pre-commit (if not already installed):

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Recommended

- **VS Code** or similar editor with JavaScript/React support
- **React Developer Tools** browser extension for debugging

### Verification

```bash
# Check your versions
bun --version     # Should be 1.x or higher (primary)
git --version     # Any recent version
python3 --version # Should be 3.8 or higher
uv --version      # Should be latest version
```

## Getting Started

### Setup Steps

1. **Fork the repository** to your GitHub account.

2. **Clone your fork** locally:

   ```bash
   # Replace <your-username> with your actual GitHub username
   git clone https://github.com/<your-username>/risk.git
   cd risk
   ```

3. **Install dependencies**:

   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm (alternative)
   npm install
   ```

4. **Set up pre-commit hooks**:

   ```bash
   # Install pre-commit hooks (one-time setup)
   bun run pre-commit:install

   # Or manually install:
   uv tool install pre-commit
   uv tool run pre-commit install
   uv tool run pre-commit install --hook-type pre-push
   ```

5. **Start the development server**:
   ```bash
   bun run dev
   # Or: npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

- **`bun run dev`** - Start development server with hot module replacement
- **`bun run build`** - Build for production (outputs to `dist/`)
- **`bun run preview`** - Preview the production build locally
- **`bun run lint`** - Run ESLint to check code quality
- **`bun run lint:fix`** - Run ESLint and automatically fix issues
- **`bun run format`** - Format all files using Prettier
- **`bun run format:check`** - Check if files are properly formatted
- **`bun run pre-commit`** - Run all pre-commit hooks manually on all files
- **`bun run pre-commit:install`** - Install pre-commit hooks (one-time setup)

_Note: All scripts can also be run with `npm run <script>` if using npm instead of Bun._

### Pre-commit Hooks

This project uses **pre-commit** hooks to ensure code quality and consistency. The hooks automatically run on every commit and include:

- **Oxlint**: Fast JavaScript/TypeScript linting with automatic fixes
- **Next.js ESLint**: Next.js-specific linting rules
- **Prettier**: Code formatting for consistent style
- **Build Check**: Ensures the project builds successfully (runs on pre-push)
- **File maintenance**: Trims whitespace, fixes line endings, checks YAML/JSON syntax

#### Manual Hook Execution

```bash
# Run all hooks on all files
bun run pre-commit

# Run hooks on staged files only (simulates commit)
uv tool run pre-commit run

# Run a specific hook
uv tool run pre-commit run oxlint

# Skip hooks for a commit (use sparingly)
git commit -m "your message" --no-verify
```

### Logical Commits

**IMPORTANT**: Never commit all changes at once. Always break down your work into logical, atomic commits where each commit represents a single feature, fix, or improvement.

#### Best Practices:

- **One feature per commit**: Each commit should contain only related changes for a single feature or fix
- **Examine changes first**: Use `git diff` to review what you're committing
- **Stage selectively**: Use `git add <specific-files>` instead of `git add .`
- **Test each commit**: Ensure each commit builds and works independently
- **Meaningful commit messages**: Each commit should have a clear, descriptive message

#### Example of Good Commit Sequence:

```bash
# Instead of one large commit:
git add .
git commit -m "[feat] Add routing and homepage"

# Do this - multiple logical commits:
git add package.json package-lock.json
git commit -m "[chore] Add react-router-dom dependency"

git add src/pages/HomePage.jsx src/pages/index.jsx
git commit -m "[feat] Add homepage with model navigation"

git add src/App.jsx
git commit -m "[feat] Add React Router navigation to App"

git add src/components/Footer.jsx
git commit -m "[refac] Extract reusable SocialLinks component"
```

### Development Process

We follow a simplified version of the widely popular [gitflow](https://danielkummer.github.io/git-flow-cheatsheet/):

```
main     ← production-ready, automatically deployed to risk.btr.supply
└── dev  ← active development (features, fixes merged here)
    └── feat/dashboard-improvements
    └── fix/chart-rendering-issue
```

1. Create a new branch from `dev` with the appropriate prefix (see [Naming Conventions](#naming-conventions)).
2. Make your changes and test locally with `bun run dev`.
3. **Before committing**: Ensure code quality and formatting:
   ```bash
   bun run format        # Format code with Prettier
   bun run lint:fix      # Fix linting issues automatically
   bun run build         # Verify build works
   ```
4. Commit your changes in logical units (see [Logical Commits](#logical-commits) and [Naming Conventions](#naming-conventions)).
5. Create a pull request to merge your changes into the `dev` branch.
6. After review and approval, your changes will be merged into `dev`.
7. Periodically, the `dev` branch is merged into `main` for releases.

## Deployment & CI/CD

The project uses **Cloudflare Pages** for automated deployment:

- **Production**: Pushes to the `main` branch automatically trigger deployment to `risk.btr.supply`
- **Preview**: Pull requests may generate preview deployments for testing
- **Build Command**: `bun install && bun run build` (configured in `wrangler.toml`)
- **Output Directory**: `dist/` (Next.js static export output)
- **Environment**: Bun package manager with Node.js >=20.0.0 requirement

### Deployment Process

1. Code merged to `main` → Cloudflare Pages webhook triggered
2. Cloudflare uses `wrangler.toml` configuration for Node.js 20+ and Bun environment
3. Cloudflare runs `bun install` → `bun run build` (Next.js static export)
4. Built files deployed from `dist/` to CDN with optimized headers and redirects
5. Site live at `risk.btr.supply` within minutes

## Branch Structure

- **`main`** - Production branch

  - Contains stable, released code
  - Automatically deployed to `risk.btr.supply` via Cloudflare Pages
  - Protected branch requiring pull request reviews

- **`dev`** - Development branch

  - Active development happens here
  - Features and fixes are merged into this branch via Pull Requests
  - Periodically merged into `main` for releases

- **Feature/Fix branches** - Created from `dev`
  - Follow naming conventions (e.g., `feat/risk-calculator`, `fix/chart-tooltip`)
  - Always merge back into `dev`

## Naming Conventions

### Branch and Commit Format

All branches and commits must use specific prefixes for consistency:

| Type      | Description                 | Branch Example              | Commit Example                          |
| --------- | --------------------------- | --------------------------- | --------------------------------------- |
| **feat**  | New features, improvements  | `feat/risk-dashboard`       | `[feat] Add interactive risk dashboard` |
| **fix**   | Bug fixes, issues           | `fix/chart-responsiveness`  | `[fix] Resolve chart mobile rendering`  |
| **refac** | Code refactoring, cleanup   | `refac/component-structure` | `[refac] Restructure chart components`  |
| **style** | UI/UX improvements, styling | `style/material-ui-theme`   | `[style] Update MUI theme colors`       |
| **docs**  | Documentation, README       | `docs/api-integration`      | `[docs] Document risk calculation API`  |
| **ops**   | Config, scripts, CI/CD      | `ops/update-deps`           | `[ops] Update React to v19.1.0`         |

#### Important Notes:

- Commit message subjects should be capitalized and descriptive
- Branch names must start with the type prefix followed by `/`
- Commit messages must start with the type in square brackets `[]`
- Keep commits atomic (one feature/fix per commit)

## Pull Request Process

1. **Quality Checks**: Ensure the following pass locally:

   ```bash
   bun run format:check # Verify code formatting
   bun run lint         # No linting errors
   bun run build        # Builds successfully
   bun run preview      # Preview works as expected
   bun run pre-commit   # Run all pre-commit hooks
   ```

   _Note: Pre-commit hooks will run automatically on commit, but running them manually first can catch issues early._

2. **Testing**: Verify your changes work in development mode (`bun run dev`)

3. **Pull Request**:

   - Title should follow commit format (e.g., `[feat] Add risk metrics visualization`)
   - Provide clear description of changes and rationale
   - Reference related issues (e.g., "Closes #123", "Fixes #456")
   - Include screenshots for UI changes

4. **Review Process**:
   - Wait for review from project maintainers
   - Address any feedback promptly
   - Ensure CI checks pass (linting, build)

## Code Formatting

This project uses **Prettier** for consistent code formatting and **ESLint** for code quality. All code must be formatted before committing.

### Configuration Files:

- **`.prettierrc`** - Prettier configuration with project formatting rules
- **`.prettierignore`** - Files to exclude from formatting
- **`eslint.config.js`** - ESLint configuration with Prettier integration

### Formatting Rules:

- **Single quotes** for JavaScript strings, **double quotes** for JSX attributes
- **Semicolons** at the end of statements
- **2 spaces** for indentation (no tabs)
- **80 character** line length limit
- **Trailing commas** in ES5-compatible locations
- **LF line endings** for cross-platform compatibility

### Pre-commit Workflow:

```bash
# Format your code before committing
bun run format

# Verify everything is formatted correctly
bun run format:check

# Fix any linting issues
bun run lint:fix

# Final verification
bun run lint && bun run build
```

## Code Style Guidelines

### General Principles

- **JavaScript**: The project uses pure JavaScript without TypeScript
- **Components**: Use functional components with hooks exclusively
- **Styling**: Prefer Material-UI components and Emotion styling
- **Imports**: Use absolute imports where possible, group imports logically
- **ESLint**: Follow the project's ESLint configuration
- **File Structure**: Keep components organized and properly named

### Component Reusability & Optimization Best Practices

#### 1. Custom UI Components

Create reusable abstractions for common MUI patterns:

```jsx
// ✅ Good - Reusable BaseCard component
import { BaseCard } from './components/ui';
<BaseCard sx={{ p: 3 }}>Content</BaseCard>

// ❌ Avoid - Repeated Card configuration
<Card elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
```

#### 2. Performance Optimization

- **Memoization**: Assess the use of `React.memo()` for components that receive stable props
- **Computed Values**: Assess the use of `useMemo()` for expensive calculations
- **Callback Stability**: Use `useCallback()` for event handlers passed to children
- **Lazy Loading**: Use `React.lazy()` where relevant, eg. route-based code splitting

```jsx
// ✅ Good - Memoized component
const OptimizedChart = memo(({ data, colors }) => (
  <MemoizedLineChart data={data} colors={colors} />
));

// ✅ Good - Memoized calculation
const calculatedWeights = useMemo(
  () => targetWeights(cScores, maxWeight, BPS, amplifier),
  [cScores, maxWeight, amplifier]
);
```

#### 3. Theme & Styling Optimization

- **Theme Hooks**: Use custom theme hooks to prevent repeated theme access
- **Style Factories**: Create reusable style functions for common patterns
- **Cached Selectors**: Use memoized theme selectors for performance

```jsx
// ✅ Good - Custom theme hook
const { primary, divider } = useThemeColors();

// ✅ Good - Style factory
const cardStyles = createCardSx(theme, { height: '100%' });
```

#### 4. State Management

- **Centralized State**: Use Context API with useReducer for shared state
- **Debounced Updates**: Debounce rapid state updates (sliders, inputs)
- **Computed State**: Derive state using memoized calculations
- **Stable Callbacks**: Use useCallback for action creators

#### 5. Bundle Optimization

- **Code Splitting**: Split routes using `React.lazy()`
- **Tree Shaking**: Import only needed MUI components for tree shaking
- **Chunk Strategy**: Separate vendor libraries in build configuration

```jsx
// ✅ Good - Selective imports
import { Box, Typography } from '@mui/material';

// ❌ Avoid - Barrel imports
import * as MUI from '@mui/material';
```

#### 6. Chart Components

- **Memoized Charts**: Wrap chart components with React.memo
- **Data Preparation**: Memoize chart data transformations
- **Responsive Design**: Use consistent chart containers

```jsx
// ✅ Good - Optimized chart usage
const chartData = useMemo(() => generateChartData(rawData), [rawData]);

<MemoizedChartContainer>
  <MemoizedLineChart data={chartData} />
</MemoizedChartContainer>;
```

### Architecture Guidelines

#### Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI abstractions
│   ├── optimized/       # Memoized component variants
│   └── charts/          # Chart-specific components
├── hooks/               # Custom hooks for optimization
├── theme/              # Theme utilities and factories
└── pages/              # Route components (lazy-loaded)
```

#### Import Organization

```jsx
// 1. React and core libraries
import React, { memo, useMemo } from 'react';

// 2. Third-party libraries
import { Box, Typography } from '@mui/material';

// 3. Internal utilities and hooks
import { useThemeColors } from '../theme';

// 4. Local components
import { BaseCard } from './ui';
```

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Questions**: Start a GitHub Discussion for general questions
- **Documentation**: Check existing docs and inline code comments

Thank you for contributing to BTR Risk! 🚀
