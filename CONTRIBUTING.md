# Contributing to BTR Risk

## Tech Stack

- **Frontend**: React 19 + Next.js 15 with App Router
- **Language**: JavaScript (no TypeScript)
- **Runtime**: Bun/Next.js
- **UI**: Material-UI v7 + Emotion + Chart.js
- **State**: Context API + Zustand/Immer
- **Math**: AsciiMath for formula rendering (asciimath2ml)
- **Linting**: Oxlint + Next.js ESLint, Prettier formatting

## Prerequisites

```bash
# Install Bun (required)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

## Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/risk-ui.git
cd risk-ui

# 2. Install dependencies
bun install

# 3. Start development
bun run dev
```

## Development Workflow

### Available Scripts

- `bun run dev` - Development server with hot reload
- `bun run lint` - Code quality check
- `bun run format` - Format with Prettier
- `bun run build` - Production build
- `bun run serve` - Serve production build

### Branch Structure

- `main` - Production (auto-deployed to risk.btr.supply)
- `dev` - Development branch
- `feat/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches

### Commit Format

| Type      | Description          | Example                           |
| --------- | -------------------- | --------------------------------- |
| **feat**  | New features         | `[feat] Add risk dashboard`       |
| **fix**   | Bug fixes            | `[fix] Resolve chart rendering`   |
| **refac** | Code refactoring     | `[refac] Restructure components`  |
| **docs**  | Documentation        | `[docs] Update API documentation` |
| **ops**   | Config, dependencies | `[ops] Update React to v19`       |

### Path Aliases

Use configured aliases for cleaner imports (cf. next.config.js):

```javascript
// ✅ Good - Using aliases
import { useRiskModel } from '@store';
import { AllocationModel } from '@pages/AllocationModel';
import { formatBp } from '@utils/format';
import { BaseCard } from '@components/BaseCard';

// ❌ Avoid - Relative paths
import { useRiskModel } from '../../store';
import { AllocationModel } from '../components/pages/AllocationModel';
```

| Alias          | Path                      | Description           |
| -------------- | ------------------------- | --------------------- |
| `@/`           | `./src/`                  | Root source directory |
| `@components/` | `./src/components/`       | React components      |
| `@hooks/`      | `./src/hooks/`            | Custom hooks          |
| `@store/`      | `./src/store/`            | State management      |
| `@utils/`      | `./src/utils/`            | Utilities             |
| `@constants/`  | `./src/constants/`        | Constants/themes      |
| `@pages/`      | `./src/components/pages/` | Page components       |

## Code Guidelines

### Performance Best Practices

- Use `React.memo()` for stable/constant props
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers
- Implement `React.lazy()` for route splitting
- Debounce rapid updates `useDebounce`, `useStateDebounce` (sliders, inputs...)

### Import Organization

```javascript
// 1. React and core libraries
import React, { memo, useMemo, useCallback } from 'react';

// 2. Third-party libraries (selective imports)
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

// 3. Internal utilities (using aliases)
import { useThemeColors } from '@constants';
import { useRiskModel } from '@store';
import { formatBp } from '@utils/format';

// 4. Components (using aliases)
import { BaseCard } from '@components/BaseCard';
import { AllocationModel } from '@pages/AllocationModel';
```

### Component Structure

- Keep components under 200 lines
- Extract complex logic to custom hooks
- Use composition over large components
- Wrap charts with `React.memo`

## Pull Request Process

1. **Quality Check**:

   ```bash
   bun run format    # Format code
   bun run lint      # Check quality
   bun run build     # Verify build
   ```

2. **Create PR**:

   - Title: `[feat] Add feature description`
   - Target: `dev` branch
   - Include screenshots for UI changes

3. **Logical Commits**: Break work into atomic commits

   ```bash
   # Good - separate logical commits
   git add src/components/NewComponent.jsx
   git commit -m "[feat] Add NewComponent"

   git add src/pages/Dashboard.jsx
   git commit -m "[refac] Integrate NewComponent in Dashboard"

   # Bad - everything at once
   git add .
   git commit -m "[feat] Add dashboard and component"
   ```

## Performance & Bundle Rules

- **Tree-shake**: `import { Box } from '@mui/material'` ✅
- **Avoid**: `import * as MUI from '@mui/material'` ❌
- **Memoize**: Chart data and expensive calculations
- **Lazy Load**: Route components with `React.lazy()`
- **Theme**: Use custom hooks for consistent styling
- **Fonts**: Preload custom fonts in `layout.jsx`, use fallbacks
- **Loading**: Use `useLoadingStore` + `PageLoader` for App Router transitions

## Deployment

- `main` branch auto-deploys to `risk.btr.supply` via Cloudflare Pages
- Uses `bun install && bun run build`
- Static export to `dist/` directory
- **Headers/Caching**: `public/_headers` configures security headers, CSP, and caching rules
- **SPA Routing**: `public/_redirects` handles client-side routing for static export
- These files supplement Cloudflare dashboard DNS/endpoint configuration
