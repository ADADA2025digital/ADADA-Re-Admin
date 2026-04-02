import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

const stats = [
  {
    title: "Total Team Members",
    value: "24",
    icon: Users,
    description: "Active members",
    link: "/team"
  },
  {
    title: "Tasks Completed",
    value: "156",
    icon: CheckCircle,
    description: "This month",
    link: "/tasks"
  },
  {
    title: "Hours Logged",
    value: "1,248",
    icon: Clock,
    description: "This week",
    link: "/time"
  },
  {
    title: "Pending Reviews",
    value: "12",
    icon: AlertCircle,
    description: "Needs attention",
    link: "/reviews"
  },
]

export function DashboardStatsClickable() {
  const navigate = useNavigate()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">      
      {stats.map((stat) => (
        <Card 
          key={stat.title}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(stat.link)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" /> 
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>  
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
