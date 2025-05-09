export class TranslationsForm extends HTMLElement {
  #fields = [];
  #form;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["languages"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "languages") {
      if (this.#form) {
        this.#form.remove();
      }

      this.#form = document.createElement("form");
      this.appendChild(this.#form);

      this.#fields = JSON.parse(newValue)
        .map(
          (lang) => `
                            <text-field label="${lang.name}"></text-field>
                        `,
        )
        .join("");

      this.#form.innerHTML = `
            ${this.#fields}
            <div class="modal-actions">
                <app-button>Add Translations</app-button>
            </div>
        `;
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
