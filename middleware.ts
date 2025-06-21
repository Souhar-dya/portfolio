import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple base64 decode that works in Edge Runtime
function base64Decode(str: string): string {
  try {
    return atob(str)
  } catch {
    return ""
  }
}

function verifyToken(token: string): { valid: boolean; expired: boolean; isAdmin: boolean } {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, expired: false, isAdmin: false }
    }

    const decoded = base64Decode(token)
    if (!decoded) {
      return { valid: false, expired: false, isAdmin: false }
    }

    const payload = JSON.parse(decoded)

    // Check if token structure is valid
    if (!payload || typeof payload !== "object") {
      return { valid: false, expired: false, isAdmin: false }
    }

    // Check if token is expired
    const now = Date.now()
    const isExpired = payload.exp && payload.exp < now

    // Check if user is admin
    const isAdmin = payload.isAdmin === true

    return {
      valid: !isExpired && isAdmin,
      expired: isExpired,
      isAdmin: isAdmin,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { valid: false, expired: false, isAdmin: false }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`[Middleware] Processing: ${pathname}`)

  // Skip middleware for specific paths
  const skipPaths = [
    "/admin/login",
    "/api/admin/login",
    "/api/admin/check-auth",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ]

  // Check if we should skip this path
  const shouldSkip = skipPaths.some((path) => {
    if (path.startsWith("/_next")) {
      return pathname.startsWith(path)
    }
    return pathname === path || pathname.startsWith(path + "/")
  })

  // Skip for static files (files with extensions)
  const isStaticFile = pathname.includes(".") && !pathname.startsWith("/api/")

  // Skip for root path
  const isRootPath = pathname === "/"

  if (shouldSkip || isStaticFile || isRootPath) {
    console.log(`[Middleware] Skipping: ${pathname}`)
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("admin-token")?.value
  const tokenVerification = verifyToken(token || "")

  console.log(`[Middleware] Token verification:`, {
    hasToken: !!token,
    valid: tokenVerification.valid,
    expired: tokenVerification.expired,
    isAdmin: tokenVerification.isAdmin,
  })

  // Protect admin routes (pages)
  if (pathname.startsWith("/admin")) {
    if (!tokenVerification.valid) {
      console.log(`[Middleware] Redirecting to login: ${pathname}`)
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)

      // Add a header to indicate why we're redirecting
      const response = NextResponse.redirect(loginUrl)
      if (tokenVerification.expired) {
        response.headers.set("X-Auth-Error", "token-expired")
      } else {
        response.headers.set("X-Auth-Error", "no-token")
      }

      return response
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    if (!tokenVerification.valid) {
      console.log(`[Middleware] Blocking API access: ${pathname}`)

      const errorResponse = tokenVerification.expired
        ? { error: "Token expired", code: "TOKEN_EXPIRED" }
        : { error: "Unauthorized", code: "NO_TOKEN" }

      return NextResponse.json(errorResponse, { status: 401 })
    }
  }

  // Protect sync API routes
  if (pathname.startsWith("/api/sync-github")) {
    if (!tokenVerification.valid) {
      console.log(`[Middleware] Blocking sync access: ${pathname}`)

      const errorResponse = tokenVerification.expired
        ? { error: "Token expired", code: "TOKEN_EXPIRED" }
        : { error: "Unauthorized", code: "NO_TOKEN" }

      return NextResponse.json(errorResponse, { status: 401 })
    }
  }

  // Protect project management API routes
  if (
    pathname.match(/^\/api\/projects\/[^/]+\/(toggle-visibility|delete)/) ||
    (pathname.match(/^\/api\/projects\/[^/]+$/) && request.method === "DELETE")
  ) {
    if (!tokenVerification.valid) {
      console.log(`[Middleware] Blocking project management: ${pathname}`)

      const errorResponse = tokenVerification.expired
        ? { error: "Token expired", code: "TOKEN_EXPIRED" }
        : { error: "Unauthorized", code: "NO_TOKEN" }

      return NextResponse.json(errorResponse, { status: 401 })
    }
  }

  console.log(`[Middleware] Allowing: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
