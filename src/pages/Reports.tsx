import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  Printer,
  Mail,
  Eye,
  Edit,
  Trash,
  PlusCircle,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock reports data
const reports: any[] = []

// Report templates
const templates = [
  {
    id: 1,
    name: "Sales Report",
    icon: BarChart3,
    description: "Daily, weekly, or monthly sales data",
    category: "sales"
  },
  {
    id: 2,
    name: "Customer Report",
    icon: Users,
    description: "Customer acquisition and retention",
    category: "customers"
  },
  {
    id: 3,
    name: "Inventory Report",
    icon: Package,
    description: "Stock levels and movement",
    category: "inventory"
  },
  {
    id: 4,
    name: "Financial Report",
    icon: DollarSign,
    description: "Revenue, profit, and expenses",
    category: "financial"
  },
  {
    id: 5,
    name: "Marketing Report",
    icon: TrendingUp,
    description: "Campaign performance and ROI",
    category: "marketing"
  },
  {
    id: 6,
    name: "Product Report",
    icon: ShoppingCart,
    description: "Product performance metrics",
    category: "products"
  }
]

export function Reports() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("7days")

  const filteredReports = selectedType === "all" 
    ? reports 
    : reports.filter(r => r.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'sales': return <BarChart3 className="h-4 w-4" />
      case 'customers': return <Users className="h-4 w-4" />
      case 'inventory': return <Package className="h-4 w-4" />
      case 'financial': return <DollarSign className="h-4 w-4" />
      case 'marketing': return <TrendingUp className="h-4 w-4" />
      case 'products': return <ShoppingCart className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download business reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <template.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">Report Type:</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">Date Range:</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">{report.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.format}</Badge>
                      </TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Generated</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Sales reports filtered view</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Customer reports filtered view</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Inventory reports filtered view</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Financial reports filtered view</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
