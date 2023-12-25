import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Issue, IssueStatus } from "@prisma/client"

import { userConfig } from "@/lib/config/user"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

interface BoardProps {
  issues: Issue[]
  boardTitle: string
  boardType: IssueStatus
}

const MemberAvatar = ({ image, name }: { image?: string; name?: string }) => {
  const memberHref = `${process.env.NEXTAUTH_URL}/${name ? slugify(name) : ""}`

  return (
    <Link href={memberHref}>
      <Image
        width={36}
        height={36}
        className="object-cover duration-300 rounded-full cursor-pointer hover:ring-4 hover:ring-accent"
        alt={name ?? "Unassigned user"}
        src={image ?? userConfig.defaultUserImage}
      />
    </Link>
  )
}

const IssueComponent = ({ issue }: { issue: Issue }) => {
  "use client"
  const pathname = usePathname()

  return (
    <Link
      href={`${pathname}/issues/${issue.issueKey}`}
      className="flex flex-col items-center w-full gap-2 p-3 rounded-md bg-background"
    >
      <div className="flex items-center justify-between w-full gap-3">
        <h4>{issue.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Icons.moreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>Copy issue link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Copy issue key</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>Move issue</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Edit issue</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <span>Delete issue</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked={true}
            className="pointer-events-none"
            disabled
          />
          <span>{issue.issueKey}</span>
        </div>
        <MemberAvatar />
      </div>
    </Link>
  )
}

const Board = ({ issues, boardTitle }: BoardProps) => {
  return (
    <Card className="w-full h-full col-span-3 border-none sm:col-span-1 bg-primary-foreground">
      <CardHeader className="p-2 px-3 space-y-1">
        <CardTitle className="text-xl font-medium">{boardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full gap-4 p-2 px-3">
        {issues.map((issue) => (
          <IssueComponent key={issue.id} issue={issue} />
        ))}
      </CardContent>
      <CardFooter className="p-2 mt-auto">
        <Button variant="ghost" className="w-full">
          Create issue
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Board
