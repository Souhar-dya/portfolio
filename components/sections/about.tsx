"use client";

import { useEffect, useRef } from "react";
import { Award, Coffee, Heart, Zap } from "lucide-react";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Award,
      value: "5+",
      label: "Projects Completed",
      color: "text-blue-400",
    },
    
    {
      icon: Heart,
      value: "10+",
      label: "Technologies Mastered",
      color: "text-red-400",
    },
    
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-modern bg-slate-800/20 p-10"
    >
      <div className="container-modern">
        <div className="text-center mb-20">
          <h2 className="reveal-on-scroll text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="reveal-on-scroll w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="reveal-on-scroll space-y-6">
              <div className="card-modern p-8 card-hover-modern">
                <h3 className="text-2xl font-bold text-gradient-warm mb-4">
                  My Journey
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  I'm a passionate Full Stack Developer with expertise in the
                  MERN stack, Next.js, and modern web technologies. My journey
                  in tech is driven by a love for creating innovative solutions
                  that make a real impact on people's lives.
                </p>
              </div>

              
            </div>

            {/* Stats Grid */}
            <div className="reveal-on-scroll grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="card-modern p-6 text-center card-hover-modern group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon
                      className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                    />
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Element */}
          <div className="reveal-on-scroll relative flex justify-center">
            <div className="relative">
              {/* Main Avatar */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-1 card-hover-modern">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden">
                  <div className="text-8xl">👨‍💻</div>

                  {/* Animated rings */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border border-purple-500/20 animate-ping"
                    style={{ animationDuration: "2s", animationDelay: "1s" }}
                  />
                </div>
              </div>

              {/* Floating Tech Icons */}
              <div className="absolute -top-4 -right-4 w-16 h-16 card-modern flex items-center justify-center floating-element">
                <span className="text-2xl">⚛️</span>
              </div>
              <div
                className="absolute -bottom-6 -left-6 w-14 h-14 card-modern flex items-center justify-center floating-element"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-xl">🚀</span>
              </div>
              <div
                className="absolute top-1/2 -left-8 w-12 h-12 card-modern flex items-center justify-center floating-element"
                style={{ animationDelay: "2s" }}
              >
                <span className="text-lg">💡</span>
              </div>
              <div
                className="absolute top-1/4 -right-8 w-10 h-10 card-modern flex items-center justify-center floating-element"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-sm">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
