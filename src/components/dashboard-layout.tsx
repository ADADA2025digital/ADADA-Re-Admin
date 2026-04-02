import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}
interface DashboardStatsProps {
  stats: {
    totalMembers: number;
    tasksCompleted: number;
    hoursLogged: number;
    pendingReviews: number;
  }
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
