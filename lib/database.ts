import { prisma } from "./prisma"
import { GitHubService } from "./github"

export class DatabaseService {
  async checkConnection() {
    try {
      await prisma.$connect()
      return true
    } catch (error) {
      console.error("Database connection failed:", error)
      return false
    }
  }

  async syncGitHubRepos() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GitHub token not configured")
    }

    // Check database connection first
    const isConnected = await this.checkConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const github = new GitHubService(process.env.GITHUB_TOKEN)

    try {
      const repos = await github.getRepositories()
      const syncResults = []

      for (const repo of repos) {
        const projectData = {
          title: repo.name || "Untitled Project",
          description: repo.description || "No description available",
          category: this.categorizeRepo(repo),
          githubUrl: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          githubId: repo.id,
          topics: repo.topics || [],
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        }

        const existingProject = await prisma.project.findUnique({
          where: { githubId: repo.id },
        })

        if (existingProject) {
          const updated = await prisma.project.update({
            where: { githubId: repo.id },
            data: {
              ...projectData,
              updatedAt: new Date(),
            },
          })
          syncResults.push({ action: "updated", project: updated })
        } else {
          const created = await prisma.project.create({
            data: projectData,
          })
          syncResults.push({ action: "created", project: created })
        }
      }

      return { success: true, results: syncResults }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private categorizeRepo(repo: any): string {
    const name = (repo.name || "").toLowerCase()
    const description = (repo.description || "").toLowerCase()
    const topics = repo.topics || []

    // ML/AI projects
    if (
      topics.some((t: string) => ["machine-learning", "ai", "ml", "data-science"].includes(t.toLowerCase())) ||
      description.includes("machine learning") ||
      repo.language === "Python"
    ) {
      return "ml"
    }

    // Full-stack projects
    if (
      topics.some((t: string) => ["react", "nextjs", "fullstack", "webapp"].includes(t.toLowerCase())) ||
      description.includes("full stack") ||
      repo.language === "JavaScript" ||
      repo.language === "TypeScript"
    ) {
      return "fullstack"
    }

    // Backend projects
    if (
      topics.some((t: string) => ["backend", "api", "server"].includes(t.toLowerCase())) ||
      description.includes("backend")
    ) {
      return "backend"
    }

    return "other"
  }

  async getProjects(includeHidden = false) {
    const isConnected = await this.checkConnection()
    if (!isConnected) {
      throw new Error("Database not connected")
    }

    return prisma.project.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: [{ stars: "desc" }, { updatedAt: "desc" }],
    })
  }

  async toggleProjectVisibility(id: string) {
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) throw new Error("Project not found")

    return prisma.project.update({
      where: { id },
      data: { isVisible: !project.isVisible },
    })
  }

  async deleteProject(id: string) {
    return prisma.project.delete({ where: { id } })
  }
}
