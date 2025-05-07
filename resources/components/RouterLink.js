import { router } from "../services/router.js";

export class RouterLink extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["to"];
  }

  connectedCallback() {
    const template = document.createElement("template");

    const to = this.getAttribute("to");

    template.innerHTML = `
        <a href="${to}">
            <slot></slot>
        </a>
    `;

    this.appendChild(template.content.cloneNode(true));
    this.setAttribute("role", "link");

    this.addEventListener("click", () => {
      router.go(to);
    });
  }
}

customElements.define("router-link", RouterLink);
