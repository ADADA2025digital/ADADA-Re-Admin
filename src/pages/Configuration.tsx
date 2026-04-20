// src/pages/Configuration.tsx
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Facebook,
  Instagram,
  Globe,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Link2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Configuration() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showFacebookToken, setShowFacebookToken] = useState(false)
  const [showInstagramToken, setShowInstagramToken] = useState(false)
  
  const [configData, setConfigData] = useState({
    id: null as number | null,
    facebook_page_id: "",
    facebook_access_token: "",
    insta_page_id: "",
    insta_access_token: "",
    web_url: ""
  })

  const [originalData, setOriginalData] = useState({ ...configData })

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/configurations/first')
      
      if (response.data.success && response.data.data) {
        const data = response.data.data
        setConfigData({
          id: data.id,
          facebook_page_id: data.facebook_page_id || "",
          facebook_access_token: data.facebook_access_token || "",
          insta_page_id: data.insta_page_id || "",
          insta_access_token: data.insta_access_token || "",
          web_url: data.web_url || ""
        })
        setOriginalData({
          id: data.id,
          facebook_page_id: data.facebook_page_id || "",
          facebook_access_token: data.facebook_access_token || "",
          insta_page_id: data.insta_page_id || "",
          insta_access_token: data.insta_access_token || "",
          web_url: data.web_url || ""
        })
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log("No configuration found, will create new one on save")
      } else {
        console.error("Error fetching configuration:", error)
        toast({
          title: "Error",
          description: "Failed to load configuration",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const payload = {
        facebook_page_id: configData.facebook_page_id || null,
        facebook_access_token: configData.facebook_access_token || null,
        insta_page_id: configData.insta_page_id || null,
        insta_access_token: configData.insta_access_token || null,
        web_url: configData.web_url || null
      }

      let response
      if (configData.id) {
        response = await api.put(`/configurations/${configData.id}`, payload)
      } else {
        response = await api.post('/configurations/upsert', payload)
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message || "Configuration saved successfully",
          variant: "default"
        })
        
        if (response.data.data && !configData.id) {
          setConfigData(prev => ({ ...prev, id: response.data.data.id }))
        }
        
        await fetchConfiguration()
      }
    } catch (error: any) {
      console.error("Error saving configuration:", error)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat().join(", ")
        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to save configuration",
          variant: "destructive"
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setConfigData({ ...originalData })
    toast({
      title: "Reset",
      description: "Changes have been reset",
      variant: "default"
    })
  }

  const hasChanges = () => {
    return JSON.stringify(configData) !== JSON.stringify(originalData)
  }

  // Helper function to check if platform is configured
  const isFacebookConfigured = () => {
    return !!(configData.facebook_page_id && configData.facebook_access_token)
  }

  const isInstagramConfigured = () => {
    return !!(configData.insta_page_id && configData.insta_access_token)
  }

  const isWebsiteConfigured = () => {
    return !!(configData.web_url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Manage social media integrations and website settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges() && (
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="social" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 border border-primary/5">
          <TabsTrigger value="social" className="gap-2">
            <Settings className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="website" className="gap-2">
            <Globe className="h-4 w-4" />
            Website Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook Integration
              </CardTitle>
              <CardDescription>
                Configure Facebook Page ID and Access Token for social media publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="facebook_page_id" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Facebook Page ID
                </Label>
                <Input
                  id="facebook_page_id"
                  placeholder="e.g., 123456789012345"
                  value={configData.facebook_page_id}
                  onChange={(e) => setConfigData({ ...configData, facebook_page_id: e.target.value })}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Find your Page ID in your Facebook Page settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook_token" className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Facebook Access Token
                </Label>
                <div className="relative">
                  <Input
                    id="facebook_token"
                    type={showFacebookToken ? "text" : "password"}
                    placeholder="EAABwzLix..."
                    value={configData.facebook_access_token}
                    onChange={(e) => setConfigData({ ...configData, facebook_access_token: e.target.value })}
                    className="font-mono pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowFacebookToken(!showFacebookToken)}
                  >
                    {showFacebookToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generate a Page Access Token from Facebook Developers Console.
                </p>
              </div>

              {/* Facebook Status Indicator */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20">
                {isFacebookConfigured() ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Facebook is configured and ready to use</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Facebook not configured - Please add Page ID and Access Token</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-600" />
                Instagram Integration
              </CardTitle>
              <CardDescription>
                Configure Instagram Business Page ID and Access Token.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="insta_page_id" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Instagram Page ID
                </Label>
                <Input
                  id="insta_page_id"
                  placeholder="e.g., 17841405822304914"
                  value={configData.insta_page_id}
                  onChange={(e) => setConfigData({ ...configData, insta_page_id: e.target.value })}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your Instagram Business Account ID linked to your Facebook Page.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insta_token" className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Instagram Access Token
                </Label>
                <div className="relative">
                  <Input
                    id="insta_token"
                    type={showInstagramToken ? "text" : "password"}
                    placeholder="IGQVJYeUx..."
                    value={configData.insta_access_token}
                    onChange={(e) => setConfigData({ ...configData, insta_access_token: e.target.value })}
                    className="font-mono pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowInstagramToken(!showInstagramToken)}
                  >
                    {showInstagramToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Instagram Graph API access token with pages_read_engagement and pages_manage_posts permissions.
                </p>
              </div>

              {/* Instagram Status Indicator */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20">
                {isInstagramConfigured() ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Instagram is configured and ready to use</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Instagram not configured - Please add Page ID and Access Token</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Note:</strong> Facebook and Instagram integrations are required for automatic social media publishing 
                of articles and properties. Make sure your access tokens have the necessary permissions.
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Website Configuration
              </CardTitle>
              <CardDescription>
                Configure website URLs and global settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="web_url">Website URL</Label>
                <Input
                  id="web_url"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={configData.web_url}
                  onChange={(e) => setConfigData({ ...configData, web_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your main website URL used for generating shareable links and SEO.
                </p>
              </div>

              {/* Website Status Indicator */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20">
                {isWebsiteConfigured() ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Website URL is configured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Website URL not configured - Please add your website URL</span>
                  </>
                )}
              </div>

              <Separator className="my-4" />

              <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Configuration Status Summary
                </div>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Facebook Integration:</span>
                    <span className={isFacebookConfigured() ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {isFacebookConfigured() ? "Configured ✓" : "Not Configured ✗"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Instagram Integration:</span>
                    <span className={isInstagramConfigured() ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {isInstagramConfigured() ? "Configured ✓" : "Not Configured ✗"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Website URL:</span>
                    <span className={isWebsiteConfigured() ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {isWebsiteConfigured() ? "Configured ✓" : "Not Configured ✗"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-primary/5 py-4">
              <p className="text-xs text-muted-foreground">
                All configuration data is encrypted and stored securely.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Configuration