import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Team Members",
    value: "24",
    icon: Users,
    change: "+2",
    changeType: "increase",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Tasks Completed",
    value: "156",
    icon: CheckCircle,
    change: "+18",
    changeType: "increase",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Hours Logged",
    value: "1,248",
    icon: Clock,
    change: "-3%",
    changeType: "decrease",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Pending Reviews",
    value: "12",
    icon: AlertCircle,
    change: "-4",
    changeType: "decrease",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">      
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">     
              <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <TrendingUp className={`h-3 w-3 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600 rotate-180'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">       
                  {stat.title === "Total Team Members" ? "Active" : 
                   stat.title === "Tasks Completed" ? "This month" :
                   stat.title === "Hours Logged" ? "This week" : "Needs attention"}
                </p>
              </div>
              <div className="mt-3 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    stat.title === "Total Team Members" ? "w-3/4 bg-blue-500" :
                    stat.title === "Tasks Completed" ? "w-2/3 bg-green-500" :
                    stat.title === "Hours Logged" ? "w-1/2 bg-purple-500" : "w-1/3 bg-orange-500"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}