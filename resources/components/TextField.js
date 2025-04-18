export class TextField extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["label"];
  }

  handleLabel() {
    const label = this.getAttribute("label");

    const labelEl = this.querySelector("label");

    if (label) {
      labelEl.textContent = label;
    } else {
      labelEl.style.display = "none";
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
          <div>
              <label></label>
              <input class="input" type="text">
          </div>
      `;

    this.appendChild(template.content.cloneNode(true));
    this.handleLabel();
  }
}
