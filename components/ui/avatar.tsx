"use client"

import Image from "next/image"

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

interface AvatarProps {
  email: string
  name: string
  src?: string
  size?: number
  className?: string
  userId?: string
}

const UserAvatar = ({ src, email, name }: AvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={
            src ??
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100"
          }
          width={36}
          height={36}
          alt={name}
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
          <Icons.logOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar
