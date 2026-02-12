import "./FileUpload.js";
import "./AppCheckbox.js";

export class LanguageForm extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["language"];
  }

  reset() {
    const form = this.querySelector("form");

    form.reset();
  }

  attributeChangedCallback(name, _, value) {
    if (name === "language") {
      this.setLanguageFields(JSON.parse(value));
    }
  }

  setLanguageFields(fields) {
    const form = this.querySelector("form");

    for (const key of Object.keys(fields)) {
      for (const child of form.children) {
        if (child.getAttribute(key)) {
          child.value = fields[key];
        }
      }
    }
  }

  connectedCallback() {
    this.innerHTML = `
            <form>
                <text-field label="Name" name="name" required></text-field>
                <text-field label="Code" name="code" required></text-field>

                <file-upload class="mt-1" title="Upload Translations (optional)"></file-upload>

                <div class="modal-actions">
                    <app-button type="submit">Add Language</app-button>
                </div>
            </form>
        `;

    const form = this.querySelector("form");
    const fileUpload = this.querySelector("file-upload");

    let translationsFile;
    fileUpload.addEventListener("change", (event) => {
      translationsFile = event.detail;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;

      if (!form) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);

      if (Object.keys(translationsFile ?? {}).length) {
        data["translations"] = translationsFile.data;
      }

      const submitEvent = new CustomEvent("form-submit", {
        bubbles: true,
        cancelable: true,
        detail: data,
      });

      this.dispatchEvent(submitEvent);
    });
  }
}

customElements.define("language-form", LanguageForm);
