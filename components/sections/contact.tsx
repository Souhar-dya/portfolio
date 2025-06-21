"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="section-padding ">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
          Get In <span className="text-gradient">Touch</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's work together!</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                I'm always interested in new opportunities and exciting projects. Whether you have a question or just
                want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">Email</div>
                  <div className="text-slate-400">kundusouhardya@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">Phone</div>
                  <div className="text-slate-400">+91 8927541629</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">Location</div>
                  <div className="text-slate-400">India</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://github.com/Souhar-dya"
                className="p-4 card-subtle hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/souhardya-kundu/"
                className="p-4 card-subtle hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={24} />
              </a>
             
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="card-subtle p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-3 text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-400"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-3 text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-3 text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-white placeholder-slate-400"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 py-4">
                  <Send size={20} />
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
