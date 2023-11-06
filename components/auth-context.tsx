"use client"

import { ReactNode, createContext, useContext, useState } from "react"

import { User } from "@/types/user"
import { UserSignInData } from "@/lib/validations/signin"
import { UserSignUpData } from "@/lib/validations/signup"

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

  const signUp = ({ email }: UserSignUpData) => {}

  const googleSignIn = () => {}

  const githubSignIn = () => {}

  const signIn = ({ email }: UserSignInData) => {}

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
