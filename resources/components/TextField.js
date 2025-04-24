export class TextField extends HTMLElement {
  constructor() {
    super();

    this._internals = this.attachInternals();
    this._input = null;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ["label", "name"];
  }

  get value() {
    return this._input.value;
  }

  set value(value) {
    this._input.value = value;
    this._internals.setFormValue(value);
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

  connectedCallback() {
    const template = document.createElement("template");

    const name = this.getAttribute("name");

    template.innerHTML = `
          <style>
              :host {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  width: 100%;
              }

              input {
                  padding: 10px 12px;
                  font-family: Arial, sans-serif;
                  font-size: 1em;
                  color: #333;
                  background: #fff;
                  border: 1px solid var(--gray);
                  border-radius: 4px;
                  transition: border-color 0.2s ease, box-shadow 0.2s ease;
              }

              input:focus {
                  outline: none;
                  border-color: var(--primary-10);
                  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
              }
          </style>

          <label></label>
          <input class="input" type="text" name="${name}">
      `;

    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(template.content.cloneNode(true));

    this._input = this.root.querySelector("input");
    this._input.addEventListener("input", () => {
      this._internals.setFormValue(this.root.querySelector("input").value);
    });

    this.handleLabel();
  }
}
