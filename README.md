# Yves Emmanuel - Machine Learning Engineer Portfolio

A modern, responsive portfolio website showcasing my experience in Machine Learning Engineering, MLOps, and AI solutions.

**Live Website**: [yvesemmanuel.github.io](https://yvesemmanuel.github.io/)

## 🚀 Features

- **Modern Tech Stack**: Built with Vite + TypeScript for optimal performance
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Dynamic Content**: JSON-based content management for easy updates
- **GitHub Integration**: Live repository statistics via GitHub API
- **Interactive Elements**: Smooth scrolling, form validation, and hover effects
- **Automated Deployment**: GitHub Actions for continuous deployment to GitHub Pages

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Languages**: TypeScript, HTML5, CSS3
- **Content**: JSON files for data management
- **Deployment**: GitHub Pages with GitHub Actions
- **APIs**: GitHub API for live repository data

## 📁 Project Structure

```
├── public/
│   └── data/           # JSON content files
├── src/
│   ├── components/     # TypeScript component modules
│   ├── types/          # TypeScript type definitions
│   ├── data-loader.ts  # Data loading utilities
│   ├── github-api.ts   # GitHub API integration
│   ├── main.ts         # Application entry point
│   └── style.css       # Global styles and design system
├── .github/workflows/  # GitHub Actions deployment
└── dist/               # Build output (auto-generated)
```

## 🎯 Key Sections

- **About**: Professional summary and contact information
- **Experience**: Timeline of professional roles with detailed achievements
- **Projects**: Showcase of technical projects with GitHub integration
- **Skills**: Technical skills organized by category
- **Contact**: Form with client-side validation

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Lint and fix code
npm run lint:fix
```

## 📈 Performance Features

- Optimized asset bundling with Vite
- Lazy loading and code splitting
- Efficient caching strategies
- Responsive images and modern CSS
- Accessibility compliance

## 🔧 Content Management

All portfolio content is stored in JSON files in the `public/data/` directory:
- `profile.json` - Personal information and bio
- `experience.json` - Professional experience
- `projects.json` - Project portfolio
- `skills.json` - Technical skills by category
- `certifications.json` - Professional certifications

## 📱 Responsive Design

The portfolio is fully responsive and tested across:
- Desktop browsers (Chrome, Firefox, Safari)
- Tablet devices
- Mobile devices
- Various screen sizes and orientations

## 📝 License

This project is open source and available under the MIT License.