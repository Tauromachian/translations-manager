export class TranslationsForm extends HTMLElement {
  #fields = [];
  #form;
  #hasEventListener;

  constructor() {
    super();
  }

  reset() {
    this.#form.reset();
  }

  static get observedAttributes() {
    return ["languages", "translations-set"];
  }

  onSubmit(event) {
    event.preventDefault();

    const form = event.target;

    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const jsonData = Object.fromEntries(data);

    this.dispatchEvent(
      new CustomEvent("form-submit", {
        bubbles: true,
        cancelable: true,
        detail: jsonData,
      }),
    );
  }

  handleLanguagesChange(newValue) {
    if (this.#form) {
      this.#form.remove();
    }

    this.#form = document.createElement("form");
    this.appendChild(this.#form);

    const languages = JSON.parse(newValue);

    this.#fields = languages.map((lang) => {
      return `<text-field data-value="${lang.code}" label="${lang.name}"></text-field>`;
    });

    this.#fields.unshift(
      '<text-field data-value="key" label="Key"></text-field>',
    );

    this.#form.innerHTML = `
            ${this.#fields.join("")}
            <div class="modal-actions">
                <app-button type="submit">Add Translations</app-button>
            </div>
        `;

    if (!this.#hasEventListener) {
      this.#hasEventListener = true;
      this.#form.addEventListener(
        "submit",
        this.onSubmit.bind(this),
      );
    }
  }

  handleTranslationsChange(newValue) {
    const textFields = this.querySelectorAll("text-field");

    const translations = JSON.parse(newValue);

    textFields.forEach((field) => {
      const code = field.getAttribute("data-value");

      for (const key in translations) {
        if (code === key) {
          field.value = translations[key];
        }
      }
    });
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "languages") {
      this.handleLanguagesChange.call(this, newValue);
    }

    if (name === "translations-set") {
      this.handleTranslationsChange.call(this, newValue);
    }
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    width: 100%;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    margin-top: 0.5rem;
                }
            </style>
        `;
  }
}

customElements.define("translations-form", TranslationsForm);
