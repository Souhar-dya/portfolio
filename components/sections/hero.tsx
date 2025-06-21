"use client"

import { useEffect, useState } from "react"
import { Download, Github, Linkedin, Mail, ArrowDown, Sparkles, Code } from "lucide-react"

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentRole, setCurrentRole] = useState(0)

  const roles = ["Full Stack Developer", "ML Enthusiast", "Problem Solver", "Tech Innovator"]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const downloadResume = () => {
    window.open("https://drive.google.com/file/d/1dPzqGQnhNtqzWi3nrEm2fDiZJLB1LksR/view?usp=sharing", "_blank")
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
        <div
          className="floating-element top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="floating-element bottom-40 left-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
          style={{ animationDelay: "4s" }}
        />

        {/* Interactive cursor glow */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="container-modern relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="reveal-up mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Welcome to my world</span>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Hi, I'm{" "}
              <span className="text-gradient relative">
                Souhardya
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg -z-10" />
              </span>
            </h1>
          </div>

          {/* Dynamic Role */}
          <div className="reveal-up stagger-1 mb-12">
            <div className="text-2xl md:text-4xl font-semibold text-slate-300 h-16 flex items-center justify-center">
              <span className="mr-3">I'm a</span>
              <span className="text-gradient-warm relative overflow-hidden">
                <span
                  className="inline-block transition-all duration-500 ease-in-out"
                  key={currentRole}
                  style={{
                    animation: "slideInUp 0.5s ease-out",
                  }}
                >
                  {roles[currentRole]}
                </span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="reveal-up stagger-2 mb-16">
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Passionate about building{" "}
              <span className="text-blue-400 font-semibold">real-time collaborative platforms</span> and creating{" "}
              <span className="text-purple-400 font-semibold">privacy-focused solutions</span>. Specializing in MERN
              stack, Next.js, and Machine Learning.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="reveal-up stagger-3 flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <button onClick={downloadResume} className="btn-modern flex items-center justify-center gap-3 group">
              <Download size={20} className="group-hover:animate-bounce" />
              Download Resume
            </button>
            <button
              onClick={scrollToProjects}
              className="btn-outline-modern flex items-center justify-center gap-3 group"
            >
              <Code size={20} className="group-hover:rotate-12 transition-transform" />
              View My Work
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Social Links */}
          <div className="reveal-up stagger-4 flex justify-center space-x-6">
            {[
              { icon: Github, href: "https://github.com/Souhar-dya", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/souhardya-kundu/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:kundusouhardya@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 card-modern hover:card-hover-modern rounded-2xl transition-all duration-300"
                aria-label={label}
              >
                <Icon
                  size={24}
                  className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

  

      
    </section>
  )
}
