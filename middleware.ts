import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
})

export const config = {
  matcher: [
    "/projects/:path*",
    "/manage-profile",
    "/teams/:path*",
    "/your-work",
  ],
}
