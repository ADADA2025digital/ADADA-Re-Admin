import { 
  LayoutDashboard, 
  Shield, 
  Users2, 
  Home, 
  UserCheck, 
  MessageSquare,
  Settings,
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  FileText,
  Thermometer,
  Mail
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
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import logo from "@/assets/logo.png"

// Weather data interface
interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
  feelsLike: number
}

// Main navigation items
const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/", badge: null },
]

const propertyNavItems = [
  { title: "Properties", icon: Home, path: "/properties", badge: null },
  { title: "Property Agents", icon: UserCheck, path: "/property-agents", badge: null },
]

const managementNavItems = [
  { title: "Staff", icon: Users2, path: "/staff", badge: null },
  { title: "Roles & Permissions", icon: Shield, path: "/roles", badge: null },
  { title: "Inquiries", icon: Mail, path: "/contacts", badge: null },
  { title: "Agent Messages", icon: MessageSquare, path: "/agent-messages", badge: null },
]
const contentNavItems = [
  { title: "Articles", icon: FileText, path: "/articles", badge: null },
]
const systemNavItems = [
  { title: "Configuration", icon: Settings, path: "/configuration", badge: null },
]

// Helper function to get weather icon based on condition
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase()
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return Sun
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return CloudRain
  if (lowerCondition.includes('snow') || lowerCondition.includes('sleet')) return CloudSnow
  if (lowerCondition.includes('thunder') || lowerCondition.includes('lightning')) return CloudLightning
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return Cloud
  if (lowerCondition.includes('wind') || lowerCondition.includes('breeze')) return Wind
  return Cloud
}

export function AppSidebar() {
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  
  const isActive = (path: string) => location.pathname === path

  // Fetch unread messages count
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
    const intervalId = setInterval(fetchUnread, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Get location and weather
  useEffect(() => {
    const getLocationAndWeather = () => {
      if (!navigator.geolocation) {
        setLocationError("Location not supported")
        setWeatherLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Get location name using reverse geocoding
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const geoData = await geoResponse.json()
            const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "Unknown"
            
            // Get weather from wttr.in (free, no API key)
            const weatherResponse = await fetch(
              `https://wttr.in/${latitude},${longitude}?format=j1`
            )
            const weatherData = await weatherResponse.json()
            
            if (weatherData.current_condition && weatherData.current_condition[0]) {
              const current = weatherData.current_condition[0]
              setWeather({
                temp: Math.round(parseInt(current.temp_C)),
                condition: current.weatherDesc[0].value,
                humidity: parseInt(current.humidity),
                windSpeed: Math.round(parseInt(current.windspeedKmph)),
                location: cityName,
                feelsLike: Math.round(parseInt(current.FeelsLikeC || current.temp_C))
              })
            } else {
              setLocationError("Weather data unavailable")
            }
          } catch (error) {
            console.error("Error fetching location/weather:", error)
            setLocationError("Unable to fetch weather")
          } finally {
            setWeatherLoading(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          if (error.code === 1) {
            setLocationError("Location permission denied")
          } else if (error.code === 2) {
            setLocationError("Position unavailable")
          } else {
            setLocationError("Location error")
          }
          setWeatherLoading(false)
        }
      )
    }

    getLocationAndWeather()
  }, [])

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Cloud

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 flex items-center justify-center overflow-hidden bg-slate-900 rounded-xl p-2 shadow-md border border-white/10 shrink-0">
            <img src={logo} alt="ADADA RE" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-bold text-lg leading-tight tracking-tight">ADADA RE</h2>
            <p className="text-[10px] uppercase font-bold text-primary tracking-widest opacity-80 mt-0.5">Admin Vault</p>
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

        <SidebarSeparator  />

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
<SidebarSeparator  />

<SidebarGroup>
  <SidebarGroupLabel className=" text-xs font-medium text-muted-foreground">
    BLOGS
  </SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu>
      {contentNavItems.map((item) => (
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
        <SidebarSeparator/>

        {/* System Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            SYSTEM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
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
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-border">
        <div className="space-y-3">
         <div className="border-t border-border/50 pt-3 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              &copy; {new Date().getFullYear()} ADADA RE. All rights reserved.
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}