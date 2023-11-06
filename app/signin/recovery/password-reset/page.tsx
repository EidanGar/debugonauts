import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import PasswordResetForm from "@/components/forms/password-reset-form"

const ResetPassword = () => {
  return (
    <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Password reset</CardTitle>
        <CardDescription>
          Enter your new password below, make sure your password is strong and
          unique to ensure the security of your account.
        </CardDescription>
        <CardContent className="p-0">
          <PasswordResetForm />
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default ResetPassword
