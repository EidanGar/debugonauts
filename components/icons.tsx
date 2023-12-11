import {
  CalendarDays,
  Cloud,
  CreditCard,
  Eye,
  EyeOff,
  LifeBuoy,
  Loader2,
  LogOut,
  LucideProps,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Newspaper,
  Plus,
  PlusCircle,
  Search,
  Settings,
  SunMedium,
  Trash2,
  Twitter,
  User,
  UserPlus,
  Users,
  type Icon as LucideIcon,
} from "lucide-react"
import { BsGithub } from "react-icons/bs"
import { LuMoreHorizontal } from "react-icons/lu"

export type Icon = LucideIcon

export const Icons: Record<
  string,
  LucideIcon | ((arg: LucideProps) => JSX.Element)
> = {
  sun: SunMedium,
  cloud: Cloud,
  creditCard: CreditCard,
  trash: Trash2,
  logOut: LogOut,
  lifeBuoy: LifeBuoy,
  mail: Mail,
  calendar: CalendarDays,
  details: Newspaper,
  messageSquare: MessageSquare,
  settings: Settings,
  loader: Loader2,
  user: User,
  userPlus: UserPlus,
  plusCircle: PlusCircle,
  eye: Eye,
  eyeOff: EyeOff,
  moon: Moon,
  twitter: Twitter,
  menu: Menu,
  plus: Plus,
  users: Users,
  moreHorizontal: LuMoreHorizontal,
  search: Search,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="30"
      height="30"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 6.827 6.827"
    >
      <circle cx="3.413" cy="3.413" r="2.56" fill="#42a5f5" />
      <path
        d="M.886 3.003h2.482c.226 0 .41.184.41.41 0 .226-.184.411-.41.411H.886a2.58 2.58 0 0 1 0-.821zm4.511-1.207c.104.127.196.265.274.41H3.58a.206.206 0 0 1-.205-.205c0-.113.092-.205.205-.205h1.818zm.445 2.43c-.161.481-.462.9-.854 1.205H3.225a.605.605 0 0 1-.603-.603c0-.331.271-.603.603-.603h2.617z"
        fill="#90caf9"
      />
      <g>
        <path d="M3.438.854a2.56 2.56 0 0 1 0 5.119V.853z" fill="#3586c7" />
        <path
          d="M3.438 3.009c.193.033.34.203.34.404 0 .202-.147.371-.34.405v-.81zm0-1.157v.298a.204.204 0 0 0 .141.057h2.092a2.564 2.564 0 0 0-.274-.411H3.58a.204.204 0 0 0-.14.056zm0 2.373v1.206h1.55c.392-.306.693-.724.854-1.206H3.438z"
          fill="#75a4ca"
        />
      </g>
      <path fill="none" d="M0 0h6.827v6.827H0z" />
    </svg>
  ),
  gitHub: BsGithub,
  google: (props: LucideProps) => (
    <svg
      {...props}
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  ),
}
