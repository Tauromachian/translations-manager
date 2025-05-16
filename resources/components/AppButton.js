export class AppButton extends HTMLElement {
  #button;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["to", "type", "color"];
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
    button.innerHTML = `<slot></slot><span class="loader"></span>`;

    if (type) {
      button.setAttribute("type", type);
    }

    return button;
  }

  handleFormSubmit() {
    const form = this.closest("form");

    if (!form) return;

    this.#button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click"));

      if (form && type === "submit") {
        const submitEvent = new Event("submit", {
          cancelable: true,
          bubbles: true,
        });
        form.dispatchEvent(submitEvent);
      }
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

                .button a {
                    text-decoration: none;
                    color: var(--black);
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
