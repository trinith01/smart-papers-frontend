import { LoginForm } from "@/components/loginform"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { GraduationCap, Brain, Target, TrendingUp } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 ">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                QuizMaster AI
              </h1>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  MCQ Skills
                </span>
                with AI
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Transform your study experience with AI-powered quiz management, personalized learning paths, and
                intelligent mistake analysis.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="p-2 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Study Plans</h3>
                  <p className="text-sm text-gray-600">Personalized learning</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="p-2 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
                  <p className="text-sm text-gray-600">Track weak areas</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                <div className="p-2 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">Monitor improvement</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                <div className="p-2 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quiz Categories</h3>
                  <p className="text-sm text-gray-600">Organized learning</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center p-4 rounded-xl bg-white/60 border border-gray-200/50 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 border border-gray-200/50 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  1M+
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 border border-gray-200/50 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
