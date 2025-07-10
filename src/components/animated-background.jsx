"use client"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      {/* Elegant Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.1)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 Q150,50 300,100 T600,100"
          stroke="url(#line-gradient-light)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M100,200 Q250,150 400,200 T700,200"
          stroke="url(#line-gradient-light)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse delay-500"
        />
      </svg>

      {/* Sparkle Effects */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-ping delay-2000"></div>
    </div>
  )
}
