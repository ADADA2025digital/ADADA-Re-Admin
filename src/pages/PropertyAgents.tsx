import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Trash, Loader2, Building, Mail, Search, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export function PropertyAgents() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState("")
  const [userId, setUserId] = useState("")
  const [availableAgents, setAvailableAgents] = useState<any[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("all")

  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [agentsRes, propsRes, availRes] = await Promise.all([
        api.get('/property-agents'),
        api.get('/properties'),
        api.get('/property-agents/available-agents')
      ])

      if (agentsRes.data.success) {
        setAssignments(agentsRes.data.data)
      }

      if (propsRes.data.success) {
        setProperties(propsRes.data.data)
      }

      if (availRes.data.success) {
        setAvailableAgents(availRes.data.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agents or properties",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!selectedPropertyId || !userId) return

    try {
      setIsSubmitting(true)
      await api.post('/property-agents', {
        pr_id: selectedPropertyId,
        user_id: userId
      })
      toast({
        title: "Success",
        description: "Agent assigned to property successfully",
      })
      setIsDialogOpen(false)
      fetchData()
    } catch (error: any) {
      console.error("Error assigning agent:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign agent",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (idToDelete === null) return

    try {
      await api.delete(`/property-agents/${idToDelete}`)
      toast({
        title: "Success",
        description: "Assignment removed successfully",
      })
      setIsDeleteDialogOpen(false)
      setIdToDelete(null)
      fetchData()
    } catch (error) {
      console.error("Error deleting assignment:", error)
      toast({
        title: "Error",
        description: "Failed to remove assignment",
        variant: "destructive"
      })
    }
  }

  // Filtered list
  const filteredAssignments = assignments.filter(a => {
    const fullName = `${a.user?.details?.user_firstname} ${a.user?.details?.user_lastname}`.toLowerCase()
    const email = (a.user?.user_email || "").toLowerCase()
    const search = searchTerm.toLowerCase()

    const matchesSearch = fullName.includes(search) || email.includes(search);
    const matchesProperty = propertyFilter === "all" || a.pr_id.toString() === propertyFilter;

    return matchesSearch && matchesProperty;
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Agents</h1>
          <p className="text-muted-foreground">Manage agent assignments for your real estate listings</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="rounded-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Agent
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl border bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Search Agent</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email..."
              className="pl-8 bg-background/50 h-10 border-primary/10 focus-visible:ring-primary/20 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[200px] space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Filter by Property</Label>
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="h-10 text-sm bg-background/50 border-primary/10 rounded-lg">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10">
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(p => (
                <SelectItem key={p.pr_id} value={p.pr_id.toString()}>
                  {p.property_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchTerm || propertyFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearchTerm(""); setPropertyFilter("all"); }}
            className="h-10 px-3 text-xs text-muted-foreground hover:text-destructive rounded-lg"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>

      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      {assignments.length === 0 ? "No agent assignments found" : "No assignments match your filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.prop_agent_id} className="hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border shadow-sm">
                            {assignment.user?.profile?.user_pic ? (
                              <img
                                src={assignment.user.profile.user_pic.startsWith('http') ? assignment.user.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${assignment.user.profile.user_pic}`}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                {getInitials(`${assignment.user?.details?.user_firstname} ${assignment.user?.details?.user_lastname}`)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {assignment.user?.details?.user_firstname} {assignment.user?.details?.user_lastname}
                            </p>
                            <div className="flex items-center text-[10px] text-muted-foreground truncate">
                              <Mail className="h-2.5 w-2.5 mr-1 shrink-0" />
                              {assignment.user?.user_email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-sm truncate">{assignment.property?.property_title || `Prop ID: ${assignment.pr_id}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(assignment.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg h-8 w-8"
                          onClick={() => {
                            setIdToDelete(assignment.prop_agent_id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="backdrop-blur-md bg-background/80 max-w-md border-primary/20">
          <DialogHeader>
            <DialogTitle>Assign Agent to Property</DialogTitle>
            <DialogDescription>
              Connect a staff member to a property listing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-tight text-muted-foreground">Select Property</Label>
              <Select onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="h-12 rounded-lg border-primary/10 shadow-sm bg-background/50">
                  <SelectValue placeholder="Select a listing..." />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
                  {properties.map(p => {
                    const mainImg = p.assets?.find((a: any) => a.asset_type === 'img')?.asset_value;
                    return (
                      <SelectItem key={p.pr_id} value={p.pr_id.toString()}>
                        <div className="flex items-center gap-3 py-1">
                          {mainImg ? (
                            <img src={mainImg} className="h-8 w-10 object-cover rounded border shadow-sm shrink-0" alt="" />
                          ) : (
                            <div className="h-8 w-10 bg-muted rounded border flex items-center justify-center shrink-0">
                              <Building className="h-4 w-4 opacity-30" />
                            </div>
                          )}
                          <span className="font-medium truncate text-sm">{p.property_title}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-tight text-muted-foreground">Select Agent</Label>
              <Select onValueChange={setUserId}>
                <SelectTrigger className="h-12 rounded-lg border-primary/10 shadow-sm bg-background/50">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-background/95 border-primary/10 font-outfit">
                  {availableAgents.map(user => {
                    const profilePic = user.profile?.user_pic
                      ? (user.profile.user_pic.startsWith('http') ? user.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${user.profile.user_pic}`)
                      : null;
                    const fullName = user.details ? `${user.details.user_firstname} ${user.details.user_lastname}` : user.user_email;

                    return (
                      <SelectItem key={user.user_id} value={user.user_id.toString()}>
                        <div className="flex items-center gap-3 py-1">
                          <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                            {profilePic ? (
                              <img src={profilePic} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                                {getInitials(fullName)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">{fullName}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{user.user_email}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg h-11">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedPropertyId || !userId}
              className="rounded-lg h-11 bg-primary px-8"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="backdrop-blur-md bg-background/80 border-primary/10 max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Revoke Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the link between this agent and the property. They will no longer be listed as a contact for this listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg h-11"
            >
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
