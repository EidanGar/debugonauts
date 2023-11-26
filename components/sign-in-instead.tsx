import { capitalize } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SignInInsteadProps {
  provider: string
  emailAddress: string
  isOpen: boolean
  setIsAwaitingEmailVerification: React.Dispatch<React.SetStateAction<boolean>>
}

const SignInInstead = ({
  provider,
  emailAddress,
  isOpen,
  setIsAwaitingEmailVerification,
}: SignInInsteadProps) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent className="flex flex-col items-center text-center">
      <AlertDialogHeader>
        <AlertDialogTitle>{`You logged in with your ${capitalize(
          provider
        )} account before`}</AlertDialogTitle>
      </AlertDialogHeader>
      <div className="flex flex-col items-center w-full justify-center gap-4 p-4 border border-accent">
        <div className="flex gap-2 items-center">
          {provider === "google" ? (
            <Icons.google className="w-6 h-6" />
          ) : (
            <Icons.gitHub className="w-6 h-6" />
          )}
          <span className="text-sm font-medium">{emailAddress}</span>
        </div>
        <Button className="rounded-sm w-full">
          Sign in with {capitalize(provider)}
        </Button>
      </div>
      <AlertDialogFooter>
        <span
          onClick={() => setIsAwaitingEmailVerification(false)}
          className="transition-colors cursor-pointer text-primary underline-offset-4 hover:underline text-sm py-2"
        >
          Use a different login method
        </span>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

export default SignInInstead
