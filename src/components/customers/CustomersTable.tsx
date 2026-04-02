import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  Ban,
  Search,
  Filter,
  ArrowUpDown,
  UserPlus,
  Download
} from "lucide-react"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import type { Customer } from "@/lib/data"

interface CustomersTableProps {
  customers: Customer[]
  onSendEmail?: (customer: Customer) => void
  onSendMessage?: (customer: Customer) => void
  onToggleStatus?: (customer: Customer) => void
}

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  vip: "bg-purple-500"
}

export function CustomersTable({ customers, onSendEmail, onSendMessage, onToggleStatus }: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Customer>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    }
    return a[sortField] < b[sortField] ? 1 : -1
  })

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")}>
                  Customer
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("orders")}>
                  Orders
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("spent")}>
                  Total Spent
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                      (555) 123-4567
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{formatCurrency(customer.spent)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[customer.status]}>
                    {customer.status}
                    {customer.status === 'vip' && <Star className="h-3 w-3 ml-1 inline" />}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    {customer.location}
                  </div>
                </TableCell>
                <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onSendEmail?.(customer)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendMessage?.(customer)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Mark as VIP
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onToggleStatus?.(customer)}
                        className={customer.status === 'active' ? 'text-red-600' : 'text-green-600'}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}