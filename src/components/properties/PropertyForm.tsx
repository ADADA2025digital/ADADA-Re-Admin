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
import { RichTextEditor } from "@/components/ui/RichTextEditor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Upload,
  X,
  Home,
  Maximize,
  Layout,
  Car,
  Bed,
  DollarSign,
  Calendar,
  Save,
  Loader2,
  ImageOff,
  Link,
  FileText,
  Plus,
  AlertCircle,
  Building2,
  Ruler,
  Square,
  Video,
  File,
  Trash2,
  Info,
  Grid3X3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Property } from "@/lib/data"
import api from "@/lib/api"

interface PropertyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property?: Property
  onSubmit: (data: FormData) => Promise<void>
}

interface PropertyType {
  pr_type_id: number
  pr_type_name: string
}

interface ExistingAsset {
  pr_assets_id: number
  asset_type: "img" | "video_link" | "document"
  asset_value: string
}

export function PropertyForm({ open, onOpenChange, property, onSubmit }: PropertyFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // ---- Existing assets from backend ----
  const [existingAssets, setExistingAssets] = useState<ExistingAsset[]>([])
  const [assetsToDelete, setAssetsToDelete] = useState<number[]>([])

  // ---- New images ----
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  // ---- New video links ----
  const [newVideoLinks, setNewVideoLinks] = useState<string[]>([""])

  // ---- New documents ----
  const [newDocFiles, setNewDocFiles] = useState<File[]>([])
  const [newDocNames, setNewDocNames] = useState<string[]>([])

  const [formData, setFormData] = useState({
    property_title: "",
    pr_type_id: "",
    property_reason: "Sale",
    price_guide: "",
    property_description: "",
    property_built_year: new Date().getFullYear().toString(),
    propert_status: "Available",
    is_active: true,
    property_land_size: "",
    property_building_area: "",
    garage_availability: "0",
    rooms_availability: "0",
    bedrooms_availability: "0",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchPropertyTypes()
    if (property) {
      setFormData({
        property_title: property.property_title || "",
        pr_type_id: property.pr_type_id?.toString() || "",
        property_reason: property.property_reason || "Sale",
        price_guide: property.price_guide?.toString() || "",
        property_description: property.property_description || "",
        property_built_year: property.property_built_year?.toString() || new Date().getFullYear().toString(),
        propert_status: property.propert_status || "Available",
        is_active: property.is_active ?? true,
        property_land_size: property.specifications?.property_land_size || "",
        property_building_area: property.specifications?.property_building_area || "",
        garage_availability: property.specifications?.parking_area?.toString() || "0",
        rooms_availability: property.specifications?.number_of_rooms?.toString() || "0",
        bedrooms_availability: property.specifications?.number_of_bathrooms?.toString() || "0",
      })
      setExistingAssets(
        (property.assets || []).map((a) => ({
          pr_assets_id: (a as any).pr_assets_id,
          asset_type: a.asset_type as "img" | "video_link" | "document",
          asset_value: a.asset_value,
        }))
      )
      setAssetsToDelete([])
      setNewImageFiles([])
      setNewImagePreviews([])
      setNewVideoLinks([""])
      setNewDocFiles([])
      setNewDocNames([])
    } else {
      resetForm()
    }
  }, [property, open])

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [newImagePreviews])

  const resetForm = () => {
    setFormData({
      property_title: "",
      pr_type_id: "",
      property_reason: "Sale",
      price_guide: "",
      property_description: "",
      property_built_year: new Date().getFullYear().toString(),
      propert_status: "Available",
      is_active: true,
      property_land_size: "",
      property_building_area: "",
      garage_availability: "0",
      rooms_availability: "0",
      bedrooms_availability: "0",
    })
    setExistingAssets([])
    setAssetsToDelete([])
    setNewImageFiles([])
    setNewImagePreviews([])
    setNewVideoLinks([""])
    setNewDocFiles([])
    setNewDocNames([])
    setValidationErrors({})
  }

  const fetchPropertyTypes = async () => {
    try {
      const response = await api.get("/property-types")
      if (response.data.success) setPropertyTypes(response.data.data)
    } catch (error) {
      console.error("Error fetching property types:", error)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.property_title.trim()) {
      errors.property_title = "Property title is required"
    } else if (formData.property_title.length < 3) {
      errors.property_title = "Title must be at least 3 characters"
    }

    if (!formData.pr_type_id) {
      errors.pr_type_id = "Property type is required"
    }

    if (!formData.price_guide) {
      errors.price_guide = "Price guide is required"
    } else if (isNaN(Number(formData.price_guide)) || Number(formData.price_guide) <= 0) {
      errors.price_guide = "Please enter a valid price"
    }

    if (!formData.property_description || formData.property_description.trim() === "" || formData.property_description === "<p></p>" || formData.property_description === "<p><br></p>") {
      errors.property_description = "Description is required"
    } else {
      // Strip HTML to check real text length
      const doc = new DOMParser().parseFromString(formData.property_description, 'text/html')
      const plainText = doc.body.textContent || ""
      if (plainText.length < 20) {
        errors.property_description = "Description must be at least 20 characters"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ---- Image handlers ----
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      if (validFiles.length !== files.length) {
        toast({ title: "Warning", description: "Only image files are allowed", variant: "destructive" })
      }
      setNewImageFiles((prev) => [...prev, ...validFiles])
      setNewImagePreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))])
    }
    e.target.value = ""
  }

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // ---- Document handlers ----
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles = Array.from(files).filter(file => 
        ['.pdf', '.doc', '.docx', '.txt'].some(ext => file.name.toLowerCase().endsWith(ext))
      )
      if (validFiles.length !== files.length) {
        toast({ title: "Warning", description: "Only PDF, DOC, DOCX, and TXT files are allowed", variant: "destructive" })
      }
      setNewDocFiles((prev) => [...prev, ...validFiles])
      setNewDocNames((prev) => [...prev, ...validFiles.map((f) => f.name)])
    }
    e.target.value = ""
  }

  const removeNewDoc = (index: number) => {
    setNewDocFiles((prev) => prev.filter((_, i) => i !== index))
    setNewDocNames((prev) => prev.filter((_, i) => i !== index))
  }

  // ---- Video link handlers ----
  const addVideoLinkField = () => setNewVideoLinks((prev) => [...prev, ""])
  const updateVideoLink = (index: number, value: string) =>
    setNewVideoLinks((prev) => prev.map((v, i) => (i === index ? value : v)))
  const removeVideoLink = (index: number) =>
    setNewVideoLinks((prev) => prev.filter((_, i) => i !== index))

  // ---- Existing asset removal ----
  const markForDeletion = (assetId: number) => {
    setAssetsToDelete((prev) => [...prev, assetId])
    setExistingAssets((prev) => prev.filter((a) => a.pr_assets_id !== assetId))
  }

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please check the form for errors", variant: "destructive" })
      setActiveTab("basic")
      return
    }

    const existingImgCount = existingAssets.filter((a) => a.asset_type === "img").length
    const existingVideoCount = existingAssets.filter((a) => a.asset_type === "video_link").length
    const existingDocCount = existingAssets.filter((a) => a.asset_type === "document").length
    const newVideoCount = newVideoLinks.filter((v) => v.trim() !== "").length
    const totalAssets =
      existingImgCount + existingVideoCount + existingDocCount +
      newImageFiles.length + newVideoCount + newDocFiles.length

    if (totalAssets === 0) {
      toast({ title: "Error", description: "At least one asset (image, video, or document) is required", variant: "destructive" })
      setActiveTab("assets")
      return
    }

    setIsSubmitting(true)

    // Step 1: Delete removed existing assets
    if (assetsToDelete.length > 0) {
      for (const assetId of assetsToDelete) {
        try {
          await api.delete(`/property-assets/${assetId}`)
        } catch (err: any) {
          console.error(`Failed to delete asset #${assetId}:`, err?.response?.data || err)
        }
      }
    }

    // Step 2: Build FormData
    const data = new FormData()
    data.append("property_title", formData.property_title.trim())
    data.append("pr_type_id", formData.pr_type_id)
    data.append("property_reason", formData.property_reason)
    data.append("price_guide", formData.price_guide)
    data.append("property_description", formData.property_description.trim())
    data.append("property_built_year", formData.property_built_year)

    let status = formData.propert_status
    if (status.toLowerCase() === "sold") status = "sold"
    else if (status.toLowerCase() === "leased") status = "Leased"
    else status = "Available"
    data.append("propert_status", status)
    data.append("is_active", formData.is_active ? "1" : "0")

    data.append("property_land_size", formData.property_land_size || "N/A")
    data.append("property_building_area", formData.property_building_area || "N/A")
    data.append("garage_availability", formData.garage_availability || "0")
    data.append("rooms_availability", formData.rooms_availability || "0")
    data.append("bedrooms_availability", formData.bedrooms_availability || "0")

    // Assets
    let assetIndex = 0

    newImageFiles.forEach((file) => {
      data.append(`assets[${assetIndex}][asset_type]`, "img")
      data.append(`assets[${assetIndex}][file]`, file)
      assetIndex++
    })

    newVideoLinks.filter((v) => v.trim() !== "").forEach((url) => {
      data.append(`assets[${assetIndex}][asset_type]`, "video_link")
      data.append(`assets[${assetIndex}][asset_value]`, url.trim())
      assetIndex++
    })

    newDocFiles.forEach((file) => {
      data.append(`assets[${assetIndex}][asset_type]`, "document")
      data.append(`assets[${assetIndex}][file]`, file)
      assetIndex++
    })

    try {
      await onSubmit(data)
      toast({ 
        title: "Success", 
        description: property ? "Property updated successfully" : "Property created successfully",
        variant: "default"
      })
      onOpenChange(false)
    } catch (err) {
      console.error("[PropertyForm] Submit error:", err)
      toast({ 
        title: "Error", 
        description: "Failed to save property. Please try again.", 
        variant: "destructive" 
      })
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const existingImgs = existingAssets.filter((a) => a.asset_type === "img")
  const existingVideos = existingAssets.filter((a) => a.asset_type === "video_link")
  const existingDocs = existingAssets.filter((a) => a.asset_type === "document")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Fixed width dialog with min-height to prevent resizing */}
      <DialogContent className="sm:max-w-[900px] w-[95vw] p-0 overflow-hidden" style={{ minHeight: "650px" }}>
        <div className="flex flex-col h-full" style={{ minHeight: "650px" }}>
          {/* Header */}
          <div className="border-b px-6 py-4 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {property ? "Edit Property" : "Add New Property"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Fill in the details below to {property ? "update your" : "create a new"} property listing
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 border-b flex-shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-muted/30 border border-border/50 rounded-xl h-12">
                <TabsTrigger 
                  value="basic" 
                  className="gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] dark:data-[state=active]:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic Info</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing" 
                  className="gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] dark:data-[state=active]:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Pricing</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="specs" 
                  className="gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] dark:data-[state=active]:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Specifications</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="assets" 
                  className="gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] dark:data-[state=active]:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Media</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content - Fixed height scrollable area */}
          <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: "calc(650px - 180px)", minHeight: "400px" }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* ---- BASIC TAB ---- */}
              <TabsContent value="basic" className="space-y-5 mt-0">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold">
                        Property Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.property_title}
                        onChange={(e) => {
                          setFormData({ ...formData, property_title: e.target.value })
                          if (validationErrors.property_title) {
                            setValidationErrors({ ...validationErrors, property_title: "" })
                          }
                        }}
                        placeholder="e.g., Luxury Seaview Apartment with Panoramic Views"
                        className={validationErrors.property_title ? "border-destructive" : ""}
                      />
                      {validationErrors.property_title && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {validationErrors.property_title}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                          Property Type <span className="text-destructive">*</span>
                        </Label>
                        <Select 
                          value={formData.pr_type_id} 
                          onValueChange={(v) => {
                            setFormData({ ...formData, pr_type_id: v })
                            if (validationErrors.pr_type_id) {
                              setValidationErrors({ ...validationErrors, pr_type_id: "" })
                            }
                          }}
                        >
                          <SelectTrigger className={validationErrors.pr_type_id ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
                            {propertyTypes.map((t) => (
                              <SelectItem key={t.pr_type_id} value={t.pr_type_id.toString()}>
                                {t.pr_type_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.pr_type_id && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {validationErrors.pr_type_id}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-semibold">
                          Listing Reason <span className="text-destructive">*</span>
                        </Label>
                        <Select 
                          value={formData.property_reason}
                          onValueChange={(v) => setFormData({ ...formData, property_reason: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
                            <SelectItem value="Sale">For Sale</SelectItem>
                            <SelectItem value="Rent">For Rent</SelectItem>
                            <SelectItem value="Lease">For Lease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desc" className="text-sm font-semibold">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <RichTextEditor
                        value={formData.property_description}
                        onChange={(val) => {
                          setFormData({ ...formData, property_description: val })
                          if (validationErrors.property_description) {
                            setValidationErrors({ ...validationErrors, property_description: "" })
                          }
                        }}
                        placeholder="Describe the property in detail - location, features, amenities, etc."
                        className={validationErrors.property_description ? "border-destructive" : ""}
                        minHeight="200px"
                      />
                      {validationErrors.property_description && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {validationErrors.property_description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          const doc = new DOMParser().parseFromString(formData.property_description, 'text/html')
                          return (doc.body.textContent || "").length
                        })()} characters (minimum 20)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- PRICING TAB ---- */}
              <TabsContent value="pricing" className="space-y-5 mt-0">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-semibold">
                          Price Guide <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="price" 
                            type="number" 
                            className={`pl-9 ${validationErrors.price_guide ? "border-destructive" : ""}`} 
                            value={formData.price_guide}
                            onChange={(e) => {
                              setFormData({ ...formData, price_guide: e.target.value })
                              if (validationErrors.price_guide) {
                                setValidationErrors({ ...validationErrors, price_guide: "" })
                              }
                            }}
                            placeholder="0"
                          />
                        </div>
                        {validationErrors.price_guide && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {validationErrors.price_guide}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="built" className="text-sm font-semibold">
                          Year Built <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="built" 
                            type="number" 
                            className="pl-9" 
                            value={formData.property_built_year}
                            onChange={(e) => setFormData({ ...formData, property_built_year: e.target.value })}
                            placeholder={new Date().getFullYear().toString()}
                            min="1900"
                            max={new Date().getFullYear()}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Status</Label>
                        <Select 
                          value={formData.propert_status} 
                          onValueChange={(v) => setFormData({ ...formData, propert_status: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
                            <SelectItem value="Available">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Available
                              </div>
                            </SelectItem>
                            <SelectItem value="sold">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Sold
                              </div>
                            </SelectItem>
                            <SelectItem value="Leased">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Leased
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="active" className="text-sm font-semibold">Active Listing</Label>
                          <p className="text-xs text-muted-foreground">Show this property on the website</p>
                        </div>
                        <Switch 
                          id="active" 
                          checked={formData.is_active}
                          onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                          <p>Price guide is shown as the listing price. For auctions, this is the estimated price range.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- SPECS TAB ---- */}
              <TabsContent value="specs" className="space-y-5 mt-0">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Maximize className="h-4 w-4" /> Land Size
                        </Label>
                        <div className="relative">
                          <Square className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9" 
                            value={formData.property_land_size}
                            onChange={(e) => setFormData({ ...formData, property_land_size: e.target.value })}
                            placeholder="e.g., 500 sqm / 0.5 acres"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Layout className="h-4 w-4" /> Building Area
                        </Label>
                        <div className="relative">
                          <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9" 
                            value={formData.property_building_area}
                            onChange={(e) => setFormData({ ...formData, property_building_area: e.target.value })}
                            placeholder="e.g., 300 sqm"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Home className="h-4 w-4" /> Rooms
                        </Label>
                        <Input 
                          type="number" 
                          min="0"
                          value={formData.rooms_availability}
                          onChange={(e) => setFormData({ ...formData, rooms_availability: e.target.value })}
                          className="text-center"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Bed className="h-4 w-4" /> Bedrooms
                        </Label>
                        <Input 
                          type="number" 
                          min="0"
                          value={formData.bedrooms_availability}
                          onChange={(e) => setFormData({ ...formData, bedrooms_availability: e.target.value })}
                          className="text-center"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Car className="h-4 w-4" /> Parking Spaces
                        </Label>
                        <Input 
                          type="number" 
                          min="0"
                          value={formData.garage_availability}
                          onChange={(e) => setFormData({ ...formData, garage_availability: e.target.value })}
                          className="text-center"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- ASSETS TAB ---- */}
              <TabsContent value="assets" className="space-y-6 mt-0">
                {assetsToDelete.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-xs text-destructive font-medium flex items-center gap-2">
                      <Trash2 className="h-3 w-3" />
                      {assetsToDelete.length} asset(s) will be permanently deleted when you save
                    </p>
                  </div>
                )}

                {/* Images Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                      <Upload className="h-4 w-4" /> Images
                      <Badge variant="secondary" className="text-xs">
                        {existingImgs.length + newImageFiles.length}
                      </Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground">Upload high-quality images</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImgs.map((asset) => (
                      <div key={`ei-${asset.pr_assets_id}`} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img 
                          src={asset.asset_value} 
                          className="object-cover w-full h-full" 
                          alt="Property"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => markForDeletion(asset.pr_assets_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2 text-[10px]" variant="secondary">
                          Saved
                        </Badge>
                      </div>
                    ))}
                    
                    {newImagePreviews.map((src, i) => (
                      <div key={`ni-${i}`} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-primary/40 bg-muted">
                        <img src={src} className="object-cover w-full h-full" alt="New" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2 text-[10px]" variant="default">
                          New
                        </Badge>
                      </div>
                    ))}
                    
                    <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all duration-200 gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center px-2">Upload Images</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  
                  {existingImgs.length === 0 && newImageFiles.length === 0 && (
                    <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground border rounded-lg bg-muted/20">
                      <ImageOff className="h-5 w-5 opacity-40" />
                      <span className="text-sm">No images added yet</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Video Links Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                      <Video className="h-4 w-4" /> Video Links
                      <Badge variant="secondary" className="text-xs">
                        {existingVideos.length + newVideoLinks.filter(v => v.trim()).length}
                      </Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground">YouTube, Vimeo, etc.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {existingVideos.map((asset) => (
                      <div key={`ev-${asset.pr_assets_id}`} className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg border group">
                        <Link className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate flex-1">{asset.asset_value}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => markForDeletion(asset.pr_assets_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {newVideoLinks.map((url, i) => (
                      <div key={`nv-${i}`} className="flex items-center gap-2">
                        <Input
                          value={url}
                          onChange={(e) => updateVideoLink(i, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="flex-1"
                        />
                        {newVideoLinks.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => removeVideoLink(i)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={addVideoLinkField}>
                      <Plus className="h-3 w-3" /> Add Another Video Link
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Documents Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4" /> Documents
                      <Badge variant="secondary" className="text-xs">
                        {existingDocs.length + newDocFiles.length}
                      </Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground">Floor plans, contracts, etc.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {existingDocs.map((asset) => (
                      <div key={`ed-${asset.pr_assets_id}`} className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg border group">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate flex-1">{asset.asset_value.split("/").pop()}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => markForDeletion(asset.pr_assets_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {newDocNames.map((name, i) => (
                      <div key={`nd-${i}`} className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-2 rounded-lg">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate flex-1">{name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => removeNewDoc(i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    <label className="flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-all duration-200">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Documents (PDF, DOC, DOCX, TXT)</span>
                      <input type="file" multiple accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleDocUpload} />
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-muted/20 flex-shrink-0">
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="min-w-[140px] gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {property ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {property ? "Update Property" : "Save Property"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}