import { Service } from "../types";
import { I18n } from "../i18n";

export class ServicesSection {
  constructor(private container: HTMLElement) {}

  async render(): Promise<void> {
    try {
      this.container.innerHTML = `<div class="loading">${I18n.t("common.loading")}</div>`;

      const services = await this.loadServices();
      this.container.innerHTML = this.generateServicesHTML(services);
    } catch (error) {
      console.error("Error loading services:", error);
      this.container.innerHTML = `
        <div class="error">
          ${I18n.t("common.error")}
        </div>
      `;
    }
  }

  private async loadServices(): Promise<Service[]> {
    const currentLang = I18n.getCurrentLanguage();
    
    if (currentLang === 'pt-br') {
      return [
        {
          id: "mlops",
          title: "Automação de MLOps",
          icon: "🔄",
          description: "Implemento pipelines completos de Machine Learning, desde o treinamento até a produção, com monitoramento contínuo e automação inteligente.",
          features: [
            "CI/CD para modelos de ML",
            "Monitoramento de drift e performance",
            "Orquestração de pipelines",
            "Versionamento de modelos",
            "Deploy automatizado"
          ],
          ctaText: "Automatizar ML Pipeline"
        },
        {
          id: "ai-engineering",
          title: "Engenharia de IA",
          icon: "🤖",
          description: "Desenvolvimento de soluções de IA escaláveis e robustas, desde prototipagem até arquiteturas de produção de alta performance.",
          features: [
            "Arquiteturas de IA escaláveis",
            "Otimização de modelos",
            "APIs de IA robustas",
            "Processamento em tempo real",
            "Integração de LLMs"
          ],
          ctaText: "Construir Solução de IA"
        },
        {
          id: "cloud-ml",
          title: "Soluções ML em Nuvem",
          icon: "☁️",
          description: "Especialista em plataformas de nuvem (AWS, GCP) para treinar, servir e escalar modelos de Machine Learning com eficiência.",
          features: [
            "Infraestrutura como código",
            "Serverless ML serving",
            "Auto-scaling inteligente",
            "Otimização de custos",
            "Multi-cloud strategies"
          ],
          ctaText: "Migrar para Nuvem"
        }
      ];
    } else {
      return [
        {
          id: "mlops",
          title: "MLOps & Pipeline Automation",
          icon: "🔄",
          description: "I implement complete Machine Learning pipelines, from training to production, with continuous monitoring and intelligent automation.",
          features: [
            "CI/CD for ML models",
            "Drift and performance monitoring",
            "Pipeline orchestration",
            "Model versioning",
            "Automated deployment"
          ],
          ctaText: "Automate ML Pipeline"
        },
        {
          id: "ai-engineering",
          title: "AI Engineering",
          icon: "🤖",
          description: "Development of scalable and robust AI solutions, from prototyping to high-performance production architectures.",
          features: [
            "Scalable AI architectures",
            "Model optimization",
            "Robust AI APIs",
            "Real-time processing",
            "LLM integration"
          ],
          ctaText: "Build AI Solution"
        },
        {
          id: "cloud-ml",
          title: "Cloud ML Solutions",
          icon: "☁️",
          description: "Expert in cloud platforms (AWS, GCP) to train, serve, and scale Machine Learning models efficiently.",
          features: [
            "Infrastructure as code",
            "Serverless ML serving",
            "Intelligent auto-scaling",
            "Cost optimization",
            "Multi-cloud strategies"
          ],
          ctaText: "Migrate to Cloud"
        }
      ];
    }
  }

  private generateServicesHTML(services: Service[]): string {
    return services.map(service => `
      <div class="service-card">
        <div class="service-icon">${service.icon}</div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-description">${service.description}</p>
        <ul class="service-features">
          ${service.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <div class="service-cta">
          <a href="#contact" class="btn btn-primary">${service.ctaText}</a>
        </div>
      </div>
    `).join('');
  }
}