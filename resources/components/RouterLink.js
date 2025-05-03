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

    this.template.innerHTML = `
        <a href="${to}">
            <slot></slot>
        </a>
    `;

    this.appendChild(template.content.cloneNode(true));

    const aEl = this.querySelector("a");

    aEl.addEventListener("click", (event) => {
      event.preventDefault();

      router.go(to);
    });
  }
}
