export class AppLoader extends HTMLElement {
  get observedAttributes() {
    return ["width", "height"];
  }

  handleSize() {
    const loader = this.querySelector(".loader");

    let width = this.getAttribute("width");
    let height = this.getAttribute("height");

    if (width) {
      if (!Number.isNaN(Number(width))) {
        width = `${width}px`;
      }

      loader.style.width = width;
      console.log(width);
      console.log(loader.style.width);
    }

    if (height) {
      if (!Number.isNaN(Number(height))) {
        height = `${height}px`;
      }

      loader.style.height = height;
    }
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 0.5s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loader"></div>
        `;

    this.handleSize();
  }
}

customElements.define("app-loader", AppLoader);
