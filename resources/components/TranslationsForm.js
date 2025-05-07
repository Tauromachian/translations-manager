export class TranslationsForm extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["languages"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "languages") {
      const formWrapper = this.querySelector("div");
      const form = document.createElement("form");
      formWrapper.appendChild(form);

      const fields = JSON.parse(newValue)
        .map(
          (lang) => `
                            <text-field label="${lang.name}"></text-field>
                        `,
        )
        .join("");

      form.innerHTML = `
            ${fields}
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

            <div></div>
        `;
  }
}

customElements.define("translations-form", TranslationsForm);
