import "./AppLoader.js";

export class AppButton extends HTMLElement {
  #button;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["to", "type", "color", "loading"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (!this.#button) return;

    if (name === "loading") {
      const loader = this.#button.querySelector(".button-loader");

      const isLoading = newValue === "true" || newValue === "";

      loader.style.display = isLoading ? "flex" : "none";

      if (isLoading) {
        this.#button.classList.add("button--loading");
      } else {
        this.#button.classList.remove("button--loading");
      }
    }
  }

  makeButton() {
    const type = this.getAttribute("type");
    const to = this.getAttribute("to");

    if (to) {
      const button = document.createElement("router-link");
      button.setAttribute("to", to);
      button.setAttribute("class", "button");
      button.innerHTML = `<slot></slot>`;
      return button;
    }

    const button = document.createElement("button");
    button.setAttribute("class", "button");
    button.innerHTML = `<slot></slot>
      <span class="button-loader"><app-loader width="20px" height="20px"></app-loader></span>
    `;

    if (type) {
      button.setAttribute("type", type);
    }

    return button;
  }

  handleFormSubmit() {
    const form = this.closest("form");
    const type = this.getAttribute("type");

    if (!form || !type) return;

    this.#button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click"));

      const submitEvent = new Event("submit", {
        cancelable: true,
        bubbles: true,
      });
      form.dispatchEvent(submitEvent);
    });
  }

  handleButtonVariants() {
    const color = this.getAttribute("color");

    if (!color) return;

    if (color === "danger") {
      this.#button.classList.add("button--danger");
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .button {
                    padding: 0.5em 20px;
                    font-weight: 500;
                    background-color: var(--primary);
                    color: var(--black);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    position: relative;
                    transition: background-color 0.2s ease;
                    font-size: 0.9rem;
                    display: block;
                    font-weight: 500 !important;
                    font-family: var(--font-sans);
                }

                .button:hover {
                    background-color: var(--primary-10);
                }

                .button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
                }

                .button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .button--danger {
                    background-color: var(--danger);
                }

                .button--loading {
                    pointer-events: none;
                    cursor: not-allowed;
                }

                .button a {
                    text-decoration: none;
                    color: var(--black);
                }

                .button-loader {
                    border-radius: 4px;
                    background-color: var(--primary);
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    display: none;
                }
            </style>
        `;

    this.root.appendChild(template.content.cloneNode(true));

    this.#button = this.makeButton();
    this.root.appendChild(this.#button);

    this.handleFormSubmit();
    this.handleButtonVariants();
  }
}

customElements.define("app-button", AppButton);
