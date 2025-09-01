import { Profile, Experience, Project, Skills, Certification } from "./types";
import { I18n } from "./i18n";

export class DataLoader {
  private static cache = new Map<string, any>();

  static async loadJSON<T>(path: string): Promise<T> {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.statusText}`);
      }
      const data = await response.json();
      this.cache.set(path, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
      throw error;
    }
  }

  static async loadProfile(): Promise<Profile> {
    return this.loadJSON<Profile>("/data/profile.json");
  }

  static async loadExperience(): Promise<Experience[]> {
    const language = I18n.getCurrentLanguage();
    const filename = language === "pt-br" ? "/data/experience-pt-br.json" : "/data/experience.json";
    return this.loadJSON<Experience[]>(filename);
  }

  static async loadProjects(): Promise<Project[]> {
    const language = I18n.getCurrentLanguage();
    const filename = language === "pt-br" ? "/data/projects-pt-br.json" : "/data/projects.json";
    return this.loadJSON<Project[]>(filename);
  }

  static async loadSkills(): Promise<Skills> {
    return this.loadJSON<Skills>("/data/skills.json");
  }

  static async loadCertifications(): Promise<Certification[]> {
    return this.loadJSON<Certification[]>("/data/certifications.json");
  }

  static clearCache(): void {
    this.cache.clear();
  }
}