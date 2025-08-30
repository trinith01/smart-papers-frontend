"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Settings,
  User,
  Menu,
  LogOut,
  ChevronDown,
  GraduationCap,
  PackagePlus,
  VideoIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auth } from "./firabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/services/api";

// Navigation items
const navItems = [
  {
    title: "MCQ Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "View quiz performance and statistics",
  },
  {
    title: "Create Paper",
    href: "/create-mcq",
    icon: FileText,
    description: "Create new question papers and quizzes",
  },
  {
    title: "Quick Anlize",
    href: "/quick-analyze",
    icon: Settings,
    description: "Manage system settings and configurations",
  },
  {
    title: "My performance",
    href: "/my-performance",
    icon: User,
    description: "View your personal performance metrics",
  },
  {
    title: "Question Bank",
    href: "/question-bank",
    icon: PackagePlus,
    description: "View your personal performance metrics",
  },
  {
    title: "Study Material",
    href: "/video-upload",
    icon: VideoIcon,
    descrition: "add your video",
  },
];

// Filter nav items based on role
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
  role: "Administrator",
};

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [userData, setUserData] = useState(user); // Replace with actual user data fetching logic
  const [role, setRole] = useState(
    () => localStorage.getItem("userRole") || "student"
  ); // Assuming role is part of userData
  const location = useLocation();
  const navigate = useNavigate();

  // Move filteredNavItems inside the component so it re-computes on role change
  const filteredNavItems = navItems.filter((item) => {
    if (role === "student") {
      return (
        item.title !== "MCQ Analytics" &&
        item.title !== "Create Paper" &&
        item.title !== "Question Bank" &&
        item.title !== "Study Material"
      );
    } else if (role === "teacher") {
      return item.title !== "Quick Anlize" && item.title !== "My performance";
    }
    return true;
  });

  const isActive = (href) => location.pathname === href;

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("userData")) || {};
      console.log("Logged in user data from nav bar:", loggedInUser);
      setUserData(loggedInUser);
      const uuid = auth.currentUser?.uid;
      if (uuid) {
        try {
          // Get the user's role from Firebase custom claims
          const idTokenResult = await auth.currentUser.getIdTokenResult();
          const userRole =
            localStorage.getItem("userRole") ||
            idTokenResult.claims.role ||
            "student"; // Default to "student" if no role found
          console.log("role from localStorage or Firebase:", userRole);
          setRole(userRole);
          console.log("User role:", userRole);
          console.log("User role:", userRole);
          let res;
          if (role === "student") {
            res = await api.get(`/api/students/${uuid}`);
          } else if (role === "teacher") {
            res = await api.get(`/api/teachers/${uuid}`);
          } else {
            // fallback or handle unknown role
            res = {
              data: {
                name: "Unknown",
                email: auth.currentUser.email,
                role: role || "Unknown",
              },
            };
          }
          setUserData(res.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setLogoutDialogOpen(false);
    localStorage.removeItem("userData"); // Clear user data from localStorage
    localStorage.removeItem("userRole"); // Clear user role from localStorage

    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center">
          {/* Logo */}
      
          <div className="mr-10 ml-2">
            {" "}
            {/* increased margin */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute rounded-xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-1 rounded-xl shadow-lg">
                  <img
                    src="https://viduna.lk/wp-content/uploads/2022/05/logo-120x82.png"
                    alt="Viduna Logo"
                    className="w-12 h-12 object-contain drop-shadow-md" // bigger + shadow
                  />
                </div>
              </div>
              <span className="hidden font-bold sm:inline-block text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Viduna
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium flex-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 relative group",
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50/80 backdrop-blur-sm shadow-sm"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                )}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 rounded-xl px-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {userData.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex md:flex-col md:items-start md:ml-3">
                    <span className="text-sm font-medium text-gray-800">
                      {userData.name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="hidden md:block ml-2 h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                          {userData.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none text-gray-800">
                          {userData.name}
                        </p>
                        <p className="text-xs leading-none text-gray-500 mt-1">
                          {userData.email}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200 capitalize"
                        >
                          {role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200/50" />
                <DropdownMenuItem
                  asChild
                  className="p-3 hover:bg-blue-50/80 transition-colors duration-200"
                >
                  <Link to="/profile-setting" className="flex items-center">
                    <div className="p-1 bg-blue-100 rounded-lg mr-3">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Profile Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200/50" />
                <Dialog
                  open={logoutDialogOpen}
                  onOpenChange={setLogoutDialogOpen}
                >
                  <DropdownMenuItem
                    className="text-red-600 p-3 hover:bg-red-50/80 transition-colors duration-200"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    <div className="p-1 bg-red-100 rounded-lg mr-3">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span>Log out</span>
                  </DropdownMenuItem>
                  <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 flex items-center gap-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        Confirm Logout
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Are you sure you want to log out? You'll need to sign in
                        again to access your account.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="bg-white/80 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                      >
                        Log out
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-xl border-gray-200/50"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    Navigation Menu
                  </SheetTitle>
                  <SheetDescription className="text-gray-600">
                    Access all QuizMaster AI features
                  </SheetDescription>
                </SheetHeader>

                {/* User Info in Mobile */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src={"/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                        {userData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-xs bg-blue-50 text-blue-700 border-blue-200 capitalize"
                      >
                        {role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 mt-6">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                        isActive(item.href)
                          ? "bg-blue-50/80 text-blue-600 shadow-sm"
                          : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          isActive(item.href) ? "bg-blue-100" : "bg-gray-100"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            isActive(item.href)
                              ? "text-blue-600"
                              : "text-gray-500"
                          )}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span>{item.title}</span>
                        <span className="text-xs text-gray-500">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  ))}

                  <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-2">
                    <Link
                      to="/profile-setting"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="size-4 text-gray-500" />
                      </div>
                      <span>Profile Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setTimeout(() => setLogoutDialogOpen(true), 100);
                      }}
                      className="w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 text-red-600 hover:bg-red-50/50"
                    >
                      <div className="p-2 bg-red-100 rounded-lg">
                        <LogOut className="size-4 text-red-600" />
                      </div>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-white/80 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
