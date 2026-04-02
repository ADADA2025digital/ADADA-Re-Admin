import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Save
} from "lucide-react"

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>

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
              <Button variant="outline">Change Logo</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="EcoMart" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">Store Email</Label>
                <Input id="store-email" type="email" defaultValue="store@ecomart.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">Phone Number</Label>
                <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-website">Website</Label>
                <Input id="store-website" defaultValue="https://ecomart.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-address">Address</Label>
              <Textarea
                id="store-address"
                defaultValue="123 Main Street, Suite 100, New York, NY 10001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-description">Store Description</Label>
              <Textarea
                id="store-description"
                defaultValue="Your one-stop shop for all things amazing. We offer high-quality products at competitive prices."
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
      </TabsContent>

      <TabsContent value="store" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>
              Configure your store preferences and defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="est">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Store Features</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="guest-checkout">Guest Checkout</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to checkout without creating an account
                  </p>
                </div>
                <Switch id="guest-checkout" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="wishlist">Wishlist</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable wishlist functionality for customers
                  </p>
                </div>
                <Switch id="wishlist" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviews">Product Reviews</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to leave reviews on products
                  </p>
                </div>
                <Switch id="reviews" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backorders">Allow Backorders</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to order out-of-stock items
                  </p>
                </div>
                <Switch id="backorders" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

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
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Currency Settings</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accepted-currencies">Accepted Currencies</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="accepted-currencies">
                      <SelectValue placeholder="Select currencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD only</SelectItem>
                      <SelectItem value="multiple">Multiple currencies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price-rounding">Price Rounding</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="price-rounding">
                      <SelectValue placeholder="Select rounding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (.99)</SelectItem>
                      <SelectItem value="nearest">Nearest whole number</SelectItem>
                      <SelectItem value="none">No rounding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

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
                Add Shipping Zone
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Default Shipping Options</h3>
              
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="estimated-delivery">Estimated Delivery</Label>
                  <p className="text-xs text-muted-foreground">
                    Default delivery time in days
                  </p>
                </div>
                <div className="w-[200px]">
                  <Input id="estimated-delivery" type="number" defaultValue="3-5" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure email and system notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Notifications</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-order">New Order</Label>
                  <p className="text-xs text-muted-foreground">
                    Send email when a new order is placed
                  </p>
                </div>
                <Switch id="new-order" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-update">Order Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Send email when order status changes
                  </p>
                </div>
                <Switch id="order-update" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock">Low Stock Alert</Label>
                  <p className="text-xs text-muted-foreground">
                    Send alert when products are low in stock
                  </p>
                </div>
                <Switch id="low-stock" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-customer">New Customer</Label>
                  <p className="text-xs text-muted-foreground">
                    Send notification when new customer registers
                  </p>
                </div>
                <Switch id="new-customer" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Templates</h3>
              
              <div className="space-y-2">
                <Label htmlFor="order-confirmation">Order Confirmation</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="order-confirmation">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping-confirmation">Shipping Confirmation</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="shipping-confirmation">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="team" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Admin User {i}</p>
                      <p className="text-sm text-muted-foreground">admin{i}@ecomart.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Admin</Badge>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Roles & Permissions</h3>
              
              <div className="border rounded-lg divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Administrator</p>
                    <p className="text-sm text-muted-foreground">Full access to all features</p>
                  </div>
                  <Badge>3 members</Badge>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">Can manage products and orders</p>
                  </div>
                  <Badge variant="outline">2 members</Badge>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Support</p>
                    <p className="text-sm text-muted-foreground">Can view orders and customers</p>
                  </div>
                  <Badge variant="outline">1 member</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}