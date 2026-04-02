import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Inner component to access sidebar state
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  return (
    <div className={cn(
      "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
      !isMobile && (isCollapsed ? "ml-[var(--sidebar-width-collapsed)]" : "ml-[var(--sidebar-width)]")
    )}>
      <Header />
      <main className="flex-1 overflow-y-auto ">
        <SidebarTrigger className="mb-4 md:hidden" />
        <div className="mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </SidebarProvider>
  )
}
