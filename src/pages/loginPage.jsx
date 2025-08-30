"use client"

import { GraduationCap, Brain, Target, TrendingUp } from "lucide-react"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { HyperText } from "@/components/magicui/hyper-text"
import image from "@/assets/sujith-sir-cover-photo.png"
import { LoginForm } from "@/components/loginform"

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
            <div className="lg:col-span-12 mb-4 lg:mb-0">
              <div className="flex items-center gap-3 sm:gap-4 group justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                  <div className="relative p-2 sm:p-3 rounded-2xl shadow-xl bg-white/15 backdrop-blur-md border border-white/20">
                    <img
                      src="https://viduna.lk/wp-content/uploads/2022/05/logo-120x82.png"
                      alt="Viduna Logo"
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                    />
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Viduna
                </h1>
              </div>
            </div>

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
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 h-full">
                {/* ප්‍රතිපල සමාලෝචනය */}
                <div className="group relative p-4 sm:p-5 lg:p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col lg:flex-row lg:items-center text-center lg:text-left space-y-2 lg:space-y-0 lg:space-x-3 h-full justify-center">
                    <div className="p-2 sm:p-2.5 lg:p-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 mx-auto lg:mx-0 w-fit">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-blue-200" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm lg:text-sm">ප්‍රතිපල සමාලෝචනය</h3>
                      <p className="text-xs sm:text-sm lg:text-xs text-gray-300 leading-relaxed">ප්‍රශ්න පත්‍ර ශ්‍රේණිගත කිරීම</p>
                    </div>
                  </div>
                </div>

                {/* දුර්වල ඒකක වර්ගීකරණය */}
                <div className="group relative p-4 sm:p-5 lg:p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col lg:flex-row lg:items-center text-center lg:text-left space-y-2 lg:space-y-0 lg:space-x-3 h-full justify-center">
                    <div className="p-2 sm:p-2.5 lg:p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 mx-auto lg:mx-0 w-fit">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-purple-200" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm lg:text-sm">දුර්වල ඒකක වර්ගීකරණය</h3>
                      <p className="text-xs sm:text-sm lg:text-xs text-gray-300 leading-relaxed">පාඩම් අනුව වර්ගීකරණය</p>
                    </div>
                  </div>
                </div>

                {/* ප්‍රගති සමාලෝචනය */}
                <div className="group relative p-4 sm:p-5 lg:p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105 lg:col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col lg:flex-row lg:items-center text-center lg:text-left space-y-2 lg:space-y-0 lg:space-x-3 h-full justify-center">
                    <div className="p-2 sm:p-2.5 lg:p-2 rounded-xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/20 mx-auto lg:mx-0 w-fit">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-indigo-200" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm lg:text-sm">ප්‍රගති සමාලෝචනය</h3>
                      <p className="text-xs sm:text-sm lg:text-xs text-gray-300 leading-relaxed">සවිස්තර විශේෂණය</p>
                    </div>
                  </div>
                </div>

                {/* මාර්ගගත බහුවරණ ප්‍රශ්නපත්‍ */}
                <div className="group relative p-4 sm:p-5 lg:p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 lg:col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col lg:flex-row lg:items-center text-center lg:text-left space-y-2 lg:space-y-0 lg:space-x-3 h-full justify-center">
                    <div className="p-2 sm:p-2.5 lg:p-2 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 mx-auto lg:mx-0 w-fit">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-emerald-200" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm lg:text-sm">මාර්ගගත ප්‍රශ්නපත්‍</h3>
                      <p className="text-xs sm:text-sm lg:text-xs text-gray-300 leading-relaxed">විශේෂයෙන් සකස් කළ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
