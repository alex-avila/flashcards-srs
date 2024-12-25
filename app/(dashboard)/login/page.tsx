import Link from "next/link"
import {
  LoginFormProvider,
  LoginForm,
  LoginFormSubmit,
} from "../components/login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md space-y-3 md:mt-6">
      <CardHeader>
        <CardTitle>
          <h2>log in</h2>
        </CardTitle>
        <CardDescription>
          click{" "}
          <Link className="underline" href="/signup">
            here
          </Link>{" "}
          to sign up instead
        </CardDescription>
      </CardHeader>
      <LoginFormProvider>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <LoginFormSubmit submitLabel="log in" submitPendingLabel="pending…" />
        </CardFooter>
      </LoginFormProvider>
    </Card>
  )
}
