import { router } from "../services/router.js";

export class RouterLink extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["to"];
  }

  connectedCallback() {
    const to = this.getAttribute("to");

    this.innerHTML = `
        <a href="${to}">
            <slot></slot>
        </a>
    `;

    const aEl = this.querySelector("a");

    aEl.addEventListener("click", (event) => {
      event.preventDefault();

      router.go(to);
    });
  }
}
