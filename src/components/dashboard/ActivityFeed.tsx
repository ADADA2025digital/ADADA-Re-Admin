import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getInitials, formatRelativeTime } from "@/lib/utils"
import { ShoppingCart, Package, AlertCircle, UserPlus, RefreshCw } from "lucide-react"

interface Activity {
  id: number
  user: string
  action: string
  time: string
  type: string
  amount?: number
  product?: string
  stock?: number
}

interface ActivityFeedProps {
  activities: Activity[]
}

const activityIcons = {
  order: ShoppingCart,
  product: Package,
  alert: AlertCircle,
  customer: UserPlus,
  refund: RefreshCw
}

const activityColors = {
  order: "bg-blue-500",
  product: "bg-purple-500",
  alert: "bg-red-500",
  customer: "bg-green-500",
  refund: "bg-orange-500"
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type as keyof typeof activityIcons] || ActivityFeed
          const color = activityColors[activity.type as keyof typeof activityColors] || "bg-gray-500"

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`relative p-2 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {activity.user}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                  {activity.amount && ` for ${formatCurrency(activity.amount)}`}
                  {activity.product && ` - ${activity.product}`}
                  {activity.stock && ` (${activity.stock} left)`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}