"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { User } from "@prisma/client"

export interface EmailData {
  email: string
  verificationCode: string
}

export interface SignUpData extends EmailData {
  username: string
}

export interface SignInData extends EmailData {}

export interface AuthContextProps {
  user: User | null
  handleUserAuth: (props: EmailData) => void
  logOutEmailAuth: () => void
  oAuthSignIn: (provider: string) => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  handleUserAuth: () => {},
  logOutEmailAuth: () => {},
  oAuthSignIn: () => {},
  setUser: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const handleUserAuth = async ({ email, verificationCode }: EmailData) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, verificationCode }),
    })

    const response = await res.json()

    return response
  }

  const oAuthSignIn = async (provider: string) => {}

  const logOutEmailAuth = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, logOutEmailAuth, handleUserAuth, oAuthSignIn, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
