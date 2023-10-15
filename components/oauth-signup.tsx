import { Icons } from "./icons"
import { Button } from "./ui/button"

const OAuthSignUp = () => {
  return (
    <div className="flex gap-3 items-center w-full pb-2">
      <Button variant="outline" className="flex w-full gap-2 items-center">
        <Icons.google className="h-5 w-5" />
        <span>Google</span>
        <span className="sr-only">Google</span>
      </Button>
      <Button variant="outline" className="flex w-full gap-2 items-center">
        <Icons.gitHub className="h-5 w-5" />
        <span>Github</span>
        <span className="sr-only">Github</span>
      </Button>
    </div>
  )
}

export { OAuthSignUp }
