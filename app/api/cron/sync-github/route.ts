import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET() {
  // This endpoint can be called by a cron service to sync GitHub repositories
  try {
    const dbService = new DatabaseService()
    const result = await dbService.syncGitHubRepos()

    console.log("Daily GitHub sync completed:", result)

    return NextResponse.json({
      success: true,
      message: "Daily sync completed",
      result,
    })
  } catch (error) {
    console.error("Daily sync failed:", error)
    return NextResponse.json({ success: false, error: "Daily sync failed" }, { status: 500 })
  }
}
