interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  pushed_at: string | null
}

export class GitHubService {
  private token: string
  private baseUrl = "https://api.github.com"

  constructor(token: string) {
    this.token = token
  }

  private async makeRequest(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  async getRepositories(): Promise<GitHubRepo[]> {
    const repos = await this.makeRequest("/user/repos?sort=updated&per_page=50")
    return repos.filter((repo: GitHubRepo) => !repo.private) // Only public repos
  }
}
