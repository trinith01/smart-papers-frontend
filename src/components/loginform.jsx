"use client"

import { useState, useEffect } from "react"
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
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (error && (error.includes("internet") || error.includes("network"))) {
        setError("")
      }
    }
    const handleOffline = () => {
      setIsOnline(false)
      setError("You are currently offline. Please check your internet connection.")
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error])

  // Helper function to get human-readable error messages
  const getErrorMessage = (error) => {
    // Firebase Authentication errors
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return "Please enter a valid email address."
        case 'auth/user-disabled':
          return "This account has been disabled. Please contact support."
        case 'auth/user-not-found':
          return "No account found with this email address. Please check your email or sign up."
        case 'auth/wrong-password':
          return "Incorrect password. Please try again."
        case 'auth/invalid-credential':
          return "Invalid email or password. Please check your credentials."
        case 'auth/too-many-requests':
          return "Too many failed login attempts. Please try again later or reset your password."
        case 'auth/network-request-failed':
          return "Network connection failed. Please check your internet connection and try again."
        case 'auth/timeout':
          return "Connection timeout. Please check your internet connection and try again."
        case 'auth/invalid-login-credentials':
          return "Invalid login credentials. Please check your email and password."
        case 'auth/email-already-in-use':
          return "This email is already registered. Try logging in instead."
        case 'auth/weak-password':
          return "Password is too weak. Please choose a stronger password."
        default:
          return error.message || "Authentication failed. Please try again."
      }
    }

    // Network and API errors
    if (error.message) {
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        return "Unable to connect to the server. Please check your internet connection and try again."
      }
      if (error.message.includes('timeout')) {
        return "Request timed out. Please check your connection and try again."
      }
      if (error.message.includes('500')) {
        return "Server error occurred. Please try again in a few moments."
      }
      if (error.message.includes('404')) {
        return "Service not available. Please contact support if this persists."
      }
    }

    // Default fallback messages
    if (!navigator.onLine) {
      return "No internet connection. Please check your network and try again."
    }

    return "Login failed. Please check your email and password and try again."
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.")
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error("No internet connection")
      }

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
      try {
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
      } catch (apiError) {
        console.error("API Error:", apiError)
        throw new Error("Unable to fetch user profile. Please try again.")
      }
      
      // Only store if data is valid
      if (res && res.data) {
        localStorage.setItem("userData", JSON.stringify(res.data))
        localStorage.setItem("userRole", role || "Unknown")
        
        setSuccess("Login successful! Redirecting...")
        toast.success("Welcome back! Login successful.")
        
        // Delay navigation slightly to show success message
        setTimeout(() => {
          if (role === "student") {
            navigate("/my-performance")
          } else if (role === "teacher") {
            navigate("/analytics")
          } else {
            navigate("/")
          }
        }, 1000)
      } else {
        throw new Error("Unable to load your profile data. Please try logging in again.")
      }

    } catch (err) {
      console.error("Login error:", err)
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      toast.error(errorMessage)
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
            
            {/* Network status indicator */}
            {!isOnline && (
              <div className="flex items-center justify-center gap-2 p-2 bg-red-500/20 border border-red-400/30 rounded-lg">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12" />
                </svg>
                <span className="text-red-300 text-sm">No internet connection</span>
              </div>
            )}
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
              <div className="relative">
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-400/25 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-300 text-sm font-medium leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="relative">
                <div className="p-4 rounded-xl bg-green-500/15 border border-green-400/25 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-green-300 text-sm font-medium leading-relaxed">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/25 group relative overflow-hidden border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading || !isOnline}
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
              ) : !isOnline ? (
                <div className="flex items-center gap-2 relative z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12" />
                  </svg>
                  No Internet Connection
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
