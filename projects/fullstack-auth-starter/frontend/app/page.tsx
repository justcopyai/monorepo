'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Sparkles, Users, Database, Lock, Code, Send, Zap, Star, Rocket } from 'lucide-react'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import api from './lib/api'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', content: 'Just chat with me and bring your ideas into reality in seconds! ⚡', delay: 0 },
    { id: 2, type: 'user', content: 'How does this work exactly?', delay: 1500 },
    { id: 3, type: 'bot', content: 'Simple! Describe your app idea → I generate the code → Deploy instantly. This template includes everything: Next.js, Express, auth, database...', delay: 3000 },
    { id: 4, type: 'user', content: 'That sounds amazing! Can I try it now?', delay: 5000 },
    { id: 5, type: 'bot', content: 'Absolutely! Click "Start Building" below and watch your ideas transform into working applications. Welcome to the future of development! 🚀', delay: 7000 },
  ])
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const userData = await api.auth.getCurrentUser()
          setUser(userData.user)
        } catch (error) {
          // Token might be expired or invalid
          api.removeToken()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // Animate chat messages
  useEffect(() => {
    if (!loading && !user) {
      chatMessages.forEach((message, index) => {
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, message.id])
        }, message.delay)
      })
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="min-h-screen justcopy-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-[#00cc6a]/30 rounded-full animate-ping"></div>
        </motion.div>
      </div>
    )
  }

  if (user) {
    return <Dashboard user={user} setUser={setUser} />
  }

  const features = [
    { icon: <Rocket className="w-6 h-6" />, title: "Next.js Frontend", desc: "Modern React with SSR", color: "text-blue-400" },
    { icon: <Database className="w-6 h-6" />, title: "SQLite Database", desc: "Lightweight & fast", color: "text-purple-400" },
    { icon: <Lock className="w-6 h-6" />, title: "JWT Authentication", desc: "Secure user system", color: "text-green-400" },
    { icon: <Code className="w-6 h-6" />, title: "Express Backend", desc: "Robust API server", color: "text-orange-400" },
  ]

  return (
    <div className="min-h-screen justcopy-gradient overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00ff88]/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#00cc6a]/15 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-black via-slate-950 to-black rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/30 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="px-8 py-6 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-lg shadow-[#00ff88]/50 animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00ff88]/30 animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white/95 tracking-wide leading-none">JustCopy AI Assistant</h3>
                </div>
                <div className="ml-auto">
                  <span className="relative text-xs font-bold bg-gradient-to-r from-[#00ff88]/20 to-[#00cc6a]/20 px-4 py-2 rounded-full border border-[#00ff88]/30 tracking-wider shadow-lg shadow-[#00ff88]/20 backdrop-blur-sm">
                    <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">Live Demo</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {chatMessages.map((message) => (
                  visibleMessages.includes(message.id) && (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-medium'
                          : 'bg-white/[0.08] text-white border border-white/[0.1]'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.1] rounded-2xl p-3">
                <input
                  type="text"
                  placeholder="Try: 'Build me a social media app with user auth'"
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                  disabled
                />
                <button className="p-2 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-xl text-black hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left text-white space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-[#00ff88] mb-4" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                  JustCopy
                </span>
                <br />
                <span className="text-white">Premium Template</span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-lg">
                Chat with AI and bring your ideas into reality in seconds. 
                Full-stack applications generated instantly with professional-grade architecture.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4 text-center hover:bg-white/[0.08] transition-all"
                >
                  <div className={`${feature.color} mb-2 flex justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/60">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              className="group bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-[#00ff88]/20 hover:shadow-[#00ff88]/40 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <Rocket className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                Start Building
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-180" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onLogin={setUser}
        />
      )}
    </div>
  )
}