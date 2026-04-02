import { useState, useEffect } from "react"
import api from "@/lib/api"
import { PropertyTable } from "@/components/properties/PropertyTable"
import { PropertyFilters } from "@/components/properties/PropertyFilters"
import { PropertyForm } from "@/components/properties/PropertyForm"
import type { Property } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Home,
  Plus,
  Edit,
  Trash,
  Bed,
  Car,
  Bath,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle,
  Layout,
  Grid3x3,
  MapPin,
  Eye,
  DollarSign,
  Key,
  User,
  Phone,
  Mail,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, cn, getInitials } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewProperty, setViewProperty] = useState<Property | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(6)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'property_title', direction: 'asc' })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/properties')
      if (response.data.success && response.data.data) {
        setProperties(response.data.data)
        setFilteredProperties(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive"
      })
      setProperties([])
      setFilteredProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // Pagination logic handling "all"
  const totalItems = filteredProperties.length
  const actualItemsPerPage = itemsPerPage === "all" ? totalItems : itemsPerPage
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / (actualItemsPerPage || 1))
  const indexOfLastItem = currentPage * (actualItemsPerPage || totalItems)
  const indexOfFirstItem = indexOfLastItem - (actualItemsPerPage || totalItems)
  const currentItems = itemsPerPage === "all" ? filteredProperties : filteredProperties.slice(indexOfFirstItem, indexOfLastItem)

  // Handle filter change
  const handleFilterChange = (filters: any) => {
    let filtered = [...properties]

    if (filters.search) {
      filtered = filtered.filter(p =>
        p.property_title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.property_description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => Number(p.price_guide) >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => Number(p.price_guide) <= Number(filters.maxPrice))
    }
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(p => p.pr_type_id?.toString() === filters.type)
    }
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(p => p.propert_status?.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.advertiseOn) {
      filtered = filtered.filter(p => {
        const pDate = new Date(p.created_at || Date.now()).toISOString().split('T')[0]
        return pDate === filters.advertiseOn
      })
    }

    setFilteredProperties(filtered)
    setCurrentPage(1)
  }

  // Handle sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...filteredProperties].sort((a: any, b: any) => {
      const valA = (a as any)[key]
      const valB = (b as any)[key]
      if (direction === 'asc') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })
    setFilteredProperties(sorted)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchProperties()
    setIsRefreshing(false)
    toast({ title: "Properties updated", description: "Latest property data loaded successfully" })
  }

  const handleCreateProperty = async (data: FormData) => {
    console.group('[Properties] CREATE Property Request')
    console.log('FormData entries:')
    for (const [key, value] of (data as any).entries()) {
      console.log(`  ${key}:`, value)
    }
    try {
      const response = await api.post('/properties', data)
      console.log('[Properties] CREATE Response:', response.data)
      if (response.data.success) {
        toast({ title: "Success", description: "Property created successfully" })
        setIsFormOpen(false)
        fetchProperties()
      } else {
        console.warn('[Properties] CREATE failed (non-success):', response.data)
        toast({ title: "Error", description: response.data.message || "Failed to create property", variant: "destructive" })
      }
    } catch (error: any) {
      console.error('[Properties] CREATE Error:', error)
      console.error('[Properties] CREATE Error response:', error?.response?.data)
      const msg = error?.response?.data?.message || error?.message || 'Failed to create property'
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      console.groupEnd()
    }
  }

  const handleUpdateProperty = async (data: FormData) => {
    if (!selectedProperty) return
    console.group(`[Properties] UPDATE Property #${selectedProperty.pr_id} Request`)
    console.log('FormData entries:')
    for (const [key, value] of (data as any).entries()) {
      console.log(`  ${key}:`, value)
    }
    try {
      // Backend route is POST /properties/{id} for update (multipart/form-data)
      const response = await api.post(`/properties/${selectedProperty.pr_id}`, data)
      console.log('[Properties] UPDATE Response:', response.data)
      if (response.data.success) {
        toast({ title: "Success", description: "Property updated successfully" })
        setIsFormOpen(false)
        fetchProperties()
      } else {
        console.warn('[Properties] UPDATE failed (non-success):', response.data)
        toast({ title: "Error", description: response.data.message || "Failed to update property", variant: "destructive" })
      }
    } catch (error: any) {
      console.error('[Properties] UPDATE Error:', error)
      console.error('[Properties] UPDATE Error response:', error?.response?.data)
      const msg = error?.response?.data?.message || error?.message || 'Failed to update property'
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      console.groupEnd()
    }
  }

  const handleDeleteProperty = async (property: Property) => {
    if (!confirm(`Are you sure you want to delete "${property.property_title}"?`)) return
    try {
      const response = await api.delete(`/properties/${property.pr_id}`)
      if (response.data.success) {
        toast({ title: "Success", description: "Property deleted successfully" })
        fetchProperties()
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({ title: "Error", description: "Failed to delete property", variant: "destructive" })
    }
  }

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property)
    setIsFormOpen(true)
  }

  const handleViewClick = (property: Property) => {
    setViewProperty(property)
    setIsViewOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your real estate listings and properties.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="backdrop-blur-sm"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button onClick={() => {
            setSelectedProperty(null)
            setIsFormOpen(true)
          }} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Total Properties</p>
              <Home className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Available</p>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {properties.filter(p => p.propert_status?.toLowerCase() === 'available').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Sold</p>
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold">
              {properties.filter(p => p.propert_status?.toLowerCase() === 'sold').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Leased</p>
              <Key className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">
              {properties.filter(p => p.propert_status?.toLowerCase() === 'leased').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
        <div className="flex items-center justify-between">
          <PropertyFilters onFilterChange={handleFilterChange} />
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="table"><Layout className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="grid"><Grid3x3 className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="border-none p-0 pt-4">
          <PropertyTable
            properties={currentItems}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteProperty}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </TabsContent>

        <TabsContent value="grid" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((property) => (
              <Card key={property.pr_id} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-primary/10 bg-background/50 backdrop-blur-md">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {property.assets && property.assets.find(a => a.asset_type === 'img') ? (
                    <img
                      src={property.assets.find(a => a.asset_type === 'img')!.asset_value}
                      alt={property.property_title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-primary/5">
                      <Home className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <Badge className={cn("absolute top-3 right-3 shadow-lg", getStatusColor(property.propert_status))}>
                    {property.propert_status}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{property.property_title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {property.property_reason}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(property.price_guide)}</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setViewProperty(property)
                        setIsViewOpen(true)
                      }} className="hover:bg-primary/10 hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelectedProperty(property)
                        setIsFormOpen(true)
                      }} className="hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProperty(property)} className="hover:bg-red-500/10 hover:text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination & Rows per page */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 rounded-md p-1 backdrop-blur-sm">
          <p className="pl-2">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => {
              setItemsPerPage(v === "all" ? "all" : Number(v))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-background/80" side="top">
              {[5, 10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <PropertyForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        property={selectedProperty || undefined}
        onSubmit={selectedProperty ? handleUpdateProperty : handleCreateProperty}
      />

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setActiveImageIndex(0); }}>
        <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[85vh] p-0 overflow-hidden backdrop-blur-md border-primary/20 shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b bg-muted/30">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Details - {viewProperty?.property_title}
            </DialogTitle>
          </DialogHeader>

          {viewProperty && (
            <div className="max-h-[min(80vh,750px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">

              {/* Main Split Layout: Image on Left, Details on Right */}
              <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-6">

                {/* LEFT COLUMN: Media Gallery */}
                <div className="space-y-4">
                  {viewProperty.assets && viewProperty.assets.filter(a => a.asset_type === 'img').length > 0 ? (
                    <div className="w-full bg-black/5 rounded-lg border overflow-hidden shadow-sm">
                      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                        {/* Main Image */}
                        <img
                          src={viewProperty.assets.filter(a => a.asset_type === 'img')[activeImageIndex]?.asset_value || ""}
                          className="w-full h-full object-cover transition-all duration-500"
                          alt="Property Main"
                        />

                        {/* Image Counter Badge if multiple */}
                        {viewProperty.assets.filter(a => a.asset_type === 'img').length > 1 && (
                          <div className="absolute right-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            {activeImageIndex + 1} / {viewProperty.assets.filter(a => a.asset_type === 'img').length}
                          </div>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {viewProperty.assets.filter(a => a.asset_type === 'img').length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto bg-muted/30">
                          {viewProperty.assets.filter(a => a.asset_type === 'img').map((asset, i) => (
                            <div
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              className={`h-16 w-24 shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${i === activeImageIndex ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'}`}
                            >
                              <img src={asset.asset_value} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg border shadow-sm text-muted-foreground">
                      <Home className="h-16 w-16 opacity-20 mb-4" />
                      <p>No images available</p>
                    </div>
                  )}

                  {/* Description Box */}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40 font-medium">
                      <FileText className="h-4 w-4" /> Details & Description
                    </div>
                    <div className="p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {viewProperty.property_description || "No description provided."}
                    </div>
                  </div>

                  {/* Agent Card (Moved below Description) */}
                  {viewProperty.agents && viewProperty.agents.length > 0 && (
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-primary/20">
                      <div className="flex items-center gap-2 px-4 py-3 border-b bg-primary/10 font-medium text-primary">
                        <User className="h-4 w-4" /> Assigned Agent
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        {viewProperty.agents?.map((agentRel: any, i: number) => {
                          const agentUser = agentRel.user;
                          if (!agentUser) return null;
                          const address = agentUser.addresses?.[0];
                          const profilePic = agentUser.profile?.user_pic
                            ? (agentUser.profile.user_pic.startsWith('http') ? agentUser.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${agentUser.profile.user_pic}`)
                            : null;

                          return (
                            <div key={i} className="flex gap-4 items-start">
                              <Avatar className="h-12 w-12 border shadow-sm">
                                {profilePic ? (
                                  <img src={profilePic} className="w-full h-full object-cover" alt={agentUser.details?.user_firstname} />
                                ) : (
                                  <AvatarFallback className="bg-primary/5 text-primary">
                                    {getInitials(`${agentUser.details?.user_firstname} ${agentUser.details?.user_lastname}`)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex flex-col gap-1.5 flex-1">
                                <p className="font-semibold text-base capitalize">
                                  {agentUser.details ? `${agentUser.details.user_firstname} ${agentUser.details.user_lastname}` : agentUser.user_email}
                                </p>
                                <div className="space-y-1">
                                  {agentUser.details?.user_phone_number && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Phone className="h-3 w-3" />{agentUser.details.user_phone_number}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground flex items-center gap-2"><Mail className="h-3 w-3" />{agentUser.user_email}</p>
                                  {address && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                      <MapPin className="h-3 w-3 shrink-0" />
                                      <span>{`${address.address_line1}, ${address.person_city}, ${address.person_state} ${address.postal_code}`}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              {i < viewProperty.agents.length - 1 && <Separator className="my-2" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Attachments & Links Card (Moved below Agent) */}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40 font-medium text-primary">
                      <LinkIcon className="h-4 w-4" /> Attachments & Links
                    </div>
                    <div className="p-4">
                      {!viewProperty.assets || viewProperty.assets.filter(a => a.asset_type !== 'img').length === 0 ? (
                        <p className="text-sm text-muted-foreground">No additional attachments.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {viewProperty.assets.filter(a => a.asset_type !== 'img').map((asset, i) => (
                            <a
                              key={`asset-${i}`}
                              href={asset.asset_value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline bg-background px-3 py-2 rounded-md border shadow-sm text-sm transition-colors hover:bg-muted/50"
                            >
                              {asset.asset_type === 'video_link' ? <LinkIcon className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                              <span className="truncate">{asset.asset_value.split('/').pop() || asset.asset_value}</span>
                              <Badge variant="secondary" className="ml-auto text-[10px] hidden sm:inline-flex capitalize">
                                {asset.asset_type.replace('_', ' ')}
                              </Badge>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Stacked Info Cards */}
                <div className="space-y-6">

                  {/* Basic Information Card */}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40 font-medium text-primary">
                      <AlertCircle className="h-4 w-4" /> Basic Information
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Price Guide</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-500">{formatCurrency(viewProperty.price_guide)}</p>
                      </div>
                      <Separator className="col-span-2" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <Badge className={cn("shadow-sm cursor-default", getStatusColor(viewProperty.propert_status))}>
                          {viewProperty.propert_status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Type</p>
                        <p className="font-semibold">{viewProperty.property_type?.pr_type_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reason</p>
                        <p className="font-semibold">{viewProperty.property_reason}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Advertise On</p>
                        <p className="font-semibold text-muted-foreground">{new Date(viewProperty.created_at || Date.now()).toISOString().split('T')[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specifications Card */}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40 font-medium text-primary">
                      <Layout className="h-4 w-4" /> Specifications
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-y-5 gap-x-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bedrooms</p>
                        <p className="font-semibold flex items-center gap-1.5"><Bed className="h-4 w-4 text-primary/70" /> {viewProperty.specifications?.number_of_bathrooms || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bathrooms</p>
                        <p className="font-semibold flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary/70" /> {viewProperty.specifications?.number_of_bathrooms || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Garage / Parking</p>
                        <p className="font-semibold flex items-center gap-1.5"><Car className="h-4 w-4 text-primary/70" /> {viewProperty.specifications?.parking_area || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Built Year</p>
                        <p className="font-semibold">{viewProperty.property_built_year}</p>
                      </div>
                      <Separator className="col-span-2" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Land Size</p>
                        <p className="font-semibold">{viewProperty.specifications?.property_land_size || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Building Area</p>
                        <p className="font-semibold">{viewProperty.specifications?.property_building_area || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t bg-muted/10 sm:justify-end">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
              <Button onClick={() => {
                setIsViewOpen(false)
                handleEditClick(viewProperty!)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'available': return 'bg-green-500'
    case 'sold': return 'bg-red-500'
    case 'leased': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}
