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
}
