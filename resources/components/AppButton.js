export class AppButton extends HTMLElement {
  button = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observerdAttributes() {
    return ["to", "type", "color"];
  }

  connectedCallback() {
    const template = document.createElement("template");

    const to = this.getAttribute("to");
    const type = this.getAttribute("type");
    const color = this.getAttribute("color");

    let buttonDefinition = "";

    buttonDefinition = `<button class="button"><slot></slot></button>`;

    if (type) {
      buttonDefinition =
        `<button type="${type}" class="button"><slot></slot></button>`;
    }

    if (to) {
      buttonDefinition = `<a href="/app/${
        to === "/" ? "" : to
      }" class="button"><slot></slot></a>`;
    }

    template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .button {
                    padding: 10px 20px;
                    font-weight: 500;
                    background-color: var(--primary);
                    color: var(--black);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
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
            </style>

            ${buttonDefinition}
        `;

    this.root.appendChild(template.content.cloneNode(true));
    this.button = this.root.querySelector("button");

    if (!this.button) return;

    const form = this.closest("form");

    this.button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click"));

      if (form && type === "submit") {
        const submitEvent = new Event("submit", {
          cancelable: true,
          bubbles: true,
        });
        form.dispatchEvent(submitEvent);
      }
    });

    if (color === "danger") {
      this.button.classList.add("button--danger");
    }
  }
}
