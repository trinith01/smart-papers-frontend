"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart3, Shield, Zap, FileText, Smartphone } from "lucide-react"

export default function FeatureCards() {
  const features = [
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Teachers, Students & Institutes"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Performance insights & trends"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Intelligent question generation"
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "MCQ, Theory & Calculation"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Responsive design"
    }
  ]

  return (
    <div className="lg:col-span-8 space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
          QuizMaster AI
        </h2>
        <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
          Revolutionize your teaching with AI-powered quiz creation and intelligent analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
