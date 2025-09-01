import { I18n } from "../i18n";

export class ContactForm {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.init();
  }

  private init(): void {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      input.addEventListener("blur", () => this.validateField(input as HTMLInputElement));
      input.addEventListener("input", () => this.clearFieldError(input as HTMLInputElement));
    });
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.sendWhatsAppMessage();
  }

  private sendWhatsAppMessage(): void {
    const formData = new (window as any).FormData(this.form);
    const message = formData.get("message") as string;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5581987298820&text=${encodedMessage}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, "_blank");
    
    this.showSuccessMessage();
    
    setTimeout(() => {
      this.form.reset();
    }, 1000);
  }

  private validateForm(): boolean {
    const messageInput = this.form.querySelector("#message") as HTMLTextAreaElement;
    return this.validateField(messageInput);
  }

  private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    this.clearFieldError(field);

    if (!value) {
      errorMessage = I18n.t("contact.validation.required");
      isValid = false;
    } 
    else if (field.id === "message" && value.length < 10) {
      errorMessage = I18n.t("contact.validation.message_short");
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }


  private showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    field.classList.add("error");
    
    const existingError = field.parentElement?.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentElement?.appendChild(errorElement);
  }

  private clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
    field.classList.remove("error");
    const errorMessage = field.parentElement?.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  private showSuccessMessage(): void {
    const message = document.createElement("div");
    message.className = "success-message";
    message.textContent = I18n.t("contact.whatsapp.success");
    message.style.cssText = `
      background: var(--accent-green);
      color: white;
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-4);
      text-align: center;
    `;
    
    this.form.insertBefore(message, this.form.firstChild);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

}