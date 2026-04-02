import { useState } from "react"
import { CustomersTable } from "@/components/customers/CustomersTable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Download, Filter, Users, DollarSign, ShoppingBag, Star } from "lucide-react"

// Mock customer data
const mockCustomers: any[] = []

export function Customers() {
  const [customers, setCustomers] = useState(mockCustomers)

  const handleSendEmail = (customer: any) => {
    console.log('Send email to:', customer.email)
    // In a real app, open email composer
  }

  const handleSendMessage = (customer: any) => {
    console.log('Send message to:', customer.name)
    // In a real app, open messenger
  }

  const handleToggleStatus = (customer: any) => {
    setCustomers(customers.map(c => 
      c.id === customer.id 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
        : c
    ))
  }

  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip')
  const vipCustomers = customers.filter(c => c.status === 'vip')
  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0)
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCustomers.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VIP Section */}
      {vipCustomers.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="font-semibold">VIP Customers ({vipCustomers.length})</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {vipCustomers.map(customer => (
                <div key={customer.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      ${customer.spent.toLocaleString()} spent � {customer.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <CustomersTable
        customers={customers}
        onSendEmail={handleSendEmail}
        onSendMessage={handleSendMessage}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}
