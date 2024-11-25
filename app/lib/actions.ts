"use server"

import { formSchema } from "./schemas"

export type ActionsState = {
  success: boolean
  message?: string
  errors?: string | string[]
}

export async function createDeck(
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    lessonsPerDay: formData.get("lessonsPerDay"),
    lessonsBatchSize: formData.get("lessonsBathSize"),
  }
  const parsed = formSchema.safeParse(data)

  // this should return something like success false, message like invalid form data, and then the errors in a way
  // that's easy to render in the client
  if (!parsed.success) {
    return {
      success: false,
      message: "Form data parsing failed",
      // TODO: figure out what this looks like actually and create a better errors object for the client if necessary
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  return { success: true, message: "Success" }
}
