import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET() {
  try {
    const dbService = new DatabaseService()
    const projects = await dbService.getProjects()
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Database error:", error)

    // Return sample projects if database is not connected
    const sampleProjects = [
      {
        id: "sample-1",
        title: "Portfolio Website",
        description: "A modern portfolio website built with Next.js and TailwindCSS",
        category: "fullstack",
        githubUrl: "https://github.com",
        language: "TypeScript",
        stars: 5,
        forks: 2,
        topics: ["nextjs", "tailwindcss", "portfolio"],
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "sample-2",
        title: "Machine Learning Project",
        description: "A machine learning project for data analysis and prediction",
        category: "ml",
        githubUrl: "https://github.com",
        language: "Python",
        stars: 12,
        forks: 4,
        topics: ["python", "machine-learning", "data-science"],
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      projects: sampleProjects,
      note: "Using sample data - database not connected",
    })
  }
}
