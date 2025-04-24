import { FormField } from "./FormField.js";

export class TextArea extends FormField {
  constructor() {
    super();
  }

  getWrappedField() {
    return document.createElement("textarea");
  }
}
