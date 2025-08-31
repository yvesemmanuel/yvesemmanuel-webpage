import { I18n } from '../i18n';

export class ContactForm {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Add real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input as HTMLInputElement));
      input.addEventListener('input', () => this.clearFieldError(input as HTMLInputElement));
    });
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.textContent;
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = I18n.t('contact.sending');

      // Here you would typically send the form data to a service like Formspree
      // For now, we'll just simulate a successful submission
      await this.simulateFormSubmission();
      
      this.showSuccessMessage();
      this.form.reset();
      
    } catch (error) {
      this.showErrorMessage(I18n.t('contact.error'));
      console.error('Form submission error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  private async simulateFormSubmission(): Promise<void> {
    // Simulate API call delay
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  private validateForm(): boolean {
    const nameInput = this.form.querySelector('#name') as HTMLInputElement;
    const emailInput = this.form.querySelector('#email') as HTMLInputElement;
    const messageInput = this.form.querySelector('#message') as HTMLTextAreaElement;

    let isValid = true;

    if (!this.validateField(nameInput)) isValid = false;
    if (!this.validateField(emailInput)) isValid = false;
    if (!this.validateField(messageInput)) isValid = false;

    return isValid;
  }

  private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    this.clearFieldError(field);

    // Required field validation
    if (!value) {
      errorMessage = I18n.t('contact.validation.required');
      isValid = false;
    } 
    // Email validation
    else if (field.type === 'email' && !this.isValidEmail(value)) {
      errorMessage = I18n.t('contact.validation.email_invalid');
      isValid = false;
    }
    // Name validation (minimum length)
    else if (field.id === 'name' && value.length < 2) {
      errorMessage = I18n.t('contact.validation.name_short');
      isValid = false;
    }
    // Message validation (minimum length)
    else if (field.id === 'message' && value.length < 10) {
      errorMessage = I18n.t('contact.validation.message_short');
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement?.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentElement?.appendChild(errorElement);
  }

  private clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
    field.classList.remove('error');
    const errorMessage = field.parentElement?.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  private showSuccessMessage(): void {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = I18n.t('contact.success');
    message.style.cssText = `
      background: var(--accent-green);
      color: white;
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-4);
      text-align: center;
    `;
    
    this.form.insertBefore(message, this.form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  private showErrorMessage(message: string): void {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      background: #ef4444;
      color: white;
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-4);
      text-align: center;
    `;
    
    this.form.insertBefore(errorElement, this.form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
}