import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Outlet } from "react-router-dom";
import { NavigationBar } from "@/components/navigation-bar";
import { Toaster } from "sonner";
export default function Layout({ children }) {
  return (
    <>
      <NavigationBar />
      <main className="border-blue-400 border-4">
        <Outlet />
        <Toaster  />
      </main>
    </>

    // <SidebarProvider>
    //   <AppSidebar />

    //   <main className="flex flex-1 flex-col overflow-hidden">
    //      <SidebarTrigger />
    //     {children}

    //   </main>
    // </SidebarProvider>
  );
}
