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
    return ["languages"];
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

    this.#fields = JSON.parse(newValue)
      .map(
        (lang) => `
                            <text-field data-code="${lang.code}" label="${lang.name}"></text-field>
                        `,
      )
      .join("");

    this.#form.innerHTML = `
            ${this.#fields}
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

  attributeChangedCallback(name, _, newValue) {
    if (name === "languages") {
      this.handleLanguagesChange.call(this, newValue);
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
