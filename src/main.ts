import './style.css';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactForm } from './components/ContactForm';
import { I18n } from './i18n';

class PortfolioApp {
  private experienceSection: ExperienceSection | null = null;
  private projectsSection: ProjectsSection | null = null;
  private skillsSection: SkillsSection | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private contactForm: ContactForm | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Initialize translations first
    await I18n.init();
    
    this.initializeComponents();
    this.setupNavigation();
    this.setupLanguageSwitching();
    await this.loadContent();
  }

  private initializeComponents(): void {
    // Initialize sections
    const experienceContainer = document.getElementById('experience-timeline');
    const projectsContainer = document.getElementById('projects-grid');
    const skillsContainer = document.getElementById('skills-grid');
    const contactFormElement = document.getElementById('contact-form') as HTMLFormElement;

    if (experienceContainer) {
      this.experienceSection = new ExperienceSection(experienceContainer);
    }

    if (projectsContainer) {
      this.projectsSection = new ProjectsSection(projectsContainer);
    }

    if (skillsContainer) {
      this.skillsSection = new SkillsSection(skillsContainer);
    }

    if (contactFormElement) {
      this.contactForm = new ContactForm(contactFormElement);
    }
  }

  private setupNavigation(): void {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Update navigation on scroll
    window.addEventListener('scroll', this.updateActiveNavLink.bind(this));

    // Add scroll effect to navigation bar
    window.addEventListener('scroll', this.handleNavScroll.bind(this));
  }

  private updateActiveNavLink(): void {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  private handleNavScroll(): void {
    const nav = document.querySelector('.nav') as HTMLElement;
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = 'none';
    }
  }

  private async loadContent(): Promise<void> {
    try {
      // Show loading state
      this.showLoadingState();

      // Load all sections in parallel for better performance
      await Promise.all([
        this.experienceSection?.render(),
        this.projectsSection?.render(),
        this.skillsSection?.render()
      ]);

      // Hide loading state
      this.hideLoadingState();

    } catch (error) {
      console.error('Error loading portfolio content:', error);
      this.showErrorState();
    }
  }

  private setupLanguageSwitching(): void {
    // Set up language switcher buttons
    I18n.setupLanguageSwitcher();
    
    // Listen for language change events
    document.addEventListener('languageChanged', async () => {
      await this.loadContent();
    });
  }

  private showLoadingState(): void {
    const sections = [
      '#experience-timeline',
      '#projects-grid',
      '#skills-grid'
    ];

    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = `<div class="loading">${I18n.t('common.loading')}</div>`;
      }
    });
  }

  private hideLoadingState(): void {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => element.remove());
  }

  private showErrorState(): void {
    const sections = [
      '#experience-timeline',
      '#projects-grid',
      '#skills-grid'
    ];

    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element && element.innerHTML.includes('Loading...')) {
        element.innerHTML = '<div class="error">Error loading content. Please refresh the page.</div>';
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Add some additional CSS for loading and error states
const additionalStyles = `
  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  .error {
    text-align: center;
    padding: 2rem;
    color: #ef4444;
    background: #fef2f2;
    border-radius: var(--radius-lg);
    border: 1px solid #fecaca;
  }

  .nav-link.active {
    color: var(--primary-blue);
  }

  .nav-link.active::after {
    width: 100%;
  }

  .form-group input.error,
  .form-group textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .error-message {
    color: #ef4444;
    font-size: var(--text-sm);
    margin-top: var(--spacing-1);
  }

  .featured-badge {
    background: var(--accent-green);
    color: white;
    font-size: var(--text-xs);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: var(--spacing-2);
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Inject additional styles
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);