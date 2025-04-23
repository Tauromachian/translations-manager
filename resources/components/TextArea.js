export class TextArea extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["label"];
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
          <textarea class="textarea" type="text"></textarea>
      `;

    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(template.content.cloneNode(true));

    this.handleLabel();
  }
}
