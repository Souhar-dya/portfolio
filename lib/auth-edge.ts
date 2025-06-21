// Edge Runtime compatible authentication
export interface AdminUser {
  username: string
  isAdmin: boolean
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "your-secure-password"
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key"

// Simple base64 encoding/decoding for Edge Runtime
function base64UrlEncode(str: string): string {
  const base64 = btoa(str)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  // Add padding
  str += "=".repeat((4 - (str.length % 4)) % 4)
  // Replace URL-safe characters
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  return atob(str)
}

// Simple HMAC implementation using Web Crypto API (Edge Runtime compatible)
async function createHmacSignature(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
  const signatureArray = new Uint8Array(signature)

  // Convert to base64url
  let binary = ""
  for (let i = 0; i < signatureArray.byteLength; i++) {
    binary += String.fromCharCode(signatureArray[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
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

export async function generateToken(user: AdminUser): Promise<string> {
  const payload = {
    username: user.username,
    isAdmin: user.isAdmin,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payloadStr = base64UrlEncode(JSON.stringify(payload))

  const signature = await createHmacSignature(`${header}.${payloadStr}`, JWT_SECRET)

  return `${header}.${payloadStr}.${signature}`
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    if (!token || token.split(".").length !== 3) {
      return null
    }

    const [header, payload, signature] = token.split(".")

    // Verify signature
    const expectedSignature = await createHmacSignature(`${header}.${payload}`, JWT_SECRET)

    if (signature !== expectedSignature) {
      return null
    }

    const decodedPayload = JSON.parse(base64UrlDecode(payload))

    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expired
    }

    return {
      username: decodedPayload.username,
      isAdmin: decodedPayload.isAdmin,
    }
  } catch (error) {
    return null
  }
}

// Edge Runtime compatible authentication check
export async function isAuthenticatedEdge(token: string | undefined): Promise<AdminUser | null> {
  if (!token) {
    return null
  }

  return await verifyToken(token)
}
