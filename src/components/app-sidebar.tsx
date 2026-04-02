import { 
  Home, 
  Users,
  Settings,
  BarChart3,
  Calendar,
  FileText,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  Clock,
  CheckSquare,
  MessageSquare,
  FolderOpen
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Main navigation items
const mainMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "#", badge: null },
  { title: "Analytics", icon: BarChart3, url: "#", badge: "New" },
  { title: "Team", icon: Users, url: "#", badge: null },
  { title: "Projects", icon: Briefcase, url: "#", badge: "12" },
  { title: "Tasks", icon: CheckSquare, url: "#", badge: "8" },
  { title: "Calendar", icon: Calendar, url: "#", badge: null },
  { title: "Documents", icon: FolderOpen, url: "#", badge: null },
  { title: "Messages", icon: MessageSquare, url: "#", badge: "3" },
]

// Secondary navigation items
const secondaryMenuItems = [
  { title: "Notifications", icon: Bell, url: "#", badge: "5" },
  { title: "Settings", icon: Settings, url: "#", badge: null },
  { title: "Help & Support", icon: HelpCircle, url: "#", badge: null },
]

// Recent projects
const recentProjects = [
  { name: "Dashboard UI", color: "bg-blue-500", members: 4 },
  { name: "API Integration", color: "bg-green-500", members: 3 },
  { name: "Mobile App", color: "bg-purple-500", members: 5 },
]

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-lg leading-tight">TeamFlow</h2>
                <p className="text-xs text-muted-foreground">workspace</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={toggleSidebar}
              className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="mt-4 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@teamflow.com</p>
              </div>
              <Badge variant="outline" className="h-5 px-1 text-xs">Pro</Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>
      )}

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className={cn(
                      "hover:bg-muted transition-colors",
                      item.title === "Dashboard" && "bg-muted font-medium"
                    )}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === "New" ? "default" : "secondary"}
                          className="h-5 px-1.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Recent Projects */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
              RECENT PROJECTS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                {recentProjects.map((project) => (
                  <div 
                    key={project.name}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className={cn("h-2 w-2 rounded-full", project.color)} />
                    <span className="flex-1 text-sm truncate">{project.name}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">
                      {project.members}
                    </span>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Quick Stats for Collapsed State */}
        {isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="space-y-4 px-1">
                <div className="text-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-medium mt-1">8h</p>
                  <p className="text-[10px] text-muted-foreground">today</p>
                </div>
                <div className="text-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                    <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs font-medium mt-1">12</p>
                  <p className="text-[10px] text-muted-foreground">tasks</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarSeparator className="my-2" />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button className="flex items-center gap-3 w-full hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="text-sm">Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Version info */}
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            v2.0.0 • Team workspace
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
