export class AppBreadcrumbs extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["breadcrumbs"];
  }

  buildBreadcrumbs() {
    if (!this.getAttribute("breadcrumbs")) {
      return "";
    }

    let breadcrumbs = this.getAttribute("breadcrumbs");
    breadcrumbs = JSON.parse(breadcrumbs);

    return breadcrumbs.map((breadcrumb) => {
      return `<li><a href="${breadcrumb.url}">${breadcrumb.name}</a></li>`;
    }).join("");
  }

  connectedCallback() {
    this.innerHTML = `
                    <style>
                       .breadcrumbs {
                          list-style: none;
                          padding: 0;
                          margin: 0;
                          display: flex;
                          gap: 0.3rem;
                       }

                       .breadcrumbs li {
                          display: inline-block;
                       }

                       .breadcrumbs li a {
                           text-decoration: none;
                       }

                       .breadcrumbs li:last-child a {
                           color: var(--disabled);
                           pointer-events: none;

                       }
                    </style>
    
    
                    <ul class="breadcrumbs">
                        ${this.buildBreadcrumbs()}
                    </ul>
                `;
  }
}
