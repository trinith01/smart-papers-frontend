"use client"

import {
  Leaf,
  Microscope,
  Dna,
  Calculator,
  Triangle,
  Sigma,
  TrendingUp,
  BarChart,
  DollarSign,
  PieChart,
  Atom,
  Zap,
  Magnet,
  FlaskRoundIcon as Flask,
  Beaker,
  TestTube,
  Code,
  Cpu,
  Binary,
  Book,
  PenTool,
  Languages,
  Globe,
  Map,
  Clock,
  Brain,
  BookOpen,
  Target,
  Star,
  Trophy,
  GraduationCap,
} from "lucide-react"

export function FloatingElements() {
  // Subject-specific icons with colors for light theme
  const subjectIcons = [
    // Biology
    { Icon: Leaf, delay: "0s", duration: "8s", color: "text-green-500/40", subject: "biology" },
    { Icon: Microscope, delay: "1s", duration: "10s", color: "text-emerald-500/40", subject: "biology" },
    { Icon: Dna, delay: "2s", duration: "9s", color: "text-green-600/40", subject: "biology" },

    // Mathematics
    { Icon: Calculator, delay: "1.5s", duration: "7s", color: "text-blue-500/40", subject: "math" },
    { Icon: Triangle, delay: "3s", duration: "11s", color: "text-indigo-500/40", subject: "math" },
    { Icon: Sigma, delay: "4s", duration: "8s", color: "text-cyan-500/40", subject: "math" },

    // Business
    { Icon: TrendingUp, delay: "2.5s", duration: "9s", color: "text-orange-500/40", subject: "business" },
    { Icon: BarChart, delay: "5s", duration: "10s", color: "text-amber-500/40", subject: "business" },
    { Icon: DollarSign, delay: "6s", duration: "7s", color: "text-green-600/40", subject: "business" },
    { Icon: PieChart, delay: "7s", duration: "12s", color: "text-yellow-600/40", subject: "business" },

    // Physics
    { Icon: Atom, delay: "3.5s", duration: "9s", color: "text-purple-500/40", subject: "physics" },
    { Icon: Zap, delay: "8s", duration: "8s", color: "text-yellow-500/40", subject: "physics" },
    { Icon: Magnet, delay: "9s", duration: "10s", color: "text-red-500/40", subject: "physics" },

    // Chemistry
    { Icon: Flask, delay: "4.5s", duration: "11s", color: "text-pink-500/40", subject: "chemistry" },
    { Icon: Beaker, delay: "10s", duration: "9s", color: "text-rose-500/40", subject: "chemistry" },
    { Icon: TestTube, delay: "11s", duration: "8s", color: "text-fuchsia-500/40", subject: "chemistry" },

    // Computer Science
    { Icon: Code, delay: "5.5s", duration: "10s", color: "text-teal-500/40", subject: "cs" },
    { Icon: Cpu, delay: "12s", duration: "9s", color: "text-cyan-600/40", subject: "cs" },
    { Icon: Binary, delay: "13s", duration: "11s", color: "text-blue-600/40", subject: "cs" },

    // Literature & Languages
    { Icon: Book, delay: "6.5s", duration: "8s", color: "text-violet-500/40", subject: "literature" },
    { Icon: PenTool, delay: "14s", duration: "10s", color: "text-purple-600/40", subject: "literature" },
    { Icon: Languages, delay: "15s", duration: "9s", color: "text-indigo-600/40", subject: "literature" },

    // Geography & History
    { Icon: Globe, delay: "7.5s", duration: "12s", color: "text-blue-600/40", subject: "geography" },
    { Icon: Map, delay: "16s", duration: "8s", color: "text-sky-500/40", subject: "geography" },
    { Icon: Clock, delay: "17s", duration: "10s", color: "text-gray-500/40", subject: "history" },

    // General Education
    { Icon: Brain, delay: "8.5s", duration: "9s", color: "text-pink-600/40", subject: "general" },
    { Icon: BookOpen, delay: "18s", duration: "11s", color: "text-orange-600/40", subject: "general" },
    { Icon: Target, delay: "19s", duration: "8s", color: "text-red-600/40", subject: "general" },
    { Icon: Star, delay: "20s", duration: "10s", color: "text-yellow-500/40", subject: "general" },
    { Icon: Trophy, delay: "21s", duration: "9s", color: "text-amber-600/40", subject: "general" },
    { Icon: GraduationCap, delay: "22s", duration: "12s", color: "text-emerald-600/40", subject: "general" },
  ]

  // Pi symbol component
  const PiSymbol = () => (
    <div className="w-6 h-6 flex items-center justify-center text-blue-500/40 font-bold text-lg">π</div>
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subject-specific floating icons */}
      {subjectIcons.map(({ Icon, delay, duration, color, subject }, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-60 hover:opacity-80 transition-opacity"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: delay,
            animationDuration: duration,
          }}
        >
          <Icon className={`w-6 h-6 ${color} drop-shadow-sm`} />
        </div>
      ))}

      {/* Special Pi symbols for mathematics */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`pi-${i}`}
          className="absolute animate-float opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${2 + i * 3}s`,
            animationDuration: `${8 + i}s`,
          }}
        >
          <PiSymbol />
        </div>
      ))}

      {/* Mathematical symbols as text */}
      {["∑", "∫", "∆", "∞", "√", "±"].map((symbol, i) => (
        <div
          key={`math-${i}`}
          className="absolute animate-float opacity-50 text-lg font-bold text-blue-500/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${1 + i * 2}s`,
            animationDuration: `${7 + i}s`,
          }}
        >
          {symbol}
        </div>
      ))}

      {/* Elegant Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            background: `linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))`,
          }}
        />
      ))}

      {/* Subject area clusters - subtle light theme */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-200/20 blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-blue-200/20 blur-2xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full bg-purple-200/20 blur-2xl animate-pulse delay-3000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-30 h-30 rounded-full bg-indigo-200/20 blur-2xl animate-pulse delay-4000"></div>
    </div>
  )
}
