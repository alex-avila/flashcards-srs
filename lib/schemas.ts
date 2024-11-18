import { z } from "zod"

// TODO: add actual implementation of the data validation
export const formSchema = z.object({
  name: z.string().min(1),
})
