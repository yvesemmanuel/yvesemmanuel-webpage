export class I18n {
  private static currentLanguage: string = 'en';
  private static translations: { [key: string]: any } = {};
  private static fallbackTranslations: { [key: string]: any } = {};

  static async init(defaultLanguage: string = 'en'): Promise<void> {
    // Check URL for language path
    const urlLanguage = this.getLanguageFromURL();
    
    // Priority: URL > localStorage > default
    const targetLanguage = urlLanguage || localStorage.getItem('language') || defaultLanguage;
    
    // Load fallback translations (English)
    try {
      const fallbackResponse = await fetch('/data/translations/en.json');
      this.fallbackTranslations = await fallbackResponse.json();
    } catch (error) {
      console.error('Failed to load fallback translations:', error);
    }
    
    await this.setLanguage(targetLanguage);
    
    // Set up URL handling
    this.setupURLHandling();
  }

  private static getLanguageFromURL(): string | null {
    const hash = window.location.hash;
    const search = window.location.search;
    
    // Check for language in hash like #pt or #en
    if (hash === '#pt') return 'pt-br';
    if (hash === '#en') return 'en';
    
    // Check for language in query params like ?lang=pt or ?lang=en
    const urlParams = new URLSearchParams(search);
    const langParam = urlParams.get('lang');
    if (langParam === 'pt') return 'pt-br';
    if (langParam === 'en') return 'en';
    
    return null;
  }

  private static setupURLHandling(): void {
    // Handle browser back/forward navigation
    window.addEventListener('popstate', async () => {
      const urlLanguage = this.getLanguageFromURL();
      if (urlLanguage && urlLanguage !== this.currentLanguage) {
        await this.setLanguage(urlLanguage, false); // false = don't update URL
      }
    });
  }

  static async setLanguage(language: string, updateURL: boolean = true): Promise<void> {
    try {
      const response = await fetch(`/data/translations/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load language: ${language}`);
      }
      
      this.translations = await response.json();
      this.currentLanguage = language;
      
      // Save language preference
      localStorage.setItem('language', language);
      
      // Update HTML lang attribute
      document.documentElement.lang = language.startsWith('pt') ? 'pt-BR' : 'en';
      
      // Update URL if requested
      if (updateURL) {
        this.updateURL(language);
      }
      
      // Update all translations in the DOM
      this.updateDOM();
      
      // Update language switcher buttons
      this.updateLanguageSwitcher();
      
    } catch (error) {
      console.error(`Failed to load language ${language}:`, error);
      // Fallback to English if language loading fails
      if (language !== 'en') {
        await this.setLanguage('en', updateURL);
      }
    }
  }

  private static updateURL(language: string): void {
    // Update hash to reflect language
    const newHash = language === 'pt-br' ? '#pt' : '#en';
    
    // Update URL without triggering page reload
    window.history.pushState({ language }, '', `${window.location.pathname}${newHash}`);
  }

  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  static t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations;
    
    // Navigate through the nested object
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // If translation not found, try fallback
    if (value === undefined) {
      value = this.fallbackTranslations;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    // Return the translation or the key as fallback
    return value || key;
  }

  private static updateDOM(): void {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          (element as HTMLInputElement).placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  private static updateLanguageSwitcher(): void {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
      const btnLang = button.getAttribute('data-lang');
      if (btnLang === this.currentLanguage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  static setupLanguageSwitcher(): void {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const language = button.getAttribute('data-lang');
        if (language && language !== this.currentLanguage) {
          await this.setLanguage(language);
          
          // Trigger reload of dynamic content
          const event = new CustomEvent('languageChanged', { detail: { language } });
          document.dispatchEvent(event);
        }
      });
    });
  }
}