export class AppLoader extends HTMLElement {
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
                    margin: 50px auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loader"></div>
        `;
  }
}
