import { z } from "zod";

export const userRegistrationFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name cannot exceed 32 characters"),
});

export const optionSchema = z.object({
  description: z
    .string()
    .min(1, "Option description is required")
    .max(256, "Option description cannot exceed 256 characters"),
});

export const predictionFormSchema = z.object({
  name: z
    .string()
    .min(1, "Prediction name is required")
    .max(32, "Prediction name cannot exceed 32 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(256, "Description cannot exceed 256 characters"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  participationDeadline: z.date().optional(),
  isPrivate: z.boolean(),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .max(20, "Maximum 20 options allowed"),
});

export type PredictionFormValues = z.infer<typeof predictionFormSchema>;
