export class FormField extends HTMLElement {
  #internals = null;
  #wrappedField = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.#internals = this.attachInternals();
    this.#wrappedField = null;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ["label", "name"];
  }

  get value() {
    return this.#wrappedField.value;
  }

  set value(value) {
    this.#wrappedField.value = value;
    this.#internals.setFormValue(value);
  }

  handleLabel() {
    const label = this.getAttribute("label");

    const labelEl = this.root.querySelector("label");

    if (label) {
      labelEl.textContent = label;
    } else {
      labelEl.style.display = "none";
    }
  }

  handleWrappedField() {
    this.#wrappedField = this.getWrappedField();

    if (!this.#wrappedField) return;

    this.#wrappedField.classList.add("wrapped-field");
    this.root.appendChild(this.#wrappedField);

    const name = this.getAttribute("name");
    this.#wrappedField.setAttribute("name", name);

    this.#wrappedField.addEventListener("input", () => {
      this.#internals.setFormValue(this.#wrappedField.value);
    });
  }

  formAssociatedCallback(form) {
    form.addEventListener("reset", () => {
      this.value = "";
    });
  }

  getWrappedField() {
    throw new Error("This method needs to be implemented");
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
          <style>
              :host {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  width: 100%;
              }

              .wrapped-field {
                  padding: 10px 12px;
                  font-family: Arial, sans-serif;
                  font-size: 1em;
                  color: #333;
                  background: #fff;
                  border: 1px solid var(--gray);
                  border-radius: 4px;
                  transition: border-color 0.2s ease, box-shadow 0.2s ease;
              }

              .wrapped-field:focus {
                  outline: none;
                  border-color: var(--primary-10);
                  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
              }
          </style>

          <label></label>
      `;

    this.root.appendChild(template.content.cloneNode(true));

    this.handleLabel();
    this.handleWrappedField();
  }
}
