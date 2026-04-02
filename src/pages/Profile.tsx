import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Save,
  Camera,
  Globe,
  CheckCircle,
  LogOut,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon
} from "lucide-react"
import { getInitials } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export function Profile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch(e) {}
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [profileData, setProfileData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    role: "",
    joinDate: new Date().toISOString()
  })
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  })

  const [socialLinks, setSocialLinks] = useState({
    x_link: "",
    inst_link: "",
    linkedin_link: "",
    fb_link: ""
  })

  // Password state
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/profile')

        if (response.data.success && response.data.data) {
          const user = response.data.data;
          const userDetails = {
            name: user.details?.full_name || user.email,
            email: user.email,
            phone: user.details?.phone_number || "",
            location: user.addresses?.[0]?.full_address || "No Address Saved",
            bio: user.details?.bio || "",
            role: user.roles?.[0]?.role_name || "Agent",
            image: user.user_pic,
            joinDate: user.created_at || new Date().toISOString()
          }
          setProfileData(userDetails)
          setFormData({
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            location: userDetails.location,
            bio: userDetails.bio
          })

          if (user.social_links) {
            setSocialLinks({
              x_link: user.social_links.x_link || "",
              inst_link: user.social_links.inst_link || "",
              linkedin_link: user.social_links.linkedin_link || "",
              fb_link: user.social_links.fb_link || ""
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error)
        toast({ title: "Error loading profile", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  const handleSaveProfile = async () => {
    try {
      // Send Profile Data Update
      await api.put('/profile', { ...formData })
      
      // Send Social Links Update
      await api.post('/profile/social-links', socialLinks)

      setProfileData({ ...profileData, ...formData })
      setIsEditing(false)
      toast({ title: "Profile updated successfully" })
    } catch (error) {
      console.error("Failed to update profile", error)
      toast({ title: "Failed to update profile", variant: "destructive" })
    }
  }

  const handleUpdatePassword = async () => {
    if (passwords.new_password !== passwords.new_password_confirmation) {
      toast({ title: "Passwords do not match", variant: "destructive" })
      return
    }
    try {
      await api.put('/profile/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.new_password_confirmation
      })
      toast({ title: "Password updated successfully" })
      setPasswords({ current_password: "", new_password: "", new_password_confirmation: "" })
    } catch (error: any) {
      toast({ 
        title: "Failed to update password", 
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive" 
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('user_pic', file)

    try {
      const response = await api.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        setProfileData({ ...profileData, image: response.data.data.user_pic })
        toast({ title: "Profile picture updated" })
        // Optional: reload window or refetch to see changes
      }
    } catch (error) {
      console.error("Upload failed", error)
      toast({ title: "Upload failed", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Loading Profile...
      </div>
    )
  }

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between font-outfit">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Overview</h1>
          <p className="text-muted-foreground">
            Manage your personal dashboard information and settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 shadow-md">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)} 
              className="bg-background hover:bg-primary/5 border-primary/20 text-primary transition-all"
            >
              Edit Profile
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <Card className="border-primary/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-xl overflow-hidden">
                    {profileData.image ? (
                      <img src={profileData.image} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                        {getInitials(profileData.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    id="profile-pic-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-background shadow-md border-primary/20 hover:bg-primary/10"
                    onClick={() => document.getElementById('profile-pic-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 text-primary" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold capitalize">{profileData.name}</h2>
                <p className="text-primary font-medium">{profileData.role}</p>
                
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 shadow-none"><CheckCircle className="w-3 h-3 mr-1"/> Active</Badge>
                </div>

                <Separator className="my-5 bg-primary/10" />

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Mail className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="truncate flex-1">{profileData.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Phone className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="truncate flex-1">{profileData.phone || "Not provided"}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <MapPin className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="truncate flex-1">{profileData.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Calendar className="h-4 w-4 text-primary/70" />
                    </div>
                    <span className="truncate flex-1">Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="bg-muted/50 p-1 border border-primary/5 shadow-inner">
              <TabsTrigger value="profile" className="px-6 rounded-sm">Profile Details</TabsTrigger>
              <TabsTrigger value="security" className="px-6 rounded-sm">Password & Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="pt-2">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details, public profile, and social connections.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-muted-foreground font-semibold">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/30 border-dashed" : "border-primary/40 focus-visible:ring-primary/20"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground font-semibold">Email Address (Primary)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled={true}
                        className="bg-muted/30 border-dashed cursor-not-allowed opacity-80"
                      />
                      <p className="text-[10px] text-muted-foreground italic">Email cannot be changed after registration.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-muted-foreground font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/30 border-dashed" : "border-primary/40 focus-visible:ring-primary/20"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-muted-foreground font-semibold">Location / Address</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/30 border-dashed" : "border-primary/40 focus-visible:ring-primary/20"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-muted-foreground font-semibold">Biography</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-dashed resize-none" : "border-primary/40 focus-visible:ring-primary/20"}
                      placeholder="Tell us a little about your role and experience..."
                    />
                  </div>

                  <Separator className="bg-primary/10" />

                  <div className="space-y-4">
                    <Label className="text-muted-foreground font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Social Links Integration
                    </Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-2"><Twitter className="w-3 h-3 text-blue-400" /> X (Twitter)</Label>
                        <Input 
                          placeholder="https://x.com/username"
                          value={socialLinks.x_link} 
                          onChange={(e) => setSocialLinks({...socialLinks, x_link: e.target.value})}
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-muted/30 border-dashed" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-2"><Linkedin className="w-3 h-3 text-blue-700" /> LinkedIn</Label>
                        <Input 
                          placeholder="https://linkedin.com/in/username"
                          value={socialLinks.linkedin_link} 
                          onChange={(e) => setSocialLinks({...socialLinks, linkedin_link: e.target.value})}
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-muted/30 border-dashed" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-2"><Facebook className="w-3 h-3 text-blue-600" /> Facebook</Label>
                        <Input 
                          placeholder="https://facebook.com/username"
                          value={socialLinks.fb_link} 
                          onChange={(e) => setSocialLinks({...socialLinks, fb_link: e.target.value})}
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-muted/30 border-dashed" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-2"><LinkIcon className="w-3 h-3 text-pink-600" /> Instagram</Label>
                        <Input 
                          placeholder="https://instagram.com/username"
                          value={socialLinks.inst_link} 
                          onChange={(e) => setSocialLinks({...socialLinks, inst_link: e.target.value})}
                          disabled={!isEditing} 
                          className={!isEditing ? "bg-muted/30 border-dashed" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="pt-2">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><Shield className="w-5 h-5 text-primary"/> Security Settings</CardTitle>
                  <CardDescription>
                    Update your account password to secure your login dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.current_password}
                        onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={passwords.new_password_confirmation}
                      onChange={(e) => setPasswords({...passwords, new_password_confirmation: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-primary/5 py-4">
                  <Button className="bg-primary" onClick={handleUpdatePassword}>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
