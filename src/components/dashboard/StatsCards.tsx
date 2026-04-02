import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
  description?: string
}

function StatsCard({ title, value, change, icon: Icon, description }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn(
            "flex items-center text-xs",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  stats: {
    properties: {
      total: number
      available: number
      sold: number
      leased: number
    }
    revenue: {
      total: number
      trend: number
    }
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Properties"
        value={stats.properties.total}
        change={5.2} // placeholder trend
        icon={Package}
        description="All properties in system"
      />
      <StatsCard
        title="Available Properties"
        value={stats.properties.available}
        change={2.1} 
        icon={Users}
        description="Ready for sale/lease"
      />
      <StatsCard
        title="Sold Properties"
        value={stats.properties.sold}
        change={8.4}
        icon={ShoppingCart}
        description="Successfully sold"
      />
      <StatsCard
        title="Leased Properties"
        value={stats.properties.leased}
        change={3.2}
        icon={DollarSign}
        description="Currently leased out"
      />
    </div>
  )
}