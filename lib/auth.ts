import { cookies } from "next/headers"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password"

export interface AdminUser {
  username: string
  isAdmin: boolean
}

export function authenticateAdmin(username: string, password: string): AdminUser | null {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return {
      username: ADMIN_USERNAME,
      isAdmin: true,
    }
  }
  return null
}

export function generateToken(user: AdminUser): string {
  // Simple token generation (in production, use proper JWT)
  const payload = {
    username: user.username,
    isAdmin: user.isAdmin,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())

    if (payload.exp < Date.now()) {
      return null // Token expired
    }

    return {
      username: payload.username,
      isAdmin: payload.isAdmin,
    }
  } catch (error) {
    return null
  }
}

export async function getAuthenticatedUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}
