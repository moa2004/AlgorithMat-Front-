# AlgorithMat Problem-Solving Platform

## Overview

The **AlgorithMat** platform is a web application that empowers learners to practice coding problems, review detailed submission feedback, and explore curated content that accelerates their competitive programming journey. It provides a welcoming home page, problem exploration workflows, detailed submission history, and profile insights—all built with a focus on responsiveness, accessibility, and maintainability.

## Key Features

1. **Authentication experience**: Dedicated login and registration pages with friendly error handling and accessibility-conscious UI states.
2. **Home dashboard**: Hero section, dynamic statistics, trending problem highlights, and recent submission feeds presented in distinct visual cards.
3. **Problem management**: Hierarchical routing for problem browsing, detailed problem pages, and an authoring interface for administrators to add new challenges.
4. **Submission insights**: Modal-driven view that surfaces compiler metadata, execution metrics, and individual test-case outcomes for each submission.
5. **Profile overview**: Dedicated profile page for managing user-centric data and summary cards.
6. **Pure CSS styling**: The entire interface is styled using handcrafted, framework-free CSS to keep bundle size lean and afford full design control.

## Technology Stack

- **React 19** – component-based UI architecture with modern hooks.
- **Vite 7** – fast development server, HMR, and optimized production builds.
- **React Router DOM 7** – nested routing, guarded layouts, and redirect handling.
- **Axios** – promise-based HTTP client used to communicate with the remote REST API.
- **Recharts 3** – data visualization library for rendering statistics and charts where needed.
- **Pure CSS** – custom stylesheets without utility or component frameworks for full styling ownership.
- **ESLint 9** – linting rules to maintain readable and consistent code.

## Project Structure Highlights

```
src/
  Components/
    Home/              # Home page sections (hero, features grid, stats, etc.)
    miniComponents/    # Reusable UI pieces (LoadingSpinner, PasswordStrengthMeter, ...)
    Modal.jsx          # Accessible modal wrapper used across views
    Problem Components # Navigation and UI around the problem pages
  Pages/
    Home/              # Home page container and styling
    Login&SinUp/       # Authentication flows and shared CSS assets
    Problems/          # Problem listing, detail view, and add-problem workflows
    Submisions/        # Test environment, submission lists, and detail pages
  hooks/
    usePasswordStrength.js # Custom hook for password meter logic
  App.jsx              # Route definitions and layout shell
  main.jsx             # Application bootstrap with React and Vite
```

## Getting Started

1. **Install prerequisites**
   - Node.js **>= 18.0.0** (recommended for Vite 7 compatibility)
   - npm (bundled with Node.js)
2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PS-platform
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at the URL provided in the terminal (typically `http://localhost:5173`).
5. **Build for production**
   ```bash
   npm run build
   ```
6. **Preview the production build locally**
   ```bash
   npm run preview
   ```

## Environment & API Configuration

- The application currently targets the public API hosted at `http://problem-solving.runasp.net/api/v1/` for statistics, problems, and submissions.
- To point to a different backend, adjust the fetch or Axios base URLs in the relevant service calls (e.g., inside `Home.jsx`, submissions pages, or dedicated service helpers).
- Sensitive tokens are stored in `localStorage` as `userAuth`. Ensure HTTPS is used in production and consider migrating to HTTP-only cookies for enhanced security.

## Styling Guidelines

- All styling is authored using pure `.css` files colocated with the components or pages they affect (e.g., `Home.css`, `PasswordStrengthMeter.css`).
- Consistent naming conventions (BEM-inspired class names) help avoid style collisions.
- Dark sections leverage semantic color tokens to keep contrast high and maintain accessibility.
- When contributing new UI, prefer extending existing variables and patterns instead of introducing frameworks to preserve the minimal CSS footprint.

## Accessibility & UX Notes

- Modal dialogs announce dynamic content changes through `aria-live` regions and maintain focus traps.
- Form elements are paired with accessible labels and visual feedback states.
- Keyboard navigation is supported across interactive components, and color usage aims to meet WCAG contrast guidelines.

## Available npm Scripts

- `npm run dev` – launch the Vite development server with hot module replacement.
- `npm run build` – generate an optimized production build inside `dist/`.
- `npm run preview` – serve the production build locally for smoke testing.
- `npm run lint` – analyze the codebase using ESLint 9 rules.

## Potential Enhancements

- Integrate environment variables (e.g., via `.env`) to manage API endpoints per environment.
- Add unit tests (React Testing Library or Vitest) for key components and hooks.
- Introduce CI workflows that run linting and build checks on pull requests.
- Expand analytics visualizations leveraging Recharts or alternative data viz libraries.

## Contributing

1. Fork the repository and create a feature branch.
2. Ensure linting passes and that all UI changes are responsive and accessible.
3. Submit a pull request describing the motivation, implementation details, and screenshots when UI changes are involved.

## License

The license for this project has not been specified. Please consult the project owner or add a `LICENSE` file to clarify usage rights.

## Support

For questions, feature requests, or bug reports:

- Open an issue in the repository with relevant screenshots and reproduction steps.
- Provide API responses or network logs when encountering data-related problems.

Enjoy building and iterating on AlgorithMat! 🎯
