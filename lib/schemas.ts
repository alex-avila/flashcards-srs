import { z } from "zod"

// TODO: add actual implementation of the data validation
export const formSchema = z
  .object({
    name: z.string().min(1),
    lessonsPerDay: z.coerce.number().min(3),
    lessonsBatchSize: z.coerce.number().min(3).max(9),
  })
  .refine(data => data.lessonsPerDay >= data.lessonsBatchSize, {
    message: "lessonsPerDay should be at least as big as lessonsBatchSize",
  })
