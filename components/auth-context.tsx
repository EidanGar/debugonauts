"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { auth } from "@/firebase/config"
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"

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

  const signUp = ({ email, password, username }: UserSignUpData) => {
    createUserWithEmailAndPassword(auth, email, password)
  }

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const githubSignIn = () => {
    const provider = new GithubAuthProvider()
    signInWithPopup(auth, provider)
  }

  const signIn = ({ email, password }: UserSignInData) => {
    signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = async () => await signOut(auth)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    )
    return () => unsubscribe()
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, logOut, googleSignIn, signIn, githubSignIn, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
