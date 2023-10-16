import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const OAuthSignUp = () => {
  return (
    <div className="flex items-center w-full gap-3 pb-2">
      <Button variant="outline" className="flex items-center w-full gap-2">
        <Icons.google className="w-5 h-5" />
        <span>Google</span>
        <span className="sr-only">Google</span>
      </Button>
      <Button variant="outline" className="flex items-center w-full gap-2">
        <Icons.gitHub className="w-5 h-5" />
        <span>Github</span>
        <span className="sr-only">Github</span>
      </Button>
    </div>
  )
}

export { OAuthSignUp }
