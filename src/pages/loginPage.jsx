"use client"

import { GraduationCap, Brain, Target, TrendingUp } from "lucide-react"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { HyperText } from "@/components/magicui/hyper-text"
import image from "@/assets/sujith-sir-cover-photo.png"
import { LoginForm } from "@/components/loginform"
import PageHeader from "@/components/login-page/PageHeader"
import FeatureCards from "@/components/login-page/FeatureCards"

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/login"
  }

  const handleGetStarted = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with enhanced overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <img src={image || "/placeholder.svg"} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Modern Bento Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Header Logo - Spans full width on mobile, partial on desktop */}
            <PageHeader />

            {/* Hero Text Section - Large card */}
            <div className="lg:col-span-5 relative">
              <div className="h-full p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 h-full flex flex-col justify-center">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                      <TypingAnimation startOnView={true}>දකුණේ අකුණ</TypingAnimation>
                    </h2>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
                      <HyperText className="bg-gradient-to-r from-red-300 via-red-200 to-orange-200 bg-clip-text text-transparent">
                        සුජිත් ලියනගේ
                      </HyperText>
                    </h1>
                  </div>

                  <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-light leading-relaxed">
                    This is a pilot project under viduna  institute
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Cards - Compact 2x2 grid */}
            <FeatureCards />

            {/* Login Form - Expanded with better responsive design */}
            <div className="lg:col-span-4">
              <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative h-full flex items-center justify-center p-4 lg:p-6">
                  <div className="w-full max-w-sm mx-auto">
                    <LoginForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
