"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Eye, EyeOff, Trash2, Github, LogOut, Star, GitFork } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  githubUrl?: string
  language?: string
  stars: number
  forks: number
  isVisible: boolean
  topics?: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        console.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (id: string, currentTitle: string, isCurrentlyVisible: boolean) => {
    const action = isCurrentlyVisible ? "hide" : "show"
    const message = `Are you sure you want to ${action} the project "${currentTitle}"?`

    if (!confirm(message)) return

    try {
      const response = await fetch(`/api/projects/${id}/toggle-visibility`, { method: "POST" })
      if (response.ok) {
        await fetchProjects()
        alert(`Project "${currentTitle}" is now ${isCurrentlyVisible ? "hidden" : "visible"}.`)
      } else {
        alert("Failed to toggle visibility")
      }
    } catch (error) {
      alert("Failed to toggle visibility")
    }
  }

  const deleteProject = async (id: string, title: string) => {
    // First confirmation
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    // Second confirmation for extra safety
    const confirmText = prompt(
      `This action cannot be undone!\n\nTo confirm deletion, please type the project name exactly:\n"${title}"`,
    )

    if (confirmText !== title) {
      if (confirmText !== null) {
        alert("Project name doesn't match. Deletion cancelled.")
      }
      return
    }

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchProjects()
        alert(`Project "${title}" has been permanently deleted.`)
      } else {
        alert("Failed to delete project")
      }
    } catch (error) {
      alert("Failed to delete project")
    }
  }

  const syncGitHub = async () => {
    const confirmSync = confirm(
      "This will sync all your GitHub repositories and may:\n\n" +
        "• Add new projects from GitHub\n" +
        "• Update existing project information\n" +
        "• Overwrite some project details\n\n" +
        "Do you want to continue?",
    )

    if (!confirmSync) return

    setSyncing(true)
    try {
      const response = await fetch("/api/sync-github", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        await fetchProjects()
        const message =
          `Sync completed successfully!\n\n` +
          `• ${result.results?.length || 0} repositories processed\n` +
          `• Check the projects list for updates`
        alert(message)
      } else {
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      alert("Sync failed: Network error")
    } finally {
      setSyncing(false)
    }
  }

  const handleLogout = async () => {
    const confirmLogout = confirm(
      "Are you sure you want to logout?\n\n" + "You'll need to login again to access the admin dashboard.",
    )

    if (!confirmLogout) return

    try {
      await fetch("/api/admin/logout", { method: "POST" })
      alert("Logged out successfully!")
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
      // Fallback: redirect anyway
      window.location.href = "/"
    }
  }

  const toggleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(filteredProjects.map((p) => p.id))
    }
  }

  const toggleSelectProject = (id: string) => {
    setSelectedProjects((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]))
  }

  const bulkToggleVisibility = async (makeVisible: boolean) => {
    if (selectedProjects.length === 0) {
      alert("Please select projects first.")
      return
    }

    const action = makeVisible ? "show" : "hide"
    const confirmBulk = confirm(`Are you sure you want to ${action} ${selectedProjects.length} selected project(s)?`)

    if (!confirmBulk) return

    try {
      const promises = selectedProjects.map((id) => fetch(`/api/projects/${id}/toggle-visibility`, { method: "POST" }))

      await Promise.all(promises)
      await fetchProjects()
      setSelectedProjects([])
      alert(`${selectedProjects.length} project(s) ${makeVisible ? "shown" : "hidden"} successfully.`)
    } catch (error) {
      alert("Failed to update projects")
    }
  }

  const bulkDelete = async () => {
    if (selectedProjects.length === 0) {
      alert("Please select projects first.")
      return
    }

    // First confirmation
    const confirmBulk = confirm(
      `⚠️ WARNING: You are about to permanently delete ${selectedProjects.length} project(s).\n\n` +
        "This action cannot be undone!\n\n" +
        "Are you sure you want to continue?",
    )

    if (!confirmBulk) return

    // Second confirmation with typing verification
    const confirmText = prompt(`To confirm bulk deletion of ${selectedProjects.length} projects, please type: DELETE`)

    if (confirmText !== "DELETE") {
      if (confirmText !== null) {
        alert("Confirmation text doesn't match. Bulk deletion cancelled.")
      }
      return
    }

    try {
      const promises = selectedProjects.map((id) => fetch(`/api/projects/${id}`, { method: "DELETE" }))

      await Promise.all(promises)
      await fetchProjects()
      setSelectedProjects([])
      alert(`${selectedProjects.length} project(s) deleted successfully.`)
    } catch (error) {
      alert("Failed to delete projects")
    }
  }

  const filteredProjects = projects.filter((project) => {
    if (filter === "visible") return project.isVisible
    if (filter === "hidden") return !project.isVisible
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your portfolio projects</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={syncGitHub}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync GitHub"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold gradient-text">{projects.length}</div>
            <div className="text-gray-400">Total Projects</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">{projects.filter((p) => p.isVisible).length}</div>
            <div className="text-gray-400">Visible Projects</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-red-400">{projects.filter((p) => !p.isVisible).length}</div>
            <div className="text-gray-400">Hidden Projects</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">{projects.reduce((sum, p) => sum + p.stars, 0)}</div>
            <div className="text-gray-400">Total Stars</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {projects.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                {selectedProjects.length === filteredProjects.length ? "Deselect All" : "Select All"}
                {selectedProjects.length > 0 && ` (${selectedProjects.length})`}
              </button>

              {selectedProjects.length > 0 && (
                <>
                  <button
                    onClick={() => bulkToggleVisibility(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                  >
                    Show Selected ({selectedProjects.length})
                  </button>
                  <button
                    onClick={() => bulkToggleVisibility(false)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all"
                  >
                    Hide Selected ({selectedProjects.length})
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                  >
                    Delete Selected ({selectedProjects.length})
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {(["all", "visible", "hidden"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                filter === filterOption
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {filterOption} (
              {filterOption === "all"
                ? projects.length
                : filterOption === "visible"
                  ? projects.filter((p) => p.isVisible).length
                  : projects.filter((p) => !p.isVisible).length}
              )
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleSelectProject(project.id)}
                    className="mt-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          project.isVisible
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {project.isVisible ? "Visible" : "Hidden"}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                        {project.category}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      {project.language && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="font-medium">Language:</span> {project.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium">{project.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{project.forks}</span>
                      </div>
                    </div>

                    {project.topics && project.topics.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.topics.slice(0, 6).map((topic: string) => (
                            <span key={topic} className="px-2 py-1 bg-gray-700 text-xs rounded-md text-gray-300">
                              {topic}
                            </span>
                          ))}
                          {project.topics.length > 6 && (
                            <span className="px-2 py-1 bg-gray-600 text-xs rounded-md text-gray-400">
                              +{project.topics.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-6">
                  <button
                    onClick={() => toggleVisibility(project.id, project.title, project.isVisible)}
                    className={`p-2 rounded-lg transition-all ${
                      project.isVisible ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                    }`}
                    title={project.isVisible ? "Hide project" : "Show project"}
                  >
                    {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                      title="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => deleteProject(project.id, project.title)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {filter === "all"
                ? "No projects found. Try syncing with GitHub to import your repositories."
                : `No ${filter} projects found.`}
            </div>
            {filter === "all" && (
              <button
                onClick={syncGitHub}
                disabled={syncing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {syncing ? "Syncing..." : "Sync GitHub Repositories"}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>Admin Dashboard - Manage your portfolio projects</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
