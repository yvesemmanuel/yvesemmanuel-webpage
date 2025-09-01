import { GitHubRepo } from "./types";

export class GitHubAPI {
  private static readonly API_BASE = "https://api.github.com";
  private static readonly CACHE_KEY = "github_cache";
  private static readonly CACHE_DURATION = 15 * 60 * 1000; 

  private static getFromCache(key: string): any | null {
    try {
      const cached = sessionStorage.getItem(`${this.CACHE_KEY}_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        sessionStorage.removeItem(`${this.CACHE_KEY}_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  private static setCache(key: string, data: any): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`${this.CACHE_KEY}_${key}`, JSON.stringify(cacheData));
    } catch {

    }
  }

  static async fetchRepository(owner: string, repo: string): Promise<GitHubRepo | null> {
    const cacheKey = `${owner}/${repo}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.API_BASE}/repos/${owner}/${repo}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Repository ${owner}/${repo} not found`);
          return null;
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data: GitHubRepo = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching repository ${owner}/${repo}:`, error);
      return null;
    }
  }

  static extractRepoInfo(githubUrl: string): { owner: string; repo: string } | null {
    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (pathParts.length >= 2) {
        return {
          owner: pathParts[0],
          repo: pathParts[1]
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  }
}