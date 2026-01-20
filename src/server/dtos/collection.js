import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(1),
  description: z.string({
    invalid_type_error: "Description must be a string",
  }).optional(),
});
