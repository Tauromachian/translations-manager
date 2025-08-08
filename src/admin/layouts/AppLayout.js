import "iconify-icon";

import marginCss from "@jogarcia/mgrid/dist/margin.css?inline";

import "@/admin/components/AppBreadcrumbs.js";

import gridCss from "@/shared/styles/grid.css?inline";

export class AppLayout extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "breadcrumbs"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "breadcrumbs") {
      const breadcrumbsEl = this.root.querySelector("app-breadcrumbs");
      breadcrumbsEl.setAttribute("breadcrumbs", newValue);
    }
  }

  loadTheme() {
    const theme = localStorage.getItem("theme");

    const htmlEl = document.querySelector("html");
    if (theme === "dark") {
      htmlEl.setAttribute("data-theme", "dark");
    }
  }

  toggleTheme() {
    const htmlEl = document.querySelector("html");

    let htmlElDarkAttr = htmlEl.getAttribute("data-theme");

    if (htmlElDarkAttr) {
      htmlEl.removeAttribute("data-theme");
    } else {
      htmlEl.setAttribute("data-theme", "dark");
    }

    htmlElDarkAttr = htmlEl.getAttribute("data-theme");

    localStorage.setItem("theme", htmlElDarkAttr ?? "light");
  }

  connectedCallback() {
    const title = this.getAttribute("title");

    this.loadTheme();

    this.root.innerHTML = `
        <style>
        ${marginCss}
        ${gridCss}

        button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5em 0.5em;
          background-color: var(--primary);
          border-radius: 0px 0px 4px 4px;
        }
        </style>

        <div class="container">
            <button class="button--text ml-auto">
                <iconify-icon
                    width="42"
                    height="42"
                    icon="material-symbols:invert-colors"
                ></iconify-icon>
            </button>
        </div>

        <div class="container mt-5">
            <div class="breadcrumbs-wrapper my-2">
                <app-breadcrumbs></app-breadcrumbs>
            </div>

            <h1>${title}</h1>

            <slot name="content"></slot>
        </div> 
    `;

    const themeButton = this.root.querySelector("button");
    themeButton.addEventListener("click", this.toggleTheme);
  }
}

customElements.define("app-layout", AppLayout);
