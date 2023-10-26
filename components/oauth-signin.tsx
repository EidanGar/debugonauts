"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Icons } from "@/components/icons"

const OAuthSignIn = () => {
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
  })
  const { githubSignIn, googleSignIn } = useAuth()

  const handleGoogleSignIn = async () => {
    setIsLoading({
      ...isLoading,
      google: true,
    })
    try {
      await googleSignIn()
    } catch (error) {
      console.error(error)
    }
  }

  const handleGithubSignIn = async () => {
    setIsLoading({
      ...isLoading,
      github: true,
    })
    try {
      await githubSignIn()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center w-full gap-3 pb-2">
      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="flex items-center w-full gap-2"
      >
        {isLoading.google ? (
          <Icons.loader className="w-5 h-5 animate-spin" />
        ) : (
          <Icons.google className="w-5 h-5" />
        )}
        <span>Google</span>
        <span className="sr-only">Google</span>
      </Button>
      <Button
        onClick={handleGithubSignIn}
        variant="outline"
        className="flex items-center w-full gap-2"
      >
        {isLoading.github ? (
          <Icons.loader className="w-5 h-5 animate-spin" />
        ) : (
          <Icons.gitHub className="w-5 h-5" />
        )}
        <span>Github</span>
        <span className="sr-only">Github</span>
      </Button>
    </div>
  )
}

export default OAuthSignIn
