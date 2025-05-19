import { z } from "npm:zod";

export const TranslationsSchema = z.object({
  id: z.number().int().positive(),
  languageId: z.number().int().positive(),
  key: z.string({
    required_error: "Key is required",
    invalid_type_error: "Key must be a string",
  }),
  translation: z.string({
    required_error: "Translation is required",
    invalid_type_error: "Translation must be a string",
  }),
});
