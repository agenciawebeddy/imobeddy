# AI Development Rules for ImobEddy CRM

This document outlines the rules and conventions for AI-driven development on this project. Following these guidelines ensures consistency, maintainability, and adherence to the project's architecture.

## Tech Stack Overview

The application is built with the following technologies:

- **Framework:** React 19 with TypeScript for building the user interface.
- **Build Tool:** Vite for fast and efficient development and bundling.
- **Styling:** Tailwind CSS for all styling, configured via a script in `index.html`.
- **UI Components:** A combination of custom-built components with a preference for using `shadcn/ui` for any new elements.
- **Icons:** `lucide-react` is the exclusive icon library for the project.
- **Charting:** `recharts` is used for all data visualization and charts.
- **Language:** TypeScript is used for all `.ts` and `.tsx` files to ensure type safety.
- **File Structure:** Source code is located in `src/`, with components in `src/components/` and pages in `src/pages/`.

## Library Usage and Conventions

### UI and Styling

- **Component Library:** **ALWAYS** prioritize using components from the `shadcn/ui` library for new UI elements like buttons, inputs, dialogs, etc. The necessary dependencies are considered pre-installed.
- **Custom Components:** If a `shadcn/ui` component is not suitable, create a new, single-purpose React component in the `src/components/` directory. Keep components small and focused.
- **Styling:** **ONLY** use Tailwind CSS utility classes for styling. Do not write custom CSS files or use inline `style` objects. Adhere to the custom color palette defined in `index.html` (e.g., `bg-brand-primary`, `text-brand-cta`).
- **Icons:** **ONLY** use icons from the `lucide-react` package.

### Routing

- **Library:** For any multi-page navigation, install and use `react-router-dom`.
- **Configuration:** All routes **MUST** be defined within the main `App.tsx` file to centralize routing logic.

### Data Visualization

- **Charting Library:** Continue to use `recharts` for all charts and graphs to maintain consistency with the existing Sales Performance chart.

### State Management

- **Local State:** Use React's built-in hooks (`useState`, `useReducer`) for component-level state.
- **Global State:** For simple global state that needs to be shared across components, use the `useContext` hook. Avoid introducing complex state management libraries unless the application's complexity significantly increases.

### Code Quality

- **File Structure:** Maintain the existing directory structure. Create new pages in `src/pages` and new reusable components in `src/components`.
- **TypeScript:** Use TypeScript for all new files. Define clear types and interfaces for props and data structures, placing shared types in `types.ts`.
- **Simplicity:** Keep the code simple and elegant. Do not over-engineer solutions or add unnecessary complexity.