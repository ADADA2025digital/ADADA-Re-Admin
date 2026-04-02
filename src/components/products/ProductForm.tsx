import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Upload,
  X,
  Plus,
  Tag,
  Package,
  DollarSign,
  Hash,
  Building,
  MapPin,
  Calendar,
  Truck,
  Star,
  HelpCircle,
  Save,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  onSubmit: (product: Partial<Product>) => void
}

// Categories
const categories = [
  "Electronics",
  "Footwear",
  "Accessories",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Toys",
  "Books",
  "Automotive"
]

// Brands
const brands = [
  "Sony",
  "Apple",
  "Nike",
  "North Face",
  "Ray-Ban",
  "Dell",
  "Logitech",
  "Samsung",
  "Adidas",
  "Puma",
  "Generic"
]

// Suppliers
const suppliers = [
  "TechDistributor Inc",
  "Apple Distributor",
  "SportsDirect",
  "OutdoorGear Co",
  "LuxuryEyewear",
  "Dell Direct",
  "Global Imports",
  "Local Supplier"
]

// Warehouse locations
const locations = [
  "Aisle A, Shelf 1",
  "Aisle A, Shelf 2",
  "Aisle A, Shelf 3",
  "Aisle B, Shelf 1",
  "Aisle B, Shelf 2",
  "Aisle B, Shelf 3",
  "Aisle C, Shelf 1",
  "Aisle C, Shelf 2",
  "Aisle D, Shelf 1",
  "Aisle E, Shelf 1",
  "Warehouse 2, Zone A",
  "Warehouse 2, Zone B"
]

export function ProductForm({ open, onOpenChange, product, onSubmit }: ProductFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    sold: product?.sold || 0,
    revenue: product?.revenue || 0,
    status: product?.status || "draft",
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
    sku: product?.sku || "",
    brand: product?.brand || "",
    supplier: product?.supplier || "",
    lastRestocked: product?.lastRestocked || new Date().toISOString().split('T')[0],
    location: product?.location || "",
    description: product?.description || "",
    images: product?.image ? [product.image] : []
  })

  const [images, setImages] = useState<string[]>(product?.image ? [product.image] : [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Generate SKU automatically if not provided
  useEffect(() => {
    if (!formData.sku && formData.name) {
      const prefix = formData.name.substring(0, 3).toUpperCase()
      const random = Math.floor(Math.random() * 1000)
      setFormData(prev => ({ ...prev, sku: `${prefix}-${random}` }))
    }
  }, [formData.name])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you'd upload to server and get URLs
      // For demo, we'll use placeholder with file names
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
      setFormData({ ...formData, image: newImages[0] })
      
      toast({
        title: "Images uploaded",
        description: `${files.length} image(s) uploaded successfully`,
        variant: "success",
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    if (index === 0 && images.length > 1) {
      setFormData({ ...formData, image: images[1] })
    } else if (images.length === 1) {
      setFormData({ ...formData, image: undefined })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = "Stock must be 0 or greater"
    }
    if (!formData.sku?.trim()) {
      newErrors.sku = "SKU is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    onSubmit({
      ...formData,
      image: images[0] // Main image
    })
    
    toast({
      title: product ? "Product updated" : "Product created",
      description: `${formData.name} has been ${product ? 'updated' : 'created'} successfully`,
      variant: "success",
    })
    
    onOpenChange(false)
  }

  const calculateMargin = () => {
    if (formData.price && formData.cost) {
      return ((formData.price - formData.cost) / formData.price * 100).toFixed(1)
    }
    return '0.0'
  }

  const calculateProfit = () => {
    if (formData.price && formData.cost && formData.sold) {
      return (formData.price - formData.cost) * formData.sold
    }
    return 0
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {product ? (
                <>
                  <Package className="h-6 w-6" />
                  Edit Product: {product.name}
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6" />
                  Add New Product
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {product 
                ? "Update product information and details" 
                : "Fill in the details to create a new product"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
              <TabsTrigger value="images">Images & Media</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    Product Name <span className="text-red-500">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>The display name of your product</TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wireless Headphones"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-1">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description?.length || 0}/500 characters
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Pricing & Stock Tab */}
            <TabsContent value="pricing" className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {formData.price && formData.cost && formData.price > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <Badge variant={parseFloat(calculateMargin()) > 30 ? "default" : "secondary"}>
                      {calculateMargin()}%
                    </Badge>
                  </div>
                  <Progress value={parseFloat(calculateMargin())} className="h-2 mt-2" />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-500">{errors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sold">Units Sold</Label>
                  <Input
                    id="sold"
                    type="number"
                    min="0"
                    value={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: parseInt(e.target.value) || 0 })}
                    disabled={!product} // Only editable when editing
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: parseFloat(e.target.value) || 0 })}
                    disabled={!product}
                  />
                </div>
              </div>

              {formData.sold && formData.sold > 0 && (
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Profit</span>
                    <span className="text-lg font-bold text-green-600">
                      ${calculateProfit().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Additional Details Tab */}
            <TabsContent value="details" className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="flex items-center gap-1">
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g., PRD-001"
                      className={`pl-8 ${errors.sku ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.sku && (
                    <p className="text-xs text-red-500">{errors.sku}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    />
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Warehouse Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastRestocked">Last Restocked</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastRestocked"
                      type="date"
                      value={formData.lastRestocked}
                      onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6 py-4">
              <div className="space-y-4">
                <Label>Product Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border bg-muted group">
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarFallback className="rounded-lg bg-primary/10">
                          <ImageIcon className="h-8 w-8 text-primary/40" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-primary">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  <label className="aspect-square rounded-lg border border-dashed hover:bg-muted cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images. First image will be used as the main product image.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
