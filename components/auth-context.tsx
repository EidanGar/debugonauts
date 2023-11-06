"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react"

import { UserSignInData } from "@/lib/validations/signin"
import { UserSignUpData } from "@/lib/validations/signup"
import { User } from "@/types/user"

export interface AuthContextProps {
  user: User | null
  logOut: () => void
  googleSignIn: () => void
  signIn: (crendetials: UserSignInData) => void
  githubSignIn: () => void
  signUp: (signUpCrendetials: UserSignUpData) => void
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  logOut: () => {},
  googleSignIn: () => {},
  signIn: () => {},
  githubSignIn: () => {},
  signUp: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const signUp = ({ email, password, username }: UserSignUpData) => {
  }

  const googleSignIn = () => {
  }

  const githubSignIn = () => {
  }

  const signIn = ({ email, password }: UserSignInData) => {
  }

  const logOut = async () => {}

  return (
    <AuthContext.Provider
      value={{ user, logOut, googleSignIn, signIn, githubSignIn, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
