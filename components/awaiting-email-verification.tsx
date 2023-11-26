import { EmailData } from "@/components/auth-context"

interface AwaitingEmailVerificationProps {
  emailData: EmailData
  setIsAwaitingEmailVerification: React.Dispatch<React.SetStateAction<boolean>>
}

const AwaitingEmailVerification = ({
  emailData: { emailAddress, verificationCode },
  setIsAwaitingEmailVerification,
}: AwaitingEmailVerificationProps) => {
  return (
    <div className="flex flex-col w-full h-full items-center gap-4 justify-center text-center">
      <h1 className="text-2xl font-bold">Email Verification</h1>
      <p>
        Keep this window open and in a new tab open the link we just sent to{" "}
        <a
          href="https://mail.google.com/mail/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold transition-colors text-blue-500 underline-offset-4 hover:underline"
        >
          {emailAddress}
        </a>{" "}
        <span
          onClick={() => setIsAwaitingEmailVerification(false)}
          className="font-bold cursor-pointer transition-colors text-primary underline-offset-4 hover:underline"
        >
          (undo)
        </span>{" "}
        with security code:
      </p>
      <h2 className="rounded-md mt-3 shadow-md font-bold px-5 py-3 bg-accent text-primary">
        {verificationCode}
      </h2>
    </div>
  )
}

export default AwaitingEmailVerification
