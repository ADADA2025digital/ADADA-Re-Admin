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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Home
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Property } from "@/lib/data"

interface PropertyTableProps {
  properties: Property[]
  onEdit?: (property: Property) => void
  onView?: (property: Property) => void
  onDelete?: (property: Property) => void
  onSort?: (key: string) => void
  sortConfig?: { key: string; direction: 'asc' | 'desc' }
}

export function PropertyTable({ 
  properties, 
  onEdit, 
  onView,
  onDelete, 
  onSort,
  sortConfig 
}: PropertyTableProps) {
  
  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-500'
      case 'sold': return 'bg-red-500'
      case 'leased': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ArrowUp className="h-4 w-4 ml-1" /> : 
        <ArrowDown className="h-4 w-4 ml-1" />
    }
    return <ArrowUpDown className="h-4 w-4 ml-1" />
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border bg-background/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button 
                  variant="ghost" 
                  onClick={() => onSort?.('property_title')}
                >
                  Property
                  {getSortIcon('property_title')}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => onSort?.('price_guide')}
                >
                  Price Guide
                  {getSortIcon('price_guide')}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Built Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.pr_id} className="hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-md">
                        {property.assets && property.assets.find(a => a.asset_type === 'img') ? (
                          <AvatarImage src={property.assets.find(a => a.asset_type === 'img')!.asset_value} alt={property.property_title} className="object-cover" />
                        ) : (
                          <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                            <Home className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{property.property_title}</p>
                        <p className="text-xs text-muted-foreground">{property.property_reason}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{property.property_type?.pr_type_name || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(property.price_guide)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(property.propert_status)}>
                      {property.propert_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.property_built_year}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-primary/20 shadow-xl">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary/10" />
                        <DropdownMenuItem onClick={() => onView?.(property)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(property)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/10" />
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(property)}
                          className="text-red-600 cursor-pointer hover:bg-red-50"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
