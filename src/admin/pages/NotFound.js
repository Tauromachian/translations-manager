export class NotFound extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                div {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    min-height: 100vh;
                }

                h1 {
                    font-size: 3rem;
                }
            </style>

            <div>
                <h1>404</h1>
                <p>Page not found</p>
                <app-button to="/">
                    Go Home
                </app-button>
            </div>
        `;
  }
}
