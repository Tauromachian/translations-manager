import { FormField } from "./FormField.js";

export class TextArea extends FormField {
  constructor() {
    super();
  }

  getWrappedField() {
    const input = document.createElement("textarea");

    return input;
  }
}
