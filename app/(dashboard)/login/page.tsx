import {
  LoginFormProvider,
  LoginForm,
  LoginFormSubmit,
} from "../components/login-form"
import {
  Card,
  CardContent,
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
