"use client"

import { ReactNode, createContext, useContext, useState } from "react"

import { User } from "@/types/user"

export enum AuthType {
  SignIn = "signin",
  SignUp = "signup",
}

export interface EmailData {
  emailAddress: string
  verificationCode: string
}

export interface HandleUserAuthProps {
  authType: AuthType
  emailData: EmailData
}

export interface AuthContextProps {
  user: User | null
  handleUserAuth: (props: HandleUserAuthProps) => void
  logOutEmailAuth: () => void
  oAuthSignIn: (provider: string) => void
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  handleUserAuth: () => {},
  logOutEmailAuth: () => {},
  oAuthSignIn: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const handleUserAuth = async ({
    authType,
    emailData,
  }: HandleUserAuthProps) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailData, authType }),
    })

    const response = await res.json()

    return response
  }

  const oAuthSignIn = async (provider: string) => {}

  const logOutEmailAuth = async () => {}

  return (
    <AuthContext.Provider
      value={{ user, logOutEmailAuth, handleUserAuth, oAuthSignIn }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
