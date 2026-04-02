import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyFiltersProps {
  onFilterChange: (filters: any) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")
  const [advertiseOn, setAdvertiseOn] = useState("")
  
  const [propertyTypes, setPropertyTypes] = useState<any[]>([])
  
  // Fetch property types for the dropdown
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/property-types');
        if (response.data.success) {
          setPropertyTypes(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch property types", err)
      }
    }
    fetchTypes()
  }, [])

  // Whenever a filter changes, trigger the callback
  useEffect(() => {
    onFilterChange({
      search,
      minPrice,
      maxPrice,
      type,
      status,
      advertiseOn
    })
  }, [search, minPrice, maxPrice, type, status, advertiseOn])

  const clearFilters = () => {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setType("all")
    setStatus("all")
    setAdvertiseOn("")
  }

  const activeFilterCount = [search, minPrice, maxPrice, type !== 'all' ? type : '', status !== 'all' ? status : '', advertiseOn].filter(Boolean).length

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl border bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:bg-card/80">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-8 bg-background/50 h-10 border-primary/10 focus-visible:ring-primary/20 transition-all rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Price Range */}
      <div className="w-[180px] space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Price Range</Label>
        <div className="flex items-center gap-1">
          <Input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-10 text-xs bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-lg"
          />
          <Input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-10 text-xs bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-lg"
          />
        </div>
      </div>

      {/* Property Category */}
      <div className="w-[160px] space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Category</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-10 text-sm bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
            <SelectItem value="all">All Categories</SelectItem>
            {propertyTypes.map(t => (
              <SelectItem key={t.pr_type_id} value={t.pr_type_id.toString()}>
                {t.pr_type_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Status */}
      <div className="w-[140px] space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 text-sm bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-lg">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="leased">Leased</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advertise Date */}
      <div className="w-[160px] space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Advertise Date</Label>
        <Input 
          type="date"
          value={advertiseOn}
          onChange={(e) => setAdvertiseOn(e.target.value)}
          className="h-10 text-sm bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-lg"
        />
      </div>

      {/* Clear Button */}
      {activeFilterCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters} 
          className="h-10 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-lg font-medium"
        >
          Reset
        </Button>
      )}
    </div>
  )
}
