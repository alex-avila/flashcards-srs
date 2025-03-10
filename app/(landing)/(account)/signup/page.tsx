import type { Metadata } from "next"
import Link from "next/link"
import {
  SignupFormProvider,
  SignupForm,
  SignupFormSubmit,
} from "../components/signup-form"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/app/components/ui/card"

export const metadata: Metadata = {
  title: "Sign up",
}

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-md space-y-3 md:mt-6">
      <CardHeader>
        <CardTitle>
          <h2>Create an account</h2>
        </CardTitle>
        <CardDescription>
          <div>New account includes some default decks and a demo deck.</div>
          <div className="pt-1">
            Already have an account? Click{" "}
            <Link className="underline" href="/login">
              here
            </Link>{" "}
            to log in
          </div>
        </CardDescription>
      </CardHeader>
      <SignupFormProvider>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter>
          <SignupFormSubmit
            submitLabel="Sign up"
            submitPendingLabel="Processing…"
          />
        </CardFooter>
      </SignupFormProvider>
    </Card>
  )
}
