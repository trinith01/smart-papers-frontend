"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginForm({ 
  onLogin, 
  onRegister, 
  loginData, 
  setLoginData, 
  registerData, 
  setRegisterData, 
  loginError, 
  registerError, 
  isLoginLoading, 
  isRegisterLoading 
}) {
  const [showPassword, setShowPassword] = useState(false)

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    onRegister()
  }

  const handleLoginInputChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegisterInputChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="lg:col-span-4 flex justify-center">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-100"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-100"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-blue-100/80">
                  Sign in to your QuizMaster AI account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => handleLoginInputChange("email", e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => handleLoginInputChange("password", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {loginError && (
                    <Alert className="bg-red-500/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-100">
                        {loginError}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-blue-100/80">
                  Join QuizMaster AI today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName" className="text-white">First Name</Label>
                      <Input
                        id="register-firstName"
                        placeholder="John"
                        value={registerData.firstName}
                        onChange={(e) => handleRegisterInputChange("firstName", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName" className="text-white">Last Name</Label>
                      <Input
                        id="register-lastName"
                        placeholder="Doe"
                        value={registerData.lastName}
                        onChange={(e) => handleRegisterInputChange("lastName", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="john@example.com"
                      value={registerData.email}
                      onChange={(e) => handleRegisterInputChange("email", e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-white">Phone Number</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={registerData.phoneNumber}
                      onChange={(e) => handleRegisterInputChange("phoneNumber", e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role" className="text-white">Role</Label>
                    <Select 
                      value={registerData.role} 
                      onValueChange={(value) => handleRegisterInputChange("role", value)}
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-white/50">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="teacher" className="text-white">Teacher</SelectItem>
                        <SelectItem value="student" className="text-white">Student</SelectItem>
                        <SelectItem value="institute" className="text-white">Institute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => handleRegisterInputChange("password", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-100/50 focus:border-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {registerError && (
                    <Alert className="bg-red-500/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-100">
                        {registerError}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
