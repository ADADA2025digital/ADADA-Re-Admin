import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Truck,
  Shield,
  Bell,
  Palette,
  Users,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Lock,
  Key,
  Database,
  Server,
  Cloud,
  Webhook,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  RefreshCw
} from "lucide-react"

export function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    EC
                  </AvatarFallback>
                </Avatar>
                <div className="space-x-2">
                  <Button variant="outline">Change Logo</Button>
                  <Button variant="ghost">Remove</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input id="store-name" defaultValue="" placeholder="Store Name" />
                </div>
                <div className="space-y-2">
                  <Input id="store-email" type="email" defaultValue="" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Input id="store-phone" defaultValue="" placeholder="Phone" />
                </div>
                <div className="space-y-2">
                  <Input id="store-website" defaultValue="" placeholder="Website" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address">Address</Label>
                <Textarea
                  id="store-address"
                  defaultValue=""
                  placeholder="Address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  defaultValue=""
                  placeholder="Store Description"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Set your store's language, currency, and timezone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (�)</SelectItem>
                      <SelectItem value="gbp">GBP (�)</SelectItem>
                      <SelectItem value="jpy">JPY (�)</SelectItem>
                      <SelectItem value="aud">AUD (A$)</SelectItem>
                      <SelectItem value="cad">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                      <SelectItem value="cet">Central European (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger id="time-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (12:00 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (14:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Localization
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>
                Configure your store preferences and defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="guest-checkout">Guest Checkout</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to checkout without creating an account
                  </p>
                </div>
                <Switch id="guest-checkout" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="wishlist">Wishlist</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable wishlist functionality for customers
                  </p>
                </div>
                <Switch id="wishlist" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviews">Product Reviews</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to leave reviews on products
                  </p>
                </div>
                <Switch id="reviews" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backorders">Allow Backorders</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to order out-of-stock items
                  </p>
                </div>
                <Switch id="backorders" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="discounts">Automatic Discounts</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically apply available discounts at checkout
                  </p>
                </div>
                <Switch id="discounts" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="abandoned-cart">Abandoned Cart Emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Send automatic emails to customers with abandoned carts
                  </p>
                </div>
                <Switch id="abandoned-cart" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Store Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure your payment gateways and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Active Payment Methods</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Credit / Debit Cards</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 8h20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">PayPal Express Checkout</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Direct bank payments</p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <div>
                      <p className="font-medium">Apple Pay / Google Pay</p>
                      <p className="text-sm text-muted-foreground">Digital wallet payments</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Payment Settings</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (�)</SelectItem>
                        <SelectItem value="gbp">GBP (�)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input id="tax-rate" type="number" defaultValue="10" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping zones, rates, and carriers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Shipping Zones</h3>
                
                <div className="border rounded-lg divide-y">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">United States</p>
                      <p className="text-sm text-muted-foreground">2 shipping methods</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Canada</p>
                      <p className="text-sm text-muted-foreground">2 shipping methods</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">European Union</p>
                      <p className="text-sm text-muted-foreground">1 shipping method</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Truck className="h-4 w-4 mr-2" />
                  Add Shipping Zone
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Shipping Rates</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="standard-rate">Standard Shipping Rate</Label>
                    <Input id="standard-rate" type="number" defaultValue="5.99" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="express-rate">Express Shipping Rate</Label>
                    <Input id="express-rate" type="number" defaultValue="14.99" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="free-shipping">Free Shipping Threshold</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimum order amount for free shipping
                    </p>
                  </div>
                  <div className="w-[200px]">
                    <Input id="free-shipping" type="number" defaultValue="50" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="handling-fee">Handling Fee</Label>
                    <p className="text-xs text-muted-foreground">
                      Additional fee per order
                    </p>
                  </div>
                  <div className="w-[200px]">
                    <Input id="handling-fee" type="number" defaultValue="0" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Shipping Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-orders">New Orders</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive email when new orders are placed
                    </p>
                  </div>
                  <Switch id="email-orders" defaultChecked={notifications.email} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-lowstock">Low Stock Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when products are running low
                    </p>
                  </div>
                  <Switch id="email-lowstock" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reviews">New Reviews</Label>
                    <p className="text-xs text-muted-foreground">
                      Notifications when customers leave reviews
                    </p>
                  </div>
                  <Switch id="email-reviews" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-marketing">Marketing Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch id="email-marketing" defaultChecked={notifications.marketing} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-orders">Order Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Push notifications for order status changes
                    </p>
                  </div>
                  <Switch id="push-orders" defaultChecked={notifications.push} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-system">System Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Important system notifications
                    </p>
                  </div>
                  <Switch id="push-system" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">SMS Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-urgent">Urgent Alerts Only</Label>
                    <p className="text-xs text-muted-foreground">
                      Critical notifications via SMS
                    </p>
                  </div>
                  <Switch id="sms-urgent" defaultChecked={notifications.sms} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button>Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authenticator App</Label>
                    <p className="text-xs text-muted-foreground">
                      Use an authenticator app to generate codes
                    </p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Session Management</h3>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Started 2 hours ago</p>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="text-sm">
                    <p>IP: 192.168.1.100</p>
                    <p>Device: Chrome on Windows</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Log Out All Devices
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">API Access</h3>
                
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 p-2 bg-muted rounded-md text-sm font-mono">
                      sk_live_�����������������������
                    </code>
                    <Button variant="outline">Show</Button>
                  </div>
                </div>
                
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate API Key
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium">Delete Store</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your store and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Store</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download a complete export of all store data
                  </p>
                </div>
                <Button variant="outline">Export Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
