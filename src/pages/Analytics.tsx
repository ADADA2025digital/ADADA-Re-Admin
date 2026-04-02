import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Zap,
  Award,
  Clock,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  HelpCircle,
  MoreHorizontal,
  DownloadCloud,
  FileText,
  Mail,
  Printer,
  Share2,
  EyeOff
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  Line,
  ComposedChart
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

// Mock analytics data
const analyticsData = {
  overview: {
    pageViews: 0,
    pageViewsTrend: 0,
    uniqueVisitors: 0,
    uniqueVisitorsTrend: 0,
    bounceRate: 0,
    bounceRateTrend: 0,
    avgSessionDuration: 0,
    sessionDurationTrend: 0,
    conversionRate: 0,
    conversionTrend: 0,
    totalOrders: 0,
    ordersTrend: 0,
    revenue: 0,
    revenueTrend: 0,
    avgOrderValue: 0,
    aovTrend: 0
  },
  dailyStats: [] as any[],
  trafficSources: [] as any[],
  topPages: [] as any[],
  devices: [] as any[],
  hourlyData: [] as any[]
}

export function Analytics() {
  const [dateRange, setDateRange] = useState("30days")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleRefresh = () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing data",
      description: "Fetching latest analytics...",
    })
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data updated",
        description: "Latest analytics loaded successfully",
        variant: "success",
      })
    }, 1500)
  }

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report is being generated...",
    })
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Analytics exported as ${format.toUpperCase()}`,
        variant: "success",
      })
    }, 2000)
  }

  const handlePrint = () => {
    window.print()
    toast({
      title: "Printing",
      description: "Analytics report is being prepared for printing",
    })
  }

  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  const handleEmail = () => {
    setIsEmailDialogOpen(true)
  }

  const handleSendEmail = (email: string) => {
    setIsEmailDialogOpen(false)
    toast({
      title: "Email sent",
      description: `Analytics report has been sent to ${email}`,
      variant: "success",
    })
  }

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsShareDialogOpen(false)
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
      variant: "success",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const dateRangeOptions = {
    today: "Today",
    "7days": "Last 7 days",
    "30days": "Last 30 days",
    "90days": "Last 90 days",
    year: "This year",
    custom: "Custom range"
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              View your store analytics and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Date Range Selector with Blur */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Dropdown with Blur */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm border-primary/20">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-background/95 backdrop-blur-xl">Export data</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-primary/20">
                <DropdownMenuLabel className="text-primary">Export as</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-blue-500" />
                  PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                  <DownloadCloud className="mr-2 h-4 w-4 text-green-500" />
                  Excel Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                  <DownloadCloud className="mr-2 h-4 w-4 text-yellow-500" />
                  CSV File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-background/80 backdrop-blur-sm border-primary/20"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-background/95 backdrop-blur-xl">Refresh data</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Key Metrics Cards with Blur */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Page Views
                </CardTitle>
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.pageViewsTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.pageViewsTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.pageViewsTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.uniqueVisitors.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.uniqueVisitorsTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.uniqueVisitorsTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.uniqueVisitorsTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bounce Rate
                </CardTitle>
                <Target className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.bounceRateTrend < 0 ? (
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.bounceRateTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.bounceRateTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Session
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(analyticsData.overview.avgSessionDuration)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.sessionDurationTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.sessionDurationTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.sessionDurationTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Metrics with Blur */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.conversionTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.conversionTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.conversionTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalOrders.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.ordersTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.ordersTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.ordersTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.revenue)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.revenueTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.revenueTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.revenueTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Order Value
                </CardTitle>
                <Award className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.avgOrderValue)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.overview.aovTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${analyticsData.overview.aovTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analyticsData.overview.aovTrend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts with Blur */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic Overview Chart */}
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Traffic Overview</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[120px] bg-background/80 backdrop-blur-sm">
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl">
                    <SelectItem value="visitors">Visitors</SelectItem>
                    <SelectItem value="pageViews">Page Views</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Daily traffic and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.dailyStats}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis className="text-xs" />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background/95 backdrop-blur-xl p-2 shadow-sm">
                              <p className="text-sm font-medium">{new Date(label).toLocaleDateString()}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-xs" style={{ color: entry.color }}>
                                  {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value as number) : entry.value}
                                </p>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric === 'visitors' ? 'visitors' : selectedMetric === 'pageViews' ? 'pageViews' : selectedMetric === 'conversions' ? 'conversions' : 'revenue'}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#visitorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={analyticsData.trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {analyticsData.trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                      <span>{source.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">{source.visitors.toLocaleString()} visitors</span>
                      <span className="font-medium">{source.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Activity with Blur */}
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
            <CardDescription>Visitor activity throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyticsData.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background/95 backdrop-blur-xl p-2 shadow-sm">
                            <p className="text-sm font-medium">{label}:00</p>
                            <p className="text-xs">Visitors: {payload[0].value}</p>
                            <p className="text-xs">Conversions: {payload[1].value}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar yAxisId="left" dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Devices & Top Pages with Blur */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Devices */}
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Devices</CardTitle>
              <CardDescription>Visitor device distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.devices.map((device) => (
                  <div key={device.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: device.color }} />
                        <span>{device.name}</span>
                      </div>
                      <span className="font-medium">{device.value}%</span>
                    </div>
                    <Progress value={device.value} className="h-2 bg-primary/20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{index + 1}.</span>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{page.views.toLocaleString()} views</span>
                        <span>{page.uniqueVisitors.toLocaleString()} unique</span>
                        <span>{formatTime(page.avgTime)} avg</span>
                      </div>
                    </div>
                    <Badge variant={page.bounceRate < 40 ? "default" : "destructive"} className="ml-2">
                      {page.bounceRate}% bounce
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions with Blur and Functionality */}
        <div className="flex items-center justify-end gap-2 p-4 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="border-primary/20 hover:bg-primary/20"
              >
                {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background/95 backdrop-blur-xl">
              {showDetails ? 'Hide detailed metrics' : 'Show detailed metrics'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="border-primary/20 hover:bg-primary/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background/95 backdrop-blur-xl">Share report</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="border-primary/20 hover:bg-primary/20"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background/95 backdrop-blur-xl">Print report</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEmail}
                className="border-primary/20 hover:bg-primary/20"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background/95 backdrop-blur-xl">Email report</TooltipContent>
          </Tooltip>
        </div>

        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary">Share Analytics Report</DialogTitle>
              <DialogDescription>
                Share this report with your team or colleagues
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                  <Input 
                    id="share-link" 
                    value={window.location.href} 
                    readOnly 
                    className="bg-background/80 backdrop-blur-sm"
                  />
                  <Button onClick={handleShareLink} className="bg-primary hover:bg-primary/90">
                    Copy
                  </Button>
                </div>
              </div>
              <Separator className="bg-primary/20" />
              <div className="space-y-2">
                <Label>Share via</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/20">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/20">
                    <Share2 className="h-4 w-4 mr-2" />
                    Slack
                  </Button>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/20">
                    <Users className="h-4 w-4 mr-2" />
                    Teams
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)} className="border-primary/20 hover:bg-primary/20">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary">Email Analytics Report</DialogTitle>
              <DialogDescription>
                Send the analytics report to an email address
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="colleague@example.com" 
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  defaultValue="Analytics Report - EcoMart" 
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <textarea 
                  id="message" 
                  rows={3}
                  className="w-full rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm px-3 py-2 text-sm"
                  placeholder="Add a personal message..."
                />
              </div>
              <div className="space-y-2">
                <Label>Include</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-charts" defaultChecked className="rounded border-primary/20" />
                    <Label htmlFor="include-charts" className="text-sm">Charts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-data" defaultChecked className="rounded border-primary/20" />
                    <Label htmlFor="include-data" className="text-sm">Raw Data</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)} className="border-primary/20 hover:bg-primary/20">
                Cancel
              </Button>
              <Button onClick={() => handleSendEmail("colleague@example.com")} className="bg-primary hover:bg-primary/90">
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
