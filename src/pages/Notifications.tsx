import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Bell,
  ShoppingCart,
  Package,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Archive,
  Flag,
  RefreshCw
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock notifications data
const allNotifications: any[] = []

export function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter(n => !n.read).length
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read",
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast({
      title: "All notifications read",
      description: "All notifications have been marked as read",
      variant: "success",
    })
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
    toast({
      title: "Notification deleted",
      description: "Notification has been removed",
    })
  }

  const archiveNotification = (id: number) => {
    toast({
      title: "Notification archived",
      description: "Notification has been archived",
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Notifications refreshed",
        description: "Latest notifications loaded",
        variant: "success",
      })
    }, 1000)
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" ? true :
                      activeTab === "unread" ? !notification.read :
                      activeTab === "high" ? notification.priority === "high" :
                      notification.type === activeTab
    return matchesSearch && matchesTab
  })

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return <Badge className="bg-red-500">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest activities and alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="w-[250px] pl-8 bg-background/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Refresh Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh notifications</TooltipContent>
            </Tooltip>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Filter options</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("all")}>
                  <Bell className="mr-2 h-4 w-4" />
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("unread")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("high")}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  High Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mark all as read button */}
            {unreadCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={markAllAsRead} className="bg-background/80 backdrop-blur-sm">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark all as read
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark all notifications as read</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Flag className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-background/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="relative">
              All
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-primary">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-blue-500">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="product">Products</TabsTrigger>
            <TabsTrigger value="customer">Customers</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md",
                            !notification.read ? "bg-primary/5 border-primary/20" : "bg-background/50 border-primary/10"
                          )}
                        >
                          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", notification.bgColor)}>
                            <notification.icon className={cn("h-5 w-5", notification.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  {getPriorityBadge(notification.priority)}
                                  {!notification.read && (
                                    <Badge className="bg-blue-500">New</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {notification.time}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Bell className="h-3 w-3 mr-1" />
                                    {notification.type}
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl">
                                  <DropdownMenuItem asChild>
                                    <Link to={notification.link} className="cursor-pointer">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  {!notification.read && (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Read
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? "No results match your search" : "You're all caught up!"}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive all
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive all read notifications</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export notifications log</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notification settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
