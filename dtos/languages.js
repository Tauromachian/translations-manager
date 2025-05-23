import { z } from "npm:zod";

export const LanguageSchema = z.object({
  id: z.number().int().positive(),
  collectionId: z.number().int().positive(),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  code: z.string({
    required_error: "Code is required",
    invalid_type_error: "Code must be a string",
  }),
});
