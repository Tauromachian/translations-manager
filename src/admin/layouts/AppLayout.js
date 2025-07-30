import "../components/AppBreadcrumbs.js";

export class AppLayout extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["title", "breadcrumbs"];
  }

  buildBreadcrumbs(breadcrumbs) {
    const breadcrumbsEl = document.createElement("app-breadcrumbs");

    breadcrumbsEl.setAttribute(
      "breadcrumbs",
      breadcrumbs,
    );

    return breadcrumbsEl;
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "breadcrumbs") {
      const breadcrumbsEl = this.buildBreadcrumbs(newValue);

      const breadcrumbsWrapper = this.querySelector(".breadcrumbs-wrapper");
      breadcrumbsWrapper.appendChild(breadcrumbsEl);
    }
  }

  connectedCallback() {
    const title = this.getAttribute("title");

    this.innerHTML = `
        <div class="container mt-5">
            <div class="breadcrumbs-wrapper my-2"></div>

            <h1>${title}</h1>

            <slot></slot>
        </div> 
    `;
  }
}

customElements.define("app-layout", AppLayout);
