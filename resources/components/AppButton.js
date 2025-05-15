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
    const to = this.getAttribute("to");
    const type = this.getAttribute("type");

    let buttonDefinition = "";

    buttonDefinition = `<button class="button"><slot></slot></button>`;

    if (type) {
      buttonDefinition =
        `<button type="${type}" class="button"><slot></slot></button>`;
    }

    if (to) {
      buttonDefinition = `<router-link to="/app/${
        to === "/" ? "" : to
      }" class="button"><slot></slot></router-link>`;
    }

    return buttonDefinition;
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

    const buttonString = this.makeButton();

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

            ${buttonString}
        `;

    this.root.appendChild(template.content.cloneNode(true));

    this.#button = this.root.querySelector("button");

    this.handleFormSubmit();
    this.handleButtonVariants();
  }
}

customElements.define("app-button", AppButton);
