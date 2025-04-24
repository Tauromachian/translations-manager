export class TextArea extends HTMLElement {
  constructor() {
    super();

    this._internals = this.attachInternals();
    this._textarea = null;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ["label", "name"];
  }

  get value() {
    return this._textarea.value;
  }

  set value(value) {
    this._textarea.value = value;
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

              textarea {
                  padding: 10px 12px;
                  font-family: Arial, sans-serif;
                  font-size: 1em;
                  color: #333;
                  background: #fff;
                  border: 1px solid var(--gray);
                  border-radius: 4px;
                  transition: border-color 0.2s ease, box-shadow 0.2s ease;
              }

              textarea:focus {
                  outline: none;
                  border-color: var(--primary-10);
                  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
              }
          </style>

          <label></label>
          <textarea class="textarea" name="${name}"></textarea>
      `;

    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(template.content.cloneNode(true));

    this._textarea = this.root.querySelector("textarea");
    this._textarea.addEventListener("input", () => {
      this._internals.setFormValue(this.root.querySelector("textarea").value);
    });

    this.handleLabel();
  }
}
