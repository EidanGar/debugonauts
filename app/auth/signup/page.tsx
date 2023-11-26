"use client"

import Auth from "@/components/auth"
import { AuthType } from "@/components/auth-context"

const SignUp = () => <Auth authType={AuthType.SignUp} />

export default SignUp
