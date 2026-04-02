import { LayoutDashboard, Shield, Users2, Home, UserCheck, MessageSquare } from "lucide-react"
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
} from "@/components/ui/sidebar"
/* import { Avatar, AvatarFallback } from "@/components/ui/avatar" */
import { Badge } from "@/components/ui/badge"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "@/lib/api"

// Main navigation items
const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/", badge: null },
  /* { title: "Analytics", icon: BarChart3, path: "/analytics", badge: "Live" },
  { title: "Orders", icon: ShoppingCart, path: "/orders", badge: null },
  { title: "Customers", icon: Users, path: "/customers", badge: null },
  { title: "Inventory", icon: Boxes, path: "/inventory", badge: null },
  { title: "Marketing", icon: Megaphone, path: "/marketing", badge: null },
  { title: "Reports", icon: FileText, path: "/reports", badge: null }, */
]

const propertyNavItems = [
  { title: "Properties", icon: Home, path: "/properties", badge: null },
  { title: "Property Types", icon: Home, path: "/property-types", badge: null },
  { title: "Property Agents", icon: UserCheck, path: "/property-agents", badge: null },
]

const managementNavItems = [
  { title: "Staff", icon: Users2, path: "/staff", badge: null },
  { title: "Roles & Permissions", icon: Shield, path: "/roles", badge: null },
  { title: "Inquiries", icon: MessageSquare, path: "/contacts", badge: null },
  { title: "Agent Messages", icon: MessageSquare, path: "/agent-messages", badge: null },
  /* { title: "Settings", icon: Settings, path: "/settings", badge: null },
  { title: "Help & Support", icon: HelpCircle, path: "/support", badge: null }, */
]

export function AppSidebar() {
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  
  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await api.get('/agent-messages')
        if (response.data.success) {
          const count = response.data.data.filter((m: any) => m.is_read === 0).length
          setUnreadCount(count)
        }
      } catch (error) {
        console.error("Error fetching unread messages count:", error)
      }
    }
    
    fetchUnread()
    const intervalId = setInterval(fetchUnread, 5000) // Poll every 5s
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
            RE
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold text-base leading-tight">ADADA RE</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === "Live" ? "default" : "secondary"}
                          className="h-5 px-1.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Property Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            PROPERTY MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {propertyNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                    <Link to={item.path} className="flex items-center gap-3 w-full pr-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-sm truncate">{item.title}</span>
                      {item.title === "Agent Messages" && unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        {/* <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@adada.re</p>
          </div>
        </div> */}
      </SidebarFooter>
    </Sidebar>
  )
}
