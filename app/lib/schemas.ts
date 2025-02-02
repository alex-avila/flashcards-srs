import { z } from "zod"

// TODO: add actual implementation of the data validation
export const formSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    lessonsPerDay: z.coerce.number().min(3),
    lessonsBatchSize: z.coerce.number().min(3).max(9),
  })
  .refine(data => data.lessonsPerDay >= data.lessonsBatchSize, {
    message: "lessons per day must be more than or equal to lessons batch size",
  })

export const cardFormSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  context: z.string().optional(),
})
