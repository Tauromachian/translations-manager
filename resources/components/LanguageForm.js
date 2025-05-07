export class LanguageForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <form>
                <text-field label="Name" name="name" required></text-field>
                <text-field label="Code" name="code" required></text-field>

                <div class="modal-actions">
                    <app-button type="submit">Add Language</app-button>
                </div>
            </form>
        `;

    const form = this.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;

      if (!form) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(event.target);
      const jsonData = Object.fromEntries(formData);

      const submitEvent = new CustomEvent("form-submit", {
        bubbles: true,
        cancelable: true,
        detail: jsonData,
      });

      this.dispatchEvent(submitEvent);
    });
  }
}

customElements.define("language-form", LanguageForm);
