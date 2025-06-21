import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticatedEdge } from "@/lib/auth-edge"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    const user = await isAuthenticatedEdge(token)

    return NextResponse.json({
      authenticated: !!user,
      user: user,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
