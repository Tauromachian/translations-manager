import "iconify-icon";

import { ref, watch } from "../../shared/utils/reactivity.js";

import "./AppButton.js";

export class FileUpload extends HTMLElement {
  #dataValue;

  constructor() {
    super();

    this.#dataValue = ref({});

    watch(this.#dataValue, this.handleDataValueChange.bind(this));
  }

  handleDataValueChange(value) {
    const selectedFile = this.querySelector(".selected-file");
    const selectingFile = this.querySelector(".selecting-file");

    if (Object.keys(value).length) {
      selectedFile.style.display = "flex";
      selectingFile.style.display = "none";

      const name = selectedFile.querySelector(".selected-file__name");
      const size = selectedFile.querySelector(".selected-file__size");

      name.textContent = value.name;
      size.textContent = `${value.size} bytes`;
    } else {
      selectedFile.style.display = "none";
      selectingFile.style.display = "flex";
    }
  }

  static get obvservedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "title") {
      const titleEl = this.querySelector("title");
      titleEl.textContent = newValue;
    }
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
            .file-upload-container {
                width: 100%;
                border: 3px dotted var(--gray);
                padding: 1em 0;
                border-radius: 4px;
            }

            .title {
                font-weight: bold;
             }

            .selecting-file {
                width: 100%;
                display: flex; 
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 0.5em;
            }

            .selected-file {
                display: none;
                margin: 0 16px;
            }

            .selected-file__name {
                font-weight: bold;

            }

            .selected-file > app-button {
                margin-left: auto;
            }
        </style>

        <div class="file-upload-container">
            <div class="selecting-file">
                <p class="title">Upload File</p>
                <p class="subtitle">Files Supported: JSON</p>
                <app-button class="browse-file-button">Browse File</app-button>
                <input type="file" hidden style="display: none;"/>
            </div>

            <div class="selected-file">
                <div>
                    <p class="selected-file__name"></p>
                    <p class="selected-file__size"></p>
                </div>
                <app-button icon="close" class="close-button"></app-button>
            </div>
        </div>
        `;

    const button = this.querySelector(".browse-file-button");
    const fileInput = this.querySelector("input[type='file']");
    const closeButton = this.querySelector(".close-button");

    const title = this.getAttribute("title");
    if (title) {
      this.querySelector(".title").textContent = title;
    }

    button.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      const obj = JSON.parse(await file.text());

      this.#dataValue.value = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: obj,
      };
    });

    closeButton.addEventListener("click", () => {
      this.#dataValue.value = {};
    });
  }
}

customElements.define("file-upload", FileUpload);
