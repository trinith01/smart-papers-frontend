"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "./firabase"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import api from "@/services/api"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // Sign in user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const uid = user.uid
      // Get Firebase custom claims (must be set server-side)
      const idTokenResult = await user.getIdTokenResult()
      const role = idTokenResult.claims.role
      console.log("User UID:", uid)
      console.log("User role:", role)
      let res
      if (role === "student") {
        res = await api.get(`/api/students/${uid}`)
      } else if (role === "teacher") {
        res = await api.get(`/api/teachers/${uid}`)
      } else {
        res = {
          data: {
            name: "Unknown",
            email: user.email,
            role: role || "Unknown",
          },
        }
      }
      // Only store if data is valid
      if (res && res.data) {
        localStorage.setItem("userData", JSON.stringify(res.data))
        localStorage.setItem("userRole", role || "Unknown")
        toast("Login successful!")
        // Only navigate after storage
        if (role === "student") {
          navigate("/my-performance")
        } else if (role === "teacher") {
          navigate("/analytics")
        } else {
          navigate("/")
        }
      } else {
        setError("Failed to retrieve user data.")
        toast.error("Failed to retrieve user data.")
      }

      // or role-based navigation
    } catch (err) {
      console.error(err)
      setError("Invalid email or password")
      toast.error("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
      
              <h1 className="text-2xl font-bold text-white">Login to your account</h1>
           
            </div>
            <p className="text-gray-300">Enter your email below to login to your account</p>
          </div>

          <form className={cn("space-y-6", className)} {...props} onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/25 group relative overflow-hidden border border-white/30"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 inline-block text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2 relative z-10">
                  Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
