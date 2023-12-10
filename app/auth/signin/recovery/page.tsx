import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AccountRecoveryForm from "@/app/auth/signin/recovery/account-recovery-form"

const AccountRecoveryPage = () => {
  return (
    <Card className="mx-auto w-[min(460px,90vw)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Account recovery</CardTitle>
        <CardDescription>
          We&apos;ll send a recovery link to you via email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AccountRecoveryForm />
      </CardContent>
    </Card>
  )
}

export default AccountRecoveryPage
