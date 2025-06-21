import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST() {
  try {
    const dbService = new DatabaseService()
    const result = await dbService.syncGitHubRepos()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync repositories",
      },
      { status: 500 },
    )
  }
}
