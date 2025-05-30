# Contributing to BTR Risk

Thank you for your interest in contributing to BTR Risk! This document provides guidelines for contributing to the project. All participants are expected to be respectful and inclusive in all interactions. Harassment of any kind is not tolerated.

## Tech Stack

BTR Risk is built with modern web technologies:

- **Frontend Framework**: React 19.1.0 with React DOM
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Language**: JavaScript/TypeScript with React TypeScript definitions
- **UI Components**: Material-UI (MUI) v7.1.0 with icons and charts
- **Routing**: React Router DOM v7.6.1
- **Math Rendering**: KaTeX v0.16.22 for mathematical expressions
- **Styling**: Emotion (CSS-in-JS) for styled components
- **Linting**: ESLint v9.25.0 with React-specific plugins
- **Type System**: TypeScript support via @types packages

## Prerequisites

Before contributing, ensure you have the following installed:

### Required

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Comes with Node.js (or **Bun** as an alternative package manager)
- **Git**: For version control

### Recommended

- **VS Code** or similar editor with TypeScript/React support
- **React Developer Tools** browser extension for debugging

### Verification

```bash
# Check your versions
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher
git --version     # Any recent version
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
   # Using npm (recommended)
   npm install

   # Or using Bun (alternative)
   bun install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # Or: bun run dev
   ```
   The application will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

- **`npm run dev`** - Start development server with hot module replacement
- **`npm run build`** - Build for production (outputs to `dist/`)
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run lint:fix`** - Run ESLint and automatically fix issues
- **`npm run format`** - Format all files using Prettier
- **`npm run format:check`** - Check if files are properly formatted

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
2. Make your changes and test locally with `npm run dev`.
3. **Before committing**: Ensure code quality and formatting:
   ```bash
   npm run format        # Format code with Prettier
   npm run lint:fix      # Fix linting issues automatically
   npm run build         # Verify build works
   ```
4. Commit your changes in logical units (see [Logical Commits](#logical-commits) and [Naming Conventions](#naming-conventions)).
5. Create a pull request to merge your changes into the `dev` branch.
6. After review and approval, your changes will be merged into `dev`.
7. Periodically, the `dev` branch is merged into `main` for releases.

## Deployment & CI/CD

The project uses **Cloudflare Pages** for automated deployment:

- **Production**: Pushes to the `main` branch automatically trigger deployment to `risk.btr.supply`
- **Preview**: Pull requests may generate preview deployments for testing
- **Build Command**: `npm run build` (Cloudflare Pages runs this automatically)
- **Output Directory**: `dist/` (Vite's default build output)
- **Environment**: Node.js runtime with npm package installation

### Deployment Process

1. Code merged to `main` → Cloudflare Pages webhook triggered
2. Cloudflare runs `npm install` → `npm run build`
3. Built files deployed from `dist/` to CDN
4. Site live at `risk.btr.supply` within minutes

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
| **chore** | Dependencies, config        | `chore/update-deps`         | `[chore] Update React to v19.1.0`       |

#### Important Notes:

- Commit message subjects should be capitalized and descriptive
- Branch names must start with the type prefix followed by `/`
- Commit messages must start with the type in square brackets `[]`
- Keep commits atomic (one feature/fix per commit)

## Pull Request Process

1. **Quality Checks**: Ensure the following pass locally:

   ```bash
   npm run format:check # Verify code formatting
   npm run lint         # No linting errors
   npm run build        # Builds successfully
   npm run preview      # Preview works as expected
   ```

2. **Testing**: Verify your changes work in development mode (`npm run dev`)

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
npm run format

# Verify everything is formatted correctly
npm run format:check

# Fix any linting issues
npm run lint:fix

# Final verification
npm run lint && npm run build
```

## Code Style Guidelines

- **TypeScript**: Use TypeScript types where beneficial, but JavaScript is acceptable
- **Components**: Use functional components with hooks
- **Styling**: Prefer Material-UI components and Emotion styling
- **Imports**: Use absolute imports where possible, group imports logically
- **ESLint**: Follow the project's ESLint configuration
- **File Structure**: Keep components organized and properly named

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Questions**: Start a GitHub Discussion for general questions
- **Documentation**: Check existing docs and inline code comments

Thank you for contributing to BTR Risk! 🚀
