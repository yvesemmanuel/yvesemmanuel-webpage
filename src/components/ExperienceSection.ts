import { DataLoader } from '../data-loader';
import { Experience } from '../types';

export class ExperienceSection {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    try {
      const experiences = await DataLoader.loadExperience();
      this.container.innerHTML = this.generateHTML(experiences);
    } catch (error) {
      console.error('Error loading experience data:', error);
      this.container.innerHTML = '<p>Error loading experience data.</p>';
    }
  }

  private generateHTML(experiences: Experience[]): string {
    return experiences.map(exp => `
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-title">${exp.title}</h3>
            <div class="timeline-company">${exp.company}</div>
            <div class="timeline-date">${exp.period}</div>
          </div>
          <div class="timeline-description">
            <ul>
              ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
            ${exp.reference ? `<p><a href="${exp.reference}" target="_blank" rel="noopener noreferrer">View Reference →</a></p>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }
}