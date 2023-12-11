import { Icons } from "@/components/icons"

interface LoadingProps {
  size?: number
}

const Loading = ({ size }: LoadingProps) => {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
      <Icons.loader
        className={`animate-spin sm:w-20 sm:h-20 h-${size ?? 14} w-${
          size ?? 14
        } text-primary`}
      />
    </div>
  )
}

export default Loading
