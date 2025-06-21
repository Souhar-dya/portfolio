"use client"

import { useState, useEffect, useRef } from "react"
import { Code, Database, Wrench, Brain, ChevronRight } from "lucide-react"

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("frontend")
  const sectionRef = useRef<HTMLElement>(null)

  const skillCategories = {
    frontend: {
      title: "Frontend",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "React", description: "Building dynamic UIs" },
        { name: "Next.js", description: "Full-stack React framework" },
        { name: "TypeScript", description: "Type-safe JavaScript" },
        { name: "TailwindCSS", description: "Utility-first CSS" },
        { name: "JavaScript", description: "Core web programming" },
        // { name: "HTML5", description: "Modern web markup" },
        // { name: "CSS3", description: "Advanced styling" },
      ],
    },
    backend: {
      title: "Backend",
      icon: Database,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Node.js", description: "Server-side JavaScript" },
        { name: "Express", description: "Web application framework" },
        { name: "Prisma", description: "Next-gen ORM" },
        { name: "MongoDB", description: "NoSQL database" },
        { name: "PostgreSQL", description: "Relational database" },
        { name: "MySQL", description: "Popular SQL database" },
        { name: "REST APIs", description: "API design & development" },
      ],
    },
    tools: {
      title: "Tools & DevOps",
      icon: Wrench,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Docker", description: "Containerization" },
        // { name: "AWS", description: "Cloud services" },
        { name: "Git/GitHub", description: "Version control" },
        // { name: "Linux", description: "Operating system" },
        { name: "VS Code", description: "Code editor" },
        { name: "Postman", description: "API testing" },
      ],
    },
    // other: {
    //   title: "Other",
    //   icon: Brain,
    //   color: "from-orange-500 to-red-500",
    //   skills: [
    //     { name: "Python", description: "Data science & automation" },
    //     // { name: "Machine Learning", description: "AI & data analysis" },
    //     { name: "Socket.io", description: "Real-time communication" },
    //     { name: "Redux", description: "State management" },
    //     { name: "Figma", description: "UI/UX design" },
    //     { name: "Responsive Design", description: "Mobile-first approach" },
    //   ],
    // },
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const currentCategory = skillCategories[activeCategory as keyof typeof skillCategories]

  return (
    <section ref={sectionRef} id="skills" className="section-modern">
      <div className="container-modern">
        <div className="text-center mb-20">
          <h2 className="reveal-on-scroll text-5xl md:text-6xl font-bold mb-6">
            My <span className="text-gradient">Skills</span>
          </h2>
          <div className="reveal-on-scroll w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Category Tabs */}
        <div className="reveal-on-scroll flex flex-wrap justify-center gap-4 mb-16">
          {Object.entries(skillCategories).map(([key, category]) => {
            const Icon = category.icon
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 group ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                    : "card-modern text-slate-300 hover:bg-white/10 card-hover-modern"
                }`}
              >
                <Icon size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                {category.title}
                {activeCategory === key && <ChevronRight size={16} className="animate-pulse" />}
              </button>
            )
          })}
        </div>

        {/* Skills Grid */}
        <div className="reveal-on-scroll grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {currentCategory.skills.map((skill, index) => (
            <div
              key={skill.name}
              className="card-modern p-6 card-hover-modern group relative overflow-hidden text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Skill Icon/Badge */}
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${currentCategory.color} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">{skill.name.charAt(0)}</span>
              </div>

              {/* Skill Name */}
              <h3 className="text-lg font-bold text-white group-hover:text-gradient transition-all duration-300 mb-2">
                {skill.name}
              </h3>


              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentCategory.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="reveal-on-scroll mt-20 text-center">
          
        </div>
      </div>

      
    </section>
  )
}
