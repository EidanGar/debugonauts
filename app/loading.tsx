import { Icons } from "@/components/icons"

const Loading = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      <Icons.loader className="animate-spin sm:w-20 sm:h-20 h-14 w-14 text-primary" />
    </div>
  )
}

export default Loading
