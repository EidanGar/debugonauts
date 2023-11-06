import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AccountRecoveryForm from "@/components/forms/account-recovery-form"

const AccountRecoveryPage = () => {
  return (
    <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Account recovery</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AccountRecoveryForm />
      </CardContent>
    </Card>
  )
}

export default AccountRecoveryPage
