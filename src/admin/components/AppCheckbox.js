export class AppCheckbox extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, _, value) {
    if (name === "label") {
      if (value) {
        const span = this.querySelector("span");
        span.textContent = value;
      } else {
        this.querySelector("span").textContent = "";
      }
    }
  }

  connectedCallback() {
    this.innerHTML = `
            <label for="checkbox">
                <input type="checkbox" id="checkbox"/>
                <span></span>
            </label>
        `;

    const label = this.getAttribute("label");
    if (label) {
      const span = this.querySelector("span");
      span.textContent = label;
    }
  }
}

customElements.define("app-checkbox", AppCheckbox);
