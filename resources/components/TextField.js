import { FormField } from "./FormField.js";

export class TextField extends FormField {
  constructor() {
    super();
  }

  getWrappedField() {
    const input = document.createElement("input");

    input.setAttribute("type", "text");

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this._internals.setFormValue(this._wrappedField.value);

        const form = this._internals.form;

        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
      }
    });

    return input;
  }
}
