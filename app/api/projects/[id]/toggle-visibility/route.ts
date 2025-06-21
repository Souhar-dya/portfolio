import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const dbService = new DatabaseService()
    const project = await dbService.toggleProjectVisibility(params.id)
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle project visibility" }, { status: 500 })
  }
}
