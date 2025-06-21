import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Souhardya Kundu Portfolio",
  description: "Admin dashboard for managing portfolio projects",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
