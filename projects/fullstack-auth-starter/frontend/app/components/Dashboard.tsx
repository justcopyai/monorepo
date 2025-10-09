'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Plus, Folder, Clock, User, Sparkles, Code, Upload } from 'lucide-react'
import api from '../lib/api'

interface DashboardProps {
  user: any
  setUser: (user: any) => void
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await api.request('/api/projects')
      setProjects(data || [])  // API returns array directly
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])  // Set empty array on error
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.request('/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProject)
      })
      
      setNewProject({ title: '', description: '' })
      setShowCreateModal(false)
      fetchProjects()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <div className="min-h-screen justcopy-gradient">
      {/* Enhanced Header with JustCopy Branding */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b border-white/[0.08] bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.01]"
      >
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-lg shadow-[#00ff88]/50 animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00ff88]/30 animate-ping"></div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}! 👋</h1>
                <p className="text-sm text-white/60 flex items-center gap-2">
                  <span>{user.email}</span>
                  <span className="text-xs bg-gradient-to-r from-[#00ff88]/20 to-[#00cc6a]/20 px-2 py-1 rounded-full border border-[#00ff88]/30">
                    <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent font-bold">JustCopy Pro</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/files')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#00ff88]/10 to-[#00cc6a]/10 border border-[#00ff88]/30 rounded-2xl text-white hover:bg-[#00ff88]/20 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Files</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white hover:bg-white/[0.08] transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-8 py-12">
        {/* Enhanced Stats with JustCopy Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="glass-effect p-8 rounded-3xl text-white text-center border border-white/[0.1] hover:border-[#00ff88]/30 transition-all group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-r from-[#00ff88]/20 to-[#00cc6a]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-[#00ff88]/20 transition-all"
            >
              <Folder className="w-6 h-6 text-[#00ff88]" />
            </motion.div>
            <p className="text-3xl font-bold mb-2">{projects.length}</p>
            <p className="text-sm text-white/60">AI-Generated Projects</p>
          </div>
          <div className="glass-effect p-8 rounded-3xl text-white text-center border border-white/[0.1] hover:border-blue-400/30 transition-all group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all"
            >
              <Sparkles className="w-6 h-6 text-blue-400" />
            </motion.div>
            <p className="text-3xl font-bold mb-2">∞</p>
            <p className="text-sm text-white/60">AI Possibilities</p>
          </div>
          <div className="glass-effect p-8 rounded-3xl text-white text-center border border-white/[0.1] hover:border-purple-400/30 transition-all group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all"
            >
              <Clock className="w-6 h-6 text-purple-400" />
            </motion.div>
            <p className="text-3xl font-bold mb-2">⚡</p>
            <p className="text-sm text-white/60">Lightning Fast</p>
          </div>
        </motion.div>

        {/* Enhanced Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-8 rounded-3xl border border-white/[0.1]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00ff88]/20 to-[#00cc6a]/20 rounded-2xl flex items-center justify-center mr-4">
                  <Code className="w-5 h-5 text-[#00ff88]" />
                </div>
                Your AI Projects
              </h2>
              <p className="text-white/60 text-sm">Chat-generated applications ready to deploy</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-2xl text-black font-bold shadow-lg shadow-[#00ff88]/20 hover:shadow-[#00ff88]/40 transition-all"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Chat to Create</span>
            </motion.button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center text-white py-16">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-gradient-to-r from-[#00ff88]/20 to-[#00cc6a]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#00ff88]/30"
              >
                <Sparkles className="w-10 h-10 text-[#00ff88]" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                Ready to Create Magic?
              </h3>
              <p className="text-white/60 text-lg mb-4">Chat with AI and watch your ideas come to life</p>
              <p className="text-white/40 text-sm">Try: "Build me a todo app with user authentication"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project: any, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 p-4 rounded-xl border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Folder className="w-6 h-6 text-blue-300" />
                    <span className="text-xs text-gray-400">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm">
                    {project.description || 'No description'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-effect p-6 rounded-2xl w-full max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Chat to Create Your App</h3>
            <p className="text-white/60 text-sm mb-6">Describe your idea and let AI build it for you</p>
            <form onSubmit={createProject} className="space-y-4">
              <input
                type="text"
                placeholder="My Amazing App"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Tell AI what you want to build: 'A social media app with posts, likes, and real-time chat...'"
                rows={4}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#00ff88]/50 resize-none transition-all"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-white/[0.1] rounded-2xl text-white hover:bg-white/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-2xl text-black font-bold disabled:opacity-50 hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all"
                >
                  {loading ? 'Creating Magic...' : 'Let AI Build It! ✨'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}