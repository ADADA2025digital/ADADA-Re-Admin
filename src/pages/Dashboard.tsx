import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
  RefreshCw,
  Home,
  Users,
  Shield,
  UserCheck,
  TrendingUp,
  Building,
  ArrowUpRight,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts"

const initialStats = {
  properties: { total: 0, available: 0, sold: 0, leased: 0, types: [] },
  revenue: { total: 0, trend: [] },
  staff: { total: 0, roles: 0 },
  agents: { total: 0 },
  recent: []
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export function Dashboard() {
  const [stats, setStats] = useState(initialStats)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchStats = async () => {
    try {
      setIsRefreshing(true)
      const res = await api.get('/dashboard/stats')
      if (res.data.success) {
        setStats(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err)
      toast({ title: "Error", description: "Could not load latest statistics", variant: "destructive" })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRefresh = () => {
    fetchStats()
    toast({ title: "Updated", description: "Dashboard stats refreshed." })
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Superior Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight font-outfit">ADADA RE <span className="text-primary/70">Vault</span></h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live system overview and performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Revenue Tracking</span>
                <span className="text-xl font-bold text-primary">${stats.revenue.total.toLocaleString()}</span>
             </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Master Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Listings" 
            value={stats.properties.total} 
            subtitle="Real estate inventory" 
            icon={Home} 
            color="primary"
            trend="+4% this month"
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${(stats.revenue.total / 1000).toFixed(1)}k`} 
            subtitle="Gross completed sales" 
            icon={TrendingUp} 
            color="green"
            trend="Global trend"
          />
          <StatCard 
            title="Total Staff" 
            value={stats.staff.total} 
            subtitle="Across all departments" 
            icon={Users} 
            color="blue"
            trend={`${stats.staff.roles} Permissions`}
          />
           <StatCard 
            title="Assignments" 
            value={stats.agents.total} 
            subtitle="Properties with agents" 
            icon={UserCheck} 
            color="orange"
            trend="Live coverage"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Section for Revenue Growth (Pro Chart) */}
           <Card className="lg:col-span-2 bg-background/50 backdrop-blur-md border-primary/10 shadow-xl rounded-2xl overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-8">
               <div>
                  <CardTitle className="text-2xl font-bold">Revenue Performance</CardTitle>
                  <CardDescription>Comparison of closed deals value over time.</CardDescription>
               </div>
               <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Monthly</Badge>
             </CardHeader>
             <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.revenue.trend}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Closed Deals']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
           </Card>

           {/* Distribution Pie Chart */}
           <Card className="bg-background/50 backdrop-blur-md border-primary/10 shadow-xl rounded-2xl">
             <CardHeader>
                <CardTitle className="text-xl font-bold">Asset Mix</CardTitle>
                <CardDescription>Distribution across property types.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={stats.properties.types}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                         >
                            {stats.properties.types.map((_, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <RechartsTooltip />
                         <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-4">
                   <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 rounded-full bg-blue-500" />
                         <span className="text-sm font-medium">Available</span>
                      </div>
                      <span className="font-bold">{stats.properties.available}</span>
                   </div>
                   <div className="flex justify-between items-center bg-green-500/5 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 rounded-full bg-green-500" />
                         <span className="text-sm font-medium">Sold / Leased</span>
                      </div>
                      <span className="font-bold">{stats.properties.sold + stats.properties.leased}</span>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Third Row: Recent Listings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Recent Listings (Scrollable List) */}
           <Card className="bg-background/50 backdrop-blur-md border-primary/10 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                       <Clock className="h-5 w-5 text-primary" />
                       Recent Activity
                    </CardTitle>
                    <CardDescription>Latest property additions to the vault.</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="text-primary hover:text-primary/80">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 {stats.recent.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground italic">No recent activity detected.</div>
                 ) : (
                    stats.recent.map((item: any) => {
                       const mainImg = item.assets?.find((a: any) => a.asset_type === 'img')?.asset_value || null;
                       return (
                          <div key={item.pr_id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all cursor-pointer">
                             <div className="h-16 w-16 rounded-lg overflow-hidden border border-primary/10 shadow-sm shrink-0">
                                {mainImg ? (
                                   <img src={mainImg} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                ) : (
                                   <div className="h-full w-full bg-muted flex items-center justify-center">
                                      <Building className="h-6 w-6 opacity-20" />
                                   </div>
                                )}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.property_title}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                   <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.city}</span>
                                   <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {item.propert_status}</span>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-primary">${(item.price_guide / 1000).toFixed(1)}k</p>
                                <p className="text-[10px] text-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "New Listing"}</p>
                             </div>
                             <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                          </div>
                       )
                    })
                 )}
              </CardContent>
           </Card>

           {/* High-End Quick Access Cards */}
           <div className="grid grid-cols-2 gap-4">
              <QuickCard 
                 title="Properties" 
                 desc="Portfolio Management" 
                 icon={Home} 
                 onClick={() => navigate('/properties')} 
                 color="blue"
              />
              <QuickCard 
                 title="Staffing" 
                 desc="User Directory" 
                 icon={Users} 
                 onClick={() => navigate('/staff')}
                 color="indigo"
              />
              <QuickCard 
                 title="Assignments" 
                 desc="Agent Network" 
                 icon={UserCheck} 
                 onClick={() => navigate('/property-agents')}
                 color="purple"
              />
              <QuickCard 
                 title="Security" 
                 desc="Role Permissions" 
                 icon={Shield} 
                 onClick={() => navigate('/roles')}
                 color="emerald"
              />
           </div>

        </div>

      </div>
    </TooltipProvider>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: any) {
   const colorClasses: any = {
      primary: "bg-primary/10 text-primary border-primary/20",
      green: "bg-green-500/10 text-green-600 border-green-500/20",
      blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      orange: "bg-orange-500/10 text-orange-600 border-orange-500/20"
   }

   return (
      <Card className="relative overflow-hidden group bg-background/50 backdrop-blur-md border-primary/10 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5 rounded-2xl">
         <CardContent className="p-6">
            <div className="flex items-start justify-between">
               <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
                  <h3 className="text-3xl font-black">{value}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                     <Clock className="h-3 w-3" /> {subtitle}
                  </p>
               </div>
               <div className={`p-3 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
               </div>
            </div>
            {trend && (
               <div className="mt-4 pt-4 border-t border-primary/5">
                  <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
               </div>
            )}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
         </CardContent>
      </Card>
   )
}

function QuickCard({ title, desc, icon: Icon, onClick, color }: any) {
   const variants: any = {
      blue: "hover:bg-blue-500/5 hover:border-blue-500/30",
      indigo: "hover:bg-indigo-500/5 hover:border-indigo-500/30",
      purple: "hover:bg-purple-500/5 hover:border-purple-500/30",
      emerald: "hover:bg-emerald-500/5 hover:border-emerald-500/30"
   }

   return (
      <button 
         onClick={onClick}
         className={`h-full flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-primary/5 bg-background/50 backdrop-blur-sm transition-all shadow-sm ${variants[color] || ""} group`}
      >
         <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
            <Icon className="h-6 w-6 text-primary" />
         </div>
         <h4 className="font-bold text-sm">{title}</h4>
         <p className="text-[10px] text-muted-foreground mt-1">{desc}</p>
      </button>
   )
}
