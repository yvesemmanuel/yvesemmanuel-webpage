import { DataLoader } from "../data-loader";
import { Skills } from "../types";
import { I18n } from "../i18n";

export class SkillsSection {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    try {
      const skills = await DataLoader.loadSkills();
      this.container.innerHTML = this.generateHTML(skills);
    } catch (error) {
      console.error("Error loading skills data:", error);
      this.container.innerHTML = "<p>Error loading skills data.</p>";
    }
  }

  private generateHTML(skills: Skills): string {
    return `
      <div class="skills-intro">
        <p>${I18n.t("skills.intro")}</p>
      </div>
      <div class="skills-flow">
        ${Object.entries(skills).map(([category, skillList]) => `
          <div class="skill-group">
            <h3 class="skill-group-title">${category}</h3>
            <div class="skill-tags">
              ${skillList.map(skill => 
                `<span class="skill-tag ${this.getSkillLevel(skill)}">${skill}</span>`
              ).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="skills-highlight">
        <h3>${I18n.t("skills.expertise_title")}</h3>
        <div class="expertise-grid">
          <div class="expertise-item">
            <strong>${I18n.t("skills.cloud_platforms")}</strong> ${I18n.t("skills.cloud_desc")}
          </div>
          <div class="expertise-item">
            <strong>${I18n.t("skills.ml_production")}</strong> ${I18n.t("skills.ml_production_desc")}
          </div>
          <div class="expertise-item">
            <strong>${I18n.t("skills.ai_engineering")}</strong> ${I18n.t("skills.ai_engineering_desc")}
          </div>
          <div class="expertise-item">
            <strong>${I18n.t("skills.data_engineering")}</strong> ${I18n.t("skills.data_engineering_desc")}
          </div>
        </div>
      </div>
    `;
  }

  private getSkillLevel(skill: string): string {
    // Highlight key skills based on experience
    const expertSkills = [
      "AWS", "Python", "Docker", "MLflow", "FastAPI", "Scikit-learn", 
      "Apache Airflow", "SQL", "Git", "AWS Lambda", "AWS S3"
    ];
    
    const advancedSkills = [
      "Kubernetes", "TensorFlow", "AWS SageMaker AI", "Apache Spark",
      "AWS RDS", "LangChain", "OpenAI API"
    ];

    if (expertSkills.some(expert => skill.includes(expert))) {
      return "expert";
    } else if (advancedSkills.some(advanced => skill.includes(advanced))) {
      return "advanced";
    }
    return "proficient";
  }
}