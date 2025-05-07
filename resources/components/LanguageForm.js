export class LanguageForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    margin-top: 0.5rem;
                }
            </style>

            <form>
                <text-field label="Name" name="name"></text-field>
                <text-field label="Code" name="code"></text-field>

                <div class="modal-actions">
                    <app-button type="submit">Add Language</app-button>
                </div>
            </form>
        `;

    const form = this.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

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
