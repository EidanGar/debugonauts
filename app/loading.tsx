import { Icons } from "@/components/icons"

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Icons.loader className="animate-spin w-10 h-10 text-primary" />
    </div>
  )
}

export default Loading
