import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  Maximize,
  Minimize,
  Menu,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Users,
  Star
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { getInitials } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    description: "Order #ORD-12345 for $299.99",
    time: "2 minutes ago",
    read: false,
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    link: "/orders/ORD-12345"
  },
  {
    id: 2,
    type: "product",
    title: "Low Stock Alert",
    description: "Running Shoes (SKU: RS-2024) is running low",
    time: "15 minutes ago",
    read: false,
    icon: Package,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    link: "/inventory"
  },
  {
    id: 3,
    type: "customer",
    title: "New Customer Registered",
    description: "Alice Brown joined as a new customer",
    time: "1 hour ago",
    read: true,
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-100",
    link: "/customers"
  },
  {
    id: 4,
    type: "review",
    title: "New Product Review",
    description: "John Doe left a 5-star review on Wireless Headphones",
    time: "3 hours ago",
    read: true,
    icon: Star,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    link: "/products"
  },
  {
    id: 5,
    type: "system",
    title: "System Update",
    description: "Scheduled maintenance in 2 hours",
    time: "5 hours ago",
    read: true,
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-100",
    link: "/settings"
  }
]

export function Header() {
  const { toggleSidebar, state } = useSidebar()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  )
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get from localStorage first for immediate display
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Fetch fresh profile data
        const response = await api.get('/profile')
        if (response.data.success) {
          setUser(response.data.data)
          localStorage.setItem('auth_user', JSON.stringify(response.data.data))
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      }
    }
    fetchUser()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const toggleTheme = () => {
    const nextMode = !isDarkMode
    setIsDarkMode(nextMode)
    if (nextMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem("theme", "light")
    }
  }

  const handleNotificationClick = (notification: any) => {
    setNotificationsOpen(false)
    navigate(notification.link)
  }

  const markAllAsRead = () => {
    // In a real app, you'd update the notifications state
    console.log("Mark all as read")
  }

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab)

  
  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    
    // Show logout confirmation
    toast({
      title: "Logging out",
      description: "You have been successfully logged out",
    })
    // Navigate to login page
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:flex"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        {/* <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full bg-background/60 backdrop-blur-sm pl-8 md:w-[300px] lg:w-[400px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Handle search navigation
                console.log("Search:", e.currentTarget.value)
              }
            }}
          />
        </div> */}
      </div>

      <div className="flex items-center gap-2">
        {/* <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md backdrop-blur-xl bg-background/95">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </SheetTitle>
              <SheetDescription>
                Stay updated with the latest activities
              </SheetDescription>
            </SheetHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="order">Orders</TabsTrigger>
                <TabsTrigger value="product">Products</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 backdrop-blur-sm",
                            !notification.read ? "bg-muted/30" : ""
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", notification.bgColor)}>
                            <notification.icon className={cn("h-4 w-4", notification.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-sm">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/notifications">View all notifications</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet> */}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-primary/10">
                {user?.user_pic ? (
                  <img 
                    src={user.user_pic} 
                    className="h-full w-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.details?.full_name 
                      ? getInitials(user.details.full_name) 
                      : user?.email ? getInitials(user.email) : "AD"
                    }
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 mt-2 p-1 backdrop-blur-xl bg-background/95 border shadow-lg" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.details?.full_name || "Admin User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@adada.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-muted/50 focus:bg-muted/50">
              <Link to="/profile" className="flex items-center px-3 py-2 w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-muted/50 focus:bg-muted/50 text-red-600 focus:text-red-600">
              <button onClick={handleLogout} className="flex items-center px-3 py-2 w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
