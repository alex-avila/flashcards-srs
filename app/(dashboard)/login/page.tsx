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
          <h2>Log in</h2>
        </CardTitle>
        <CardDescription>
          Don&apos;t have an account? Click{" "}
          <Link className="underline" href="/signup">
            here
          </Link>{" "}
          to sign up
        </CardDescription>
      </CardHeader>
      <LoginFormProvider>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <LoginFormSubmit
            submitLabel="Log in"
            submitPendingLabel="Validating…"
          />
        </CardFooter>
      </LoginFormProvider>
    </Card>
  )
}
