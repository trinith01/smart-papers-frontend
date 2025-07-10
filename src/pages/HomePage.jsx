"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Users } from "lucide-react"

export default function HomePage() {
  return (
    <>
    <h1>home</h1>
    </>
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    //     <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    //       <div className="flex items-center gap-2 px-4">
    //         <SidebarTrigger className="-ml-1" />
    //         <Separator orientation="vertical" className="mr-2 h-4" />
    //         <Breadcrumb>
    //           <BreadcrumbList>
    //             <BreadcrumbItem className="hidden md:block">
    //               <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
    //             </BreadcrumbItem>
    //             <BreadcrumbSeparator className="hidden md:block" />
    //             <BreadcrumbItem>
    //               <BreadcrumbPage>Overview</BreadcrumbPage>
    //             </BreadcrumbItem>
    //           </BreadcrumbList>
    //         </Breadcrumb>
    //       </div>
    //     </header>
    //     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    //       <div className="grid auto-rows-min gap-4 md:grid-cols-3">
    //         <Card>
    //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //             <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
    //             <FileText className="h-4 w-4 text-muted-foreground" />
    //           </CardHeader>
    //           <CardContent>
    //             <div className="text-2xl font-bold">24</div>
    //             <p className="text-xs text-muted-foreground">+2 from last month</p>
    //           </CardContent>
    //         </Card>
    //         <Card>
    //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //             <CardTitle className="text-sm font-medium">Active Users</CardTitle>
    //             <Users className="h-4 w-4 text-muted-foreground" />
    //           </CardHeader>
    //           <CardContent>
    //             <div className="text-2xl font-bold">1,234</div>
    //             <p className="text-xs text-muted-foreground">+15% from last month</p>
    //           </CardContent>
    //         </Card>
    //         <Card>
    //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //             <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
    //             <BarChart3 className="h-4 w-4 text-muted-foreground" />
    //           </CardHeader>
    //           <CardContent>
    //             <div className="text-2xl font-bold">87%</div>
    //             <p className="text-xs text-muted-foreground">+3% from last month</p>
    //           </CardContent>
    //         </Card>
    //       </div>
    //       <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
    //         <div className="flex flex-col items-center justify-center h-full text-center">
    //           <h2 className="text-2xl font-bold mb-4">Welcome to QuizMaster Admin</h2>
    //           <p className="text-muted-foreground mb-8 max-w-md">
    //             Manage your quizzes, analyze performance, and configure system settings from this modern dashboard.
    //           </p>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
    //             <Card className="cursor-pointer hover:shadow-md transition-shadow">
    //               <CardHeader>
    //                 <CardTitle className="flex items-center gap-2">
    //                   <BarChart3 className="h-5 w-5" />
    //                   MCQ Analytics
    //                 </CardTitle>
    //                 <CardDescription>View detailed analytics and performance metrics</CardDescription>
    //               </CardHeader>
    //             </Card>
    //             <Card className="cursor-pointer hover:shadow-md transition-shadow">
    //               <CardHeader>
    //                 <CardTitle className="flex items-center gap-2">
    //                   <FileText className="h-5 w-5" />
    //                   Create Paper
    //                 </CardTitle>
    //                 <CardDescription>Design and create new question papers</CardDescription>
    //               </CardHeader>
    //             </Card>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </SidebarInset>
    // </SidebarProvider>
  )
}

