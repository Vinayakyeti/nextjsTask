import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Public routes
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isAuthenticated && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
