"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { User } from "@prisma/client"

import { UserSignInData } from "@/lib/validations/signin"
import { UserSignUpData } from "@/lib/validations/signup"

export interface AuthContextProps {
  user: User | null
  signIn: (props: UserSignInData) => Promise<Response> | void
  signUp: (props: UserSignUpData) => Promise<Response> | void
  oAuthSignIn: (provider: string) => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logOut: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: () => {},
  signUp: () => {},
  oAuthSignIn: () => {},
  setUser: () => {},
  logOut: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const signIn = async ({
    email,
    password,
  }: UserSignInData): Promise<Response> => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    return res as Response
  }

  const signUp = async ({ email, password, username }: UserSignUpData) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    })

    return res
  }

  const oAuthSignIn = async (provider: string) => {}

  const logOut = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logOut,
        signIn,
        oAuthSignIn,
        setUser,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
