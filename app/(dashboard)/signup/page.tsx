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

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md space-y-3 md:mt-6">
      <CardHeader>
        <CardTitle>
          <h2>sign up</h2>
        </CardTitle>
        <CardDescription>
          click{" "}
          <Link className="underline" href="/login">
            here
          </Link>{" "}
          to log in instead
        </CardDescription>
      </CardHeader>
      <SignupFormProvider>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter>
          <SignupFormSubmit
            submitLabel="sign up"
            submitPendingLabel="pending…"
          />
        </CardFooter>
      </SignupFormProvider>
    </Card>
  )
}
