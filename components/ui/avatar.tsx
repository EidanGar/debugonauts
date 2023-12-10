"use client"

import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

import { userConfig } from "@/config/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const UserAvatar = () => {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={session?.user?.image ?? userConfig.defaultUserImage}
          width={36}
          height={36}
          alt={session?.user?.name ?? "User"}
          className="object-cover duration-300 rounded-full cursor-pointer hover:ring-4 hover:ring-accent"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.user className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.creditCard className="w-4 h-4 mr-2" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.users className="w-4 h-4 mr-2" />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icons.userPlus className="w-4 h-4 mr-2" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Icons.mail className="w-4 h-4 mr-2" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icons.messageSquare className="w-4 h-4 mr-2" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icons.plusCircle className="w-4 h-4 mr-2" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Icons.plus className="w-4 h-4 mr-2" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icons.gitHub className="w-4 h-4 mr-2" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.lifeBuoy className="w-4 h-4 mr-2" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icons.cloud className="w-4 h-4 mr-2" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            className="flex items-center justify-start w-full p-0 text-left border-none"
            onClick={() => signOut()}
          >
            <Icons.logOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar
