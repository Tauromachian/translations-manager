import { FormField } from "./FormField.js";

export class TextField extends FormField {
  constructor() {
    super();
  }

  getWrappedField() {
    const input = document.createElement("input");

    input.setAttribute("type", "text");

    return input;
  }

  getKeydownEvent(event, internals, input) {
    if (event.key === "Enter") {
      internals.setFormValue(input.value);

      const form = internals.form;

      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });

      form.dispatchEvent(submitEvent);
    }
  }
}
