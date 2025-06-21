import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const dbService = new DatabaseService()
    await dbService.deleteProject(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
