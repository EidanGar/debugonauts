"use client"

import Auth from "@/components/auth"
import { AuthType } from "@/components/auth-context"

const SignIn = () => <Auth authType={AuthType.SignIn} />

export default SignIn
