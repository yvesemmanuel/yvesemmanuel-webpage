# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern TypeScript-based **marketing-focused portfolio website** built with Vite. It's a single-page application designed as a professional marketing tool for ML/AI consulting services, featuring a Machine Learning Engineer's expertise with complete bilingual support (English/Portuguese).

**Marketing Focus**: The website is optimized for conversion, positioning Emmanuel as a premium ML/AI consultant with proven experience at Globo and Neurotech [B3]. The design emphasizes business value over technical details.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (runs tsc && vite build)
npm run preview      # Preview production build
npm run lint         # Lint TypeScript code with ESLint
npm run lint:fix     # Lint and auto-fix issues
./deploy.sh          # Build and deploy to GitHub Pages

# Installation
npm install          # Install dependencies
```

## Architecture Overview

### Core Structure
- **Entry Point**: `src/main.ts` - Initializes the PortfolioApp class and manages the application lifecycle
- **Component System**: Modular TypeScript classes in `src/components/`:
  - `ServicesSection.ts` - **NEW**: Marketing-focused services showcase with language-aware content
  - `ExperienceSection.ts` - Professional experience timeline
  - `ProjectsSection.ts` - Featured projects portfolio
  - `ContactForm.ts` - Enhanced contact form with multiple contact options
  - ~~`SkillsSection.ts`~~ - **REMOVED**: Replaced with services for better marketing flow
- **Data Management**: JSON-based content system in `public/data/` with caching via `src/data-loader.ts`
- **Internationalization**: `src/i18n.ts` handles bilingual content switching with URL and localStorage persistence
- **GitHub Integration**: `src/github-api.ts` fetches live repository statistics
- **Professional Image**: `/public/data/me_full.png` - Professional photo integrated in About section

### Data Flow
1. App initialization loads translations first (`I18n.init()`)
2. Components are instantiated with their respective DOM containers
3. Content is loaded in parallel using `DataLoader` which caches JSON responses
4. Language switching triggers content reloading with appropriate locale files

### Key Components
- **PortfolioApp** (`src/main.ts:8`): Main application controller managing navigation, components, and content loading
- **ServicesSection** (`src/components/ServicesSection.ts`): **NEW** - Language-aware services component showcasing MLOps, AI Engineering, and Cloud ML solutions
- **DataLoader** (`src/data-loader.ts:4`): Centralized data fetching with caching and language-aware file loading
- **I18n** (`src/i18n.ts`): Translation management system with URL hash (#pt/#en) and fallback support

### Marketing-Focused Content Structure
**New section order optimized for conversion:**
1. **Hero** - Service-oriented headline and compelling CTAs
2. **About** - Professional narrative with Globo/Neurotech social proof + photo
3. **Services** - Three core service offerings with clear value propositions
4. **Featured Projects** - Technical credibility and expertise demonstration
5. **Professional Experience** - Career timeline and achievements
6. **Contact** - Multiple contact methods with compelling CTAs

### Content Architecture
Data is organized by type and language:
- Base data: `profile.json`, `skills.json`, `certifications.json`
- Localized data: `experience.json` vs `experience-pt-br.json`, `projects.json` vs `projects-pt-br.json`
- Translations: `translations/en.json` and `translations/pt-br.json`

### TypeScript Types
All data structures are strictly typed in `src/types/index.ts` including:
- `Profile`, `Experience`, `Project`, `Skills`, `Certification` interfaces
- **NEW**: `Service` interface for the ServicesSection component

## Component Pattern
All components follow a consistent initialization pattern:
1. Constructor takes a DOM container element
2. Async `render()` method loads data via DataLoader
3. Components handle their own loading and error states
4. Language changes trigger re-rendering through custom events

## Language System
- URLs support hash-based language switching (#pt for Portuguese, #en for English)
- Language preference is stored in localStorage
- Fallback translations ensure no missing strings
- DOM elements with `data-i18n` attributes are automatically updated

### CRITICAL: Bilingual Content Management
⚠️ **ALWAYS REMEMBER**: When adding new content, UI elements, or sections:
1. **Check both translation files**: `public/data/translations/en.json` AND `public/data/translations/pt-br.json`
2. **Add missing translation keys** to both files with appropriate content
3. **Use `data-i18n` attributes** for all translatable text in HTML
4. **Test language switching** to ensure no "key.missing" text appears
5. **Update navigation keys** when adding new sections (nav.newSection)

Common translation keys that need updates:
- `nav.*` - Navigation items (includes `nav.services`)
- `hero.*` - Hero section content (service-oriented messaging)
- `about.*` - About section content (includes `about.subtitle`, `about.mission`)
- `services.*` - **NEW** Services section content (`services.title`, `services.intro`)
- `projects.*` - Projects section content (includes `projects.intro`)
- `contact.*` - **ENHANCED** Contact section content (includes contact cards: `contact.card1_title`, `contact.card1_desc`, `contact.card1_btn`, etc.)

### Translation Key Examples:
```json
// Contact cards example
"contact": {
  "card1_title": "📞 Quick Conversations",
  "card1_desc": "For quick questions or an initial conversation", 
  "card1_btn": "WhatsApp",
  "card2_title": "💼 Professional Projects",
  // ... etc
}
```

## Deployment

The project uses GitHub Actions for automated deployment to GitHub Pages. The `deploy.sh` script provides a local build with deployment instructions.

## Development Notes

### Design System
- **Professional Color Palette**: Deep navy (#0f172a), bright blue (#1e40af), vibrant orange (#ea580c) for CTAs
- **Marketing-Focused**: Conversion-optimized layout with compelling CTAs and social proof
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Professional Photography**: User's professional image integrated in About section

### Technical Implementation
- All components follow a consistent pattern of container-based initialization and async rendering
- **Enhanced Error Handling**: Loading states, error boundaries, and bilingual error messages
- Modern CSS with CSS custom properties and responsive design
- GitHub API integration provides live repository statistics for projects
- **Enhanced Contact System**: Multiple contact methods (WhatsApp, LinkedIn, Email) with clear purposes
- Form validation is handled client-side with custom error messaging
- ESLint is configured with TypeScript rules for code quality and consistency
- Console statements are allowed but generate warnings to encourage proper logging practices

### Services Component Special Notes
- `ServicesSection.ts` uses language-aware content loading via `I18n.getCurrentLanguage()`
- Services data is hardcoded in the component but returns different content based on language
- Future improvement: Move services data to JSON files for easier management

### SEO Optimization
- Service-oriented meta tags and structured data
- Marketing-focused titles and descriptions
- Open Graph and Twitter Card optimization for social sharing