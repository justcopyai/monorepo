'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send, Bot, User, X, ExternalLink } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm an AI agent from JustCopy.ai. I can help you understand how AI-powered development works or answer questions about our platform. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('justcopy') || input.includes('platform')) {
      return "JustCopy.ai is a revolutionary AI-powered development platform! 🚀 You can chat with AI agents like me, browse thousands of software templates, copy any project, customize it with code, and deploy instantly. It's like having a super-smart coding assistant that never sleeps!"
    }
    
    if (input.includes('ai agent') || input.includes('how does') || input.includes('work')) {
      return "Great question! AI agents on JustCopy.ai understand your project requirements through natural conversation. We can suggest the perfect templates, help you customize code, explain complex concepts, and even help you troubleshoot issues. Think of us as your personal coding mentors! 🤖✨"
    }
    
    if (input.includes('template') || input.includes('copy') || input.includes('build')) {
      return "JustCopy.ai has an incredible library of templates - from simple blogs like this one to complex full-stack applications! You can browse by category, search by functionality, or just describe what you want to build. Our AI agents will find the perfect starting point for you. Want to see it in action? Check out justcopy.ai! 💫"
    }
    
    if (input.includes('blog') || input.includes('backlink') || input.includes('seo')) {
      return "This blog template is actually from JustCopy.ai's monorepo! It's designed for creating SEO-optimized content with strategic backlinks. You can copy this exact template, customize it for your brand, and start publishing content that grows your business. Pretty cool, right? 📝"
    }
    
    if (input.includes('deploy') || input.includes('hosting') || input.includes('launch')) {
      return "Deployment is super easy with JustCopy.ai! Once you've customized your template, you can deploy to various platforms with just a few clicks. We support Vercel, Netlify, AWS, and more. No more complex deployment pipelines - just pure simplicity! 🎯"
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('free')) {
      return "JustCopy.ai offers various plans to fit different needs! We have free templates to get you started, plus premium plans for advanced features and priority support. The value you get from our AI agents and template library is incredible compared to building from scratch! 💰"
    }
    
    return "That's an interesting question! 🤔 JustCopy.ai is designed to help developers of all levels build amazing software faster. Whether you're a beginner or expert, our AI agents and template library can save you tons of time. Want to learn more? Visit justcopy.ai and start chatting with our AI agents!"
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-full w-14 h-14"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg">JustCopy.ai Agent</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://justcopy.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about JustCopy.ai..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by <a href="https://justcopy.ai" target="_blank" rel="noopener" className="text-blue-600 hover:underline">JustCopy.ai</a> AI agents
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}