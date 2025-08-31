var g=Object.defineProperty;var h=(o,e,t)=>e in o?g(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>h(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class s{static async init(e="en"){const r=this.getLanguageFromURL()||localStorage.getItem("language")||e;try{const a=await fetch("/data/translations/en.json");this.fallbackTranslations=await a.json()}catch(a){console.error("Failed to load fallback translations:",a)}await this.setLanguage(r),this.setupURLHandling()}static getLanguageFromURL(){const e=window.location.hash,t=window.location.search;if(e==="#pt")return"pt-br";if(e==="#en")return"en";const a=new URLSearchParams(t).get("lang");return a==="pt"?"pt-br":a==="en"?"en":null}static setupURLHandling(){window.addEventListener("popstate",async()=>{const e=this.getLanguageFromURL();e&&e!==this.currentLanguage&&await this.setLanguage(e,!1)})}static async setLanguage(e,t=!0){try{const r=await fetch(`/data/translations/${e}.json`);if(!r.ok)throw new Error(`Failed to load language: ${e}`);this.translations=await r.json(),this.currentLanguage=e,localStorage.setItem("language",e),document.documentElement.lang=e.startsWith("pt")?"pt-BR":"en",t&&this.updateURL(e),this.updateDOM(),this.updateLanguageSwitcher()}catch(r){console.error(`Failed to load language ${e}:`,r),e!=="en"&&await this.setLanguage("en",t)}}static updateURL(e){const t=e==="pt-br"?"#pt":"#en";window.history.pushState({language:e},"",`${window.location.pathname}${t}`)}static getCurrentLanguage(){return this.currentLanguage}static t(e){const t=e.split(".");let r=this.translations;for(const a of t)if(r=r==null?void 0:r[a],r===void 0)break;if(r===void 0){r=this.fallbackTranslations;for(const a of t)if(r=r==null?void 0:r[a],r===void 0)break}return r||e}static updateDOM(){document.querySelectorAll("[data-i18n]").forEach(t=>{const r=t.getAttribute("data-i18n");if(r){const a=this.t(r);t.tagName==="INPUT"||t.tagName==="TEXTAREA"?t.placeholder=a:t.textContent=a}})}static updateLanguageSwitcher(){document.querySelectorAll(".lang-btn").forEach(t=>{t.getAttribute("data-lang")===this.currentLanguage?t.classList.add("active"):t.classList.remove("active")})}static setupLanguageSwitcher(){document.querySelectorAll(".lang-btn").forEach(t=>{t.addEventListener("click",async r=>{r.preventDefault();const a=t.getAttribute("data-lang");if(a&&a!==this.currentLanguage){await this.setLanguage(a);const n=new CustomEvent("languageChanged",{detail:{language:a}});document.dispatchEvent(n)}})})}}i(s,"currentLanguage","en"),i(s,"translations",{}),i(s,"fallbackTranslations",{});class d{static async loadJSON(e){if(this.cache.has(e))return this.cache.get(e);try{const t=await fetch(e);if(!t.ok)throw new Error(`Failed to load ${e}: ${t.statusText}`);const r=await t.json();return this.cache.set(e,r),r}catch(t){throw console.error(`Error loading ${e}:`,t),t}}static async loadProfile(){return this.loadJSON("/data/profile.json")}static async loadExperience(){const t=s.getCurrentLanguage()==="pt-br"?"/data/experience-pt-br.json":"/data/experience.json";return this.loadJSON(t)}static async loadProjects(){const t=s.getCurrentLanguage()==="pt-br"?"/data/projects-pt-br.json":"/data/projects.json";return this.loadJSON(t)}static async loadSkills(){return this.loadJSON("/data/skills.json")}static async loadCertifications(){return this.loadJSON("/data/certifications.json")}static clearCache(){this.cache.clear()}}i(d,"cache",new Map);class m{constructor(e){i(this,"container");this.container=e}async render(){try{const e=await d.loadExperience();this.container.innerHTML=this.generateHTML(e)}catch(e){console.error("Error loading experience data:",e),this.container.innerHTML="<p>Error loading experience data.</p>"}}generateHTML(e){return e.map(t=>`
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-title">${t.title}</h3>
            <div class="timeline-company">${t.company}</div>
            <div class="timeline-date">${t.period}</div>
          </div>
          <div class="timeline-description">
            <ul>
              ${t.description.map(r=>`<li>${r}</li>`).join("")}
            </ul>
            ${t.reference?`<p><a href="${t.reference}" target="_blank" rel="noopener noreferrer">View Reference →</a></p>`:""}
          </div>
        </div>
      </div>
    `).join("")}}class l{static getFromCache(e){try{const t=sessionStorage.getItem(`${this.CACHE_KEY}_${e}`);if(!t)return null;const{data:r,timestamp:a}=JSON.parse(t);return Date.now()-a>this.CACHE_DURATION?(sessionStorage.removeItem(`${this.CACHE_KEY}_${e}`),null):r}catch{return null}}static setCache(e,t){try{const r={data:t,timestamp:Date.now()};sessionStorage.setItem(`${this.CACHE_KEY}_${e}`,JSON.stringify(r))}catch{}}static async fetchRepository(e,t){const r=`${e}/${t}`,a=this.getFromCache(r);if(a)return a;try{const n=await fetch(`${this.API_BASE}/repos/${e}/${t}`);if(!n.ok){if(n.status===404)return console.warn(`Repository ${e}/${t} not found`),null;throw new Error(`GitHub API error: ${n.statusText}`)}const c=await n.json();return this.setCache(r,c),c}catch(n){return console.error(`Error fetching repository ${e}/${t}:`,n),null}}static extractRepoInfo(e){try{const r=new URL(e).pathname.split("/").filter(Boolean);return r.length>=2?{owner:r[0],repo:r[1]}:null}catch{return null}}static formatDate(e){try{return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return e}}}i(l,"API_BASE","https://api.github.com"),i(l,"CACHE_KEY","github_cache"),i(l,"CACHE_DURATION",15*60*1e3);class p{constructor(e){i(this,"container");this.container=e}async render(){try{const e=await d.loadProjects(),r=(await Promise.all(e.map(async a=>{if(a.githubUrl){const n=l.extractRepoInfo(a.githubUrl);if(n){const c=await l.fetchRepository(n.owner,n.repo);c&&(a.githubStats={stars:c.stargazers_count,forks:c.forks_count,lastUpdate:l.formatDate(c.updated_at)})}}return a}))).sort((a,n)=>a.featured&&!n.featured?-1:!a.featured&&n.featured?1:0);this.container.innerHTML=this.generateHTML(r)}catch(e){console.error("Error loading projects data:",e),this.container.innerHTML="<p>Error loading projects data.</p>"}}generateHTML(e){return e.map(t=>`
      <div class="project-card">
        <div class="project-header">
          <h3 class="project-title">${t.title}</h3>
          ${t.featured?'<span class="featured-badge">Featured</span>':""}
        </div>
        <p class="project-description">${t.description}</p>
        
        <div class="project-tech">
          ${t.technologies.map(r=>`<span class="tech-tag">${r}</span>`).join("")}
        </div>
        
        <div class="project-links">
          ${t.githubUrl?`<a href="${t.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              GitHub →
            </a>`:""}
          ${t.liveUrl?`<a href="${t.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              Live Demo →
            </a>`:""}
          ${t.reference?`<a href="${t.reference}" target="_blank" rel="noopener noreferrer" class="project-link">
              Reference →
            </a>`:""}
        </div>
        
        ${t.githubStats?`<div class="github-stats">
            Updated ${t.githubStats.lastUpdate}
          </div>`:""}
      </div>
    `).join("")}}class f{constructor(e){i(this,"container");this.container=e}async render(){try{const e=await d.loadSkills();this.container.innerHTML=this.generateHTML(e)}catch(e){console.error("Error loading skills data:",e),this.container.innerHTML="<p>Error loading skills data.</p>"}}generateHTML(e){return`
      <div class="skills-intro">
        <p>${s.t("skills.intro")}</p>
      </div>
      <div class="skills-flow">
        ${Object.entries(e).map(([t,r])=>`
          <div class="skill-group">
            <h3 class="skill-group-title">${t}</h3>
            <div class="skill-tags">
              ${r.map(a=>`<span class="skill-tag ${this.getSkillLevel(a,t)}">${a}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="skills-highlight">
        <h3>${s.t("skills.expertise_title")}</h3>
        <div class="expertise-grid">
          <div class="expertise-item">
            <strong>${s.t("skills.cloud_platforms")}</strong> ${s.t("skills.cloud_desc")}
          </div>
          <div class="expertise-item">
            <strong>${s.t("skills.ml_production")}</strong> ${s.t("skills.ml_production_desc")}
          </div>
          <div class="expertise-item">
            <strong>${s.t("skills.ai_engineering")}</strong> ${s.t("skills.ai_engineering_desc")}
          </div>
          <div class="expertise-item">
            <strong>${s.t("skills.data_engineering")}</strong> ${s.t("skills.data_engineering_desc")}
          </div>
        </div>
      </div>
    `}getSkillLevel(e,t){const r=["AWS","Python","Docker","MLflow","FastAPI","Scikit-learn","Apache Airflow","SQL","Git","AWS Lambda","AWS S3"],a=["Kubernetes","TensorFlow","AWS SageMaker AI","Apache Spark","AWS RDS","LangChain","OpenAI API"];return r.some(n=>e.includes(n))?"expert":a.some(n=>e.includes(n))?"advanced":"proficient"}}class v{constructor(e){i(this,"form");this.form=e,this.init()}init(){this.form.addEventListener("submit",this.handleSubmit.bind(this)),this.form.querySelectorAll("input, textarea").forEach(t=>{t.addEventListener("blur",()=>this.validateField(t)),t.addEventListener("input",()=>this.clearFieldError(t))})}async handleSubmit(e){if(e.preventDefault(),!this.validateForm())return;const t=this.form.querySelector('button[type="submit"]'),r=t.textContent;try{t.disabled=!0,t.textContent=s.t("contact.sending"),await this.simulateFormSubmission(),this.showSuccessMessage(),this.form.reset()}catch(a){this.showErrorMessage(s.t("contact.error")),console.error("Form submission error:",a)}finally{t.disabled=!1,t.textContent=r}}async simulateFormSubmission(){return new Promise(e=>setTimeout(e,1e3))}validateForm(){const e=this.form.querySelector("#name"),t=this.form.querySelector("#email"),r=this.form.querySelector("#message");let a=!0;return this.validateField(e)||(a=!1),this.validateField(t)||(a=!1),this.validateField(r)||(a=!1),a}validateField(e){const t=e.value.trim();let r=!0,a="";return this.clearFieldError(e),t?e.type==="email"&&!this.isValidEmail(t)?(a=s.t("contact.validation.email_invalid"),r=!1):e.id==="name"&&t.length<2?(a=s.t("contact.validation.name_short"),r=!1):e.id==="message"&&t.length<10&&(a=s.t("contact.validation.message_short"),r=!1):(a=s.t("contact.validation.required"),r=!1),r||this.showFieldError(e,a),r}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}showFieldError(e,t){var n,c;e.classList.add("error");const r=(n=e.parentElement)==null?void 0:n.querySelector(".error-message");r&&r.remove();const a=document.createElement("div");a.className="error-message",a.textContent=t,(c=e.parentElement)==null||c.appendChild(a)}clearFieldError(e){var r;e.classList.remove("error");const t=(r=e.parentElement)==null?void 0:r.querySelector(".error-message");t&&t.remove()}showSuccessMessage(){const e=document.createElement("div");e.className="success-message",e.textContent=s.t("contact.success"),e.style.cssText=`
      background: var(--accent-green);
      color: white;
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-4);
      text-align: center;
    `,this.form.insertBefore(e,this.form.firstChild),setTimeout(()=>{e.remove()},5e3)}showErrorMessage(e){const t=document.createElement("div");t.className="error-message",t.textContent=e,t.style.cssText=`
      background: #ef4444;
      color: white;
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-4);
      text-align: center;
    `,this.form.insertBefore(t,this.form.firstChild),setTimeout(()=>{t.remove()},5e3)}}class S{constructor(){i(this,"experienceSection",null);i(this,"projectsSection",null);i(this,"skillsSection",null);i(this,"contactForm",null);this.init()}async init(){await s.init(),this.initializeComponents(),this.setupNavigation(),this.setupLanguageSwitching(),await this.loadContent()}initializeComponents(){const e=document.getElementById("experience-timeline"),t=document.getElementById("projects-grid"),r=document.getElementById("skills-grid"),a=document.getElementById("contact-form");e&&(this.experienceSection=new m(e)),t&&(this.projectsSection=new p(t)),r&&(this.skillsSection=new f(r)),a&&(this.contactForm=new v(a))}setupNavigation(){document.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const a=t.getAttribute("href");if(a&&a.startsWith("#")){const n=document.querySelector(a);n&&n.scrollIntoView({behavior:"smooth",block:"start"})}})}),window.addEventListener("scroll",this.updateActiveNavLink.bind(this)),window.addEventListener("scroll",this.handleNavScroll.bind(this))}updateActiveNavLink(){const e=document.querySelectorAll("section[id]"),t=document.querySelectorAll(".nav-link");let r="";e.forEach(a=>{const n=a.getBoundingClientRect();n.top<=100&&n.bottom>=100&&(r=a.id)}),t.forEach(a=>{a.classList.remove("active"),a.getAttribute("href")===`#${r}`&&a.classList.add("active")})}handleNavScroll(){const e=document.querySelector(".nav");window.scrollY>100?(e.style.background="rgba(255, 255, 255, 0.98)",e.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"):(e.style.background="rgba(255, 255, 255, 0.95)",e.style.boxShadow="none")}async loadContent(){var e,t,r;try{this.showLoadingState(),await Promise.all([(e=this.experienceSection)==null?void 0:e.render(),(t=this.projectsSection)==null?void 0:t.render(),(r=this.skillsSection)==null?void 0:r.render()]),this.hideLoadingState()}catch(a){console.error("Error loading portfolio content:",a),this.showErrorState()}}setupLanguageSwitching(){s.setupLanguageSwitcher(),document.addEventListener("languageChanged",async()=>{await this.loadContent()})}showLoadingState(){["#experience-timeline","#projects-grid","#skills-grid"].forEach(t=>{const r=document.querySelector(t);r&&(r.innerHTML=`<div class="loading">${s.t("common.loading")}</div>`)})}hideLoadingState(){document.querySelectorAll(".loading").forEach(t=>t.remove())}showErrorState(){["#experience-timeline","#projects-grid","#skills-grid"].forEach(t=>{const r=document.querySelector(t);r&&r.innerHTML.includes("Loading...")&&(r.innerHTML='<div class="error">Error loading content. Please refresh the page.</div>')})}}document.addEventListener("DOMContentLoaded",()=>{new S});const y=`
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
`,u=document.createElement("style");u.textContent=y;document.head.appendChild(u);
