class ToastNotification extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this._timeoutId = null;
  }

  static get observedAttributes() {
    return ["type", "message", "duration", "position"];
  }

  attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.startAutoDismiss();
  }

  disconnectedCallback() {
    this.clearAutoDismiss();
  }

  render() {
    this.getAttribute("type") || "info";
    const message = this.getAttribute("message") || "Notification";
    this.getAttribute("position") || "top-right";

    const styles = `
      <style>
        :host {
          display: block;
          position: fixed;
          z-index: 1000;
          max-width: 320px;
          padding: 12px 16px;
          margin: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: #fff;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
          transform: translateY(0);
        }
        :host([hidden]) {
          opacity: 0;
          transform: translateY(-10px);
          pointer-events: none;
        }
        .toast {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .message {
          flex: 1;
          margin-right: 8px;
        }
        .dismiss {
          background: none;
          border: none;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          padding: 0 8px;
          line-height: 1;
        }
        .dismiss:hover {
          opacity: 0.8;
        }
        :host([type="success"]) {
          background: #28a745;
        }
        :host([type="error"]) {
          background: #dc3545;
        }
        :host([type="warning"]) {
          background: #ffc107;
          color: #333;
        }
        :host([type="info"]) {
          background: #17a2b8;
        }
        :host([position="top-left"]) {
          top: 0;
          left: 0;
        }
        :host([position="top-right"]) {
          top: 0;
          right: 0;
        }
        :host([position="bottom-left"]) {
          bottom: 0;
          left: 0;
        }
        :host([position="bottom-right"]) {
          bottom: 0;
          right: 0;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="toast" role="alert" aria-live="assertive">
        <span class="message">${message}</span>
        <button class="dismiss" aria-label="Dismiss notification">&times;</button>
      </div>
    `;
  }

  setupEventListeners() {
    const dismissButton = this.shadowRoot.querySelector(".dismiss");
    dismissButton.addEventListener("click", () => this.dismiss());
  }

  startAutoDismiss() {
    const duration = parseInt(this.getAttribute("duration")) || 3000;
    if (duration > 0) {
      this.clearAutoDismiss();
      this._timeoutId = setTimeout(() => this.dismiss(), duration);
    }
  }

  clearAutoDismiss() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  dismiss() {
    this.clearAutoDismiss();
    this.setAttribute("hidden", "");
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  static show(options = {}) {
    const toast = document.createElement("toast-notification");
    toast.setAttribute("type", options.type || "info");
    toast.setAttribute("message", options.message || "Notification");
    if (options.duration) toast.setAttribute("duration", options.duration);
    if (options.position) toast.setAttribute("position", options.position);
    document.body.appendChild(toast);
    return toast;
  }
}

customElements.define("toast-notification", ToastNotification);
