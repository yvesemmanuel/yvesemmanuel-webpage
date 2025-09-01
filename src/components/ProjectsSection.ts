import { DataLoader } from "../data-loader";
import { GitHubAPI } from "../github-api";
import { I18n } from "../i18n";
import { Project } from "../types";

export class ProjectsSection {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    try {
      const projects = await DataLoader.loadProjects();

      // Load GitHub data for projects with GitHub URLs
      const projectsWithGitHubData = await Promise.all(
        projects.map(async (project) => {
          if (project.githubUrl) {
            const repoInfo = GitHubAPI.extractRepoInfo(project.githubUrl);
            if (repoInfo) {
              const githubData = await GitHubAPI.fetchRepository(repoInfo.owner, repoInfo.repo);
              if (githubData) {
                project.githubStats = {
                  stars: githubData.stargazers_count,
                  lastUpdate: GitHubAPI.formatDate(githubData.updated_at)
                };
              }
            }
          }
          return project;
        })
      );

      const sortedProjects = projectsWithGitHubData.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

      this.container.innerHTML = this.generateHTML(sortedProjects);
    } catch (error) {
      console.error("Error loading projects data:", error);
      this.container.innerHTML = "<p>Error loading projects data.</p>";
    }
  }

  private generateHTML(projects: Project[]): string {
    return projects.map(project => `
      <div class="project-card">
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
          ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <p class="project-description">${project.description}</p>
        
        <div class="project-tech">
          ${project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
          ).join('')}
        </div>
        
        <div class="project-links">
          ${project.githubUrl ? 
            `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              GitHub ${project.githubStats ? `(⭐${project.githubStats.stars})` : ''} →
            </a>` : ''
          }
          ${project.liveUrl ? 
            `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              Live Demo →
            </a>` : ''
          }
          ${project.reference ? 
            `<a href="${project.reference}" target="_blank" rel="noopener noreferrer" class="project-link">
              Reference →
            </a>` : ''
          }
        </div>
        
        ${project.githubStats ? 
          `<div class="github-stats">
            ${I18n.t('projects.updated')} ${project.githubStats.lastUpdate}
          </div>` : ''
        }
      </div>
    `).join('');
  }
}