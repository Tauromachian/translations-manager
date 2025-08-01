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

  connectedCallback() {
    const title = this.getAttribute("title");

    this.root.innerHTML = `
        <style>
        ${gridCss}
        </style>


        <div class="container mt-5">
            <div class="breadcrumbs-wrapper my-2">
                <app-breadcrumbs></app-breadcrumbs>
            </div>

            <h1>${title}</h1>

            <slot name="content"></slot>
        </div> 
    `;
  }
}

customElements.define("app-layout", AppLayout);
