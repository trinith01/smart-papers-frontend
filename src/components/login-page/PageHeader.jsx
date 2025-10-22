"use client"

export default function PageHeader() {
  return (
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
  )
}
