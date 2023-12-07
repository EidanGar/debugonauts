"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { User } from "@prisma/client"

import { UserSignInData } from "@/lib/validations/signin"
import { UserSignUpData } from "@/lib/validations/signup"

// user without password or salt
export type AppUser = Omit<User, "password" | "salt">

export interface AuthContextProps {
  user: AppUser | null
  signIn: (props: UserSignInData) => Promise<Response> | void
  signUp: (props: UserSignUpData) => Promise<Response> | void
  oAuthSignIn: (provider: string) => void
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>
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
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const localUser = localStorage.getItem("user")
      if (localUser) {
        setUser(JSON.parse(localUser))
      } else if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      }
    }
  }, [user])

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
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("user")
    }
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
