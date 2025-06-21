"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Github,
  Code,
  Database,
  Brain,
  Star,
  GitFork,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  language?: string;
  stars: number;
  forks: number;
  topics?: string[];
}

export function Projects() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([
        {
          id: "1",
          title: "Sample Project",
          description:
            "This is a sample project while we set up the database connection.",
          category: "fullstack",
          githubUrl: "https://github.com",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          topics: ["react", "nextjs"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const getProjectIcon = (category: string) => {
    if (category === "ml") return <Brain className="w-6 h-6" />;
    if (category === "fullstack") return <Code className="w-6 h-6" />;
    return <Database className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === "ml") return "from-orange-500 to-red-500";
    if (category === "fullstack") return "from-blue-500 to-cyan-500";
    return "from-purple-500 to-pink-500";
  };

  if (loading) {
    return (
      <section id="projects" className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            My <span className="text-gradient">Projects</span>
          </h2>
          <div className="text-center text-slate-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className=" bg-slate-800/30 w-full py-15 section-padding ">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
          My <span className="text-gradient">Projects</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["all", "fullstack", "ml", "backend", "other"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                filter === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "card-subtle text-slate-300 hover:bg-white/10"
              }`}
            >
              {category === "ml" ? "Machine Learning" : category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card-subtle card-hover p-8 group">
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(
                    project.category
                  )}`}
                >
                  {getProjectIcon(project.category)}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    {project.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={14} />
                    {project.forks}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 group-hover:text-gradient transition-all duration-300">
                {project.title}
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {project.description}
              </p>

              {project.language && (
                <div className="mb-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    {project.language}
                  </span>
                </div>
              )}

              {project.topics && project.topics.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {project.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-white/10 text-xs rounded-full text-slate-300 border border-white/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Github size={16} />
                    Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <ExternalLink size={16} />
                    Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
