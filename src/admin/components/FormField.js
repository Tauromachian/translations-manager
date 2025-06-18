import "iconify-icon";

export class FormField extends HTMLElement {
  #internals;
  #wrappedField;

  static formAssociated = true;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open", delegatesFocus: true });

    this.#internals = this.attachInternals();
    this.#wrappedField = null;
  }

  static get observedAttributes() {
    return ["label", "name", "required", "apppend-inner-icon", "disabled"];
  }

  get value() {
    return this.#wrappedField.value;
  }

  set value(value) {
    this.#wrappedField.value = value;
    this.#internals.setFormValue(value);
    this.updateValidity();
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

  updateValidity() {
    this.#internals.setValidity(
      this.#wrappedField.validity,
    );
  }

  handleWrappedField() {
    this.addElement();
    this.handleAttrs();
    this.handleEvents();
  }

  addElement() {
    this.#wrappedField = this.getWrappedField();

    if (!this.#wrappedField) return;

    this.#wrappedField.classList.add("wrapped-field");

    const wrapper = this.root.querySelector(".wrapper");

    if (!wrapper) return;

    wrapper.appendChild(this.#wrappedField);
    this.handleIcons();
  }

  handleAttrs() {
    this.handleLabel();

    const required = this.getAttribute("required");
    if (typeof required === "string" || required) {
      this.#wrappedField.setAttribute("required", true);
    }

    const name = this.getAttribute("name");
    this.#wrappedField.setAttribute("name", name);

    const disabled = this.getAttribute("disabled");
    if (typeof disabled === "string" || disabled) {
      this.#wrappedField.setAttribute("disabled", disabled);
    }
  }

  handleEvents() {
    this.#wrappedField.addEventListener("input", () => {
      this.updateValidity();

      this.#internals.setFormValue(this.#wrappedField.value);
    });

    this.#wrappedField.addEventListener("keydown", (event) => {
      this.getKeydownEvent(event, this.#internals, this.#wrappedField);
    });
  }

  handleIcons() {
    const iconString = this.getAttribute("append-inner-icon");

    if (!iconString) return;

    if (typeof iconString !== "string") {
      throw new Error("Iconify icon is used. Icon should be a string");
    }

    const icon = document.createElement("iconify-icon");
    icon.setAttribute("icon", iconString);
    icon.setAttribute("width", 24);
    icon.setAttribute("height", 24);
    icon.classList += "append-inner-icon";

    icon.addEventListener("click", () => {
      this.#wrappedField.focus();
    });

    const wrapper = this.root.querySelector(".wrapper");

    wrapper.appendChild(icon);
  }

  formAssociatedCallback(form) {
    form.addEventListener("reset", () => {
      this.value = "";
    });
  }

  getWrappedField() {
    throw new Error("This method needs to be implemented");
  }

  getKeydownEvent() {
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

                  --padding-x: 12px;
                  --border: 1px;
              }

              .wrapper {
                  position: relative;
                  display: inline-block;
              }

              .wrapped-field {
                  padding: 10px var(--padding-x);
                  font-family: Arial, sans-serif;
                  font-size: 1em;
                  color: #333;
                  background: #fff;
                  border: var(--border) solid var(--gray);
                  border-radius: 4px;
                  transition: border-color 0.2s ease, box-shadow 0.2s ease;
                  width: calc(100% - (var(--padding-x) + var(--border)) * 2);
              }

              .wrapped-field:user-invalid {
                  border-color: var(--danger);
              }

              .wrapped-field:focus {
                  outline: none;
                  border-color: var(--primary-10);
                  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
              }

              .append-inner-icon {
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  display: flex;
                  align-items: center;
                  cursor: text;
              }
          </style>

          <label></label>

          <div class="wrapper"></div>
      `;

    this.root.appendChild(template.content.cloneNode(true));

    this.handleLabel();
    this.handleWrappedField();
    this.updateValidity();
  }
}
