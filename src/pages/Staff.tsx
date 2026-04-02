import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Search,
  Download,
  Edit,
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  UserPlus,
  UserMinus,
  UserCheck,
  MoreHorizontal,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPinIcon,
  ShieldCheck,
  Globe,
  RefreshCw,
  X
} from "lucide-react"
import { getInitials } from "@/lib/utils"


export function Staff() {
  const [staffMembers, setStaffMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      if (response.data.success) {
        setAvailableRoles(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error)
    }
  }

  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/users')
      if (response.data.success) {
        setStaffMembers(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error)
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (user: any) => {
    const isActivating = user.user_status?.toLowerCase() === 'inactive'
    const endpoint = `/users/${user.user_id}/${isActivating ? 'activate' : 'deactivate'}`

    try {
      const response = await api.post(endpoint)
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        })
        fetchStaff() // Refresh list
        if (selectedStaff?.user_id === user.user_id) {
          setSelectedStaff({ ...selectedStaff, user_status: isActivating ? 'active' : 'inactive' })
        }
      }
    } catch (error) {
      console.error("Failed to toggle status:", error)
      toast({
        title: "Error",
        description: `Failed to ${isActivating ? 'activate' : 'deactivate'} user`,
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchStaff()
    fetchRoles()
  }, [])

  const handleAddStaff = async () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email) {
      toast({
        title: "Required Fields Missing",
        description: "First name, last name and email are required.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post('/auth/register', {
        full_name: `${newStaff.firstName} ${newStaff.lastName}`,
        email: newStaff.email,
        phone_number: newStaff.phone,
        role_id: newStaff.roleId ? parseInt(newStaff.roleId) : null
      })

      if (response.data.success) {
        toast({
          title: "Registration Successful",
          description: "Staff member added. An email invitation has been sent.",
        })
        setIsAddDialogOpen(false)
        fetchStaff() // Refresh the list

        // Reset form
        setNewStaff({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          roleId: ''
        })
      }
    } catch (error: any) {
      console.error("Add staff error:", error)
      const errorMessage = error.response?.data?.message || "Failed to add staff member. Please try again."
      toast({
        title: "Add Staff Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredStaff = staffMembers.filter(staff => {
    // Get full name
    const fullName = staff.details
      ? `${staff.details.user_firstname} ${staff.details.user_lastname}`.toLowerCase()
      : ""

    const email = staff.user_email?.toLowerCase() || ""

    // Get role names as string for search
    const roleNames = staff.roles?.map((r: any) => r.role_name.toLowerCase()).join(" ") || ""

    // Search filter
    const matchesSearch = searchTerm === "" ||
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      roleNames.includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" ||
      (staff.user_status && staff.user_status.toLowerCase() === statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-green-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <UserCheck className="h-3 w-3 mr-1" />
      case 'inactive': return <UserMinus className="h-3 w-3 mr-1" />
      default: return <UserCheck className="h-3 w-3 mr-1" />
    }
  }

  const activeCount = staffMembers.filter(s => s.user_status === 'active').length
  const inactiveCount = staffMembers.filter(s => s.user_status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">
            Manage your team members, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button> */}
          <Button variant="outline" size="icon" onClick={() => {
            setSearchTerm("")
            setStatusFilter("all")
            fetchStaff()
          }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staffMembers.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <UserMinus className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-background/95 border-primary/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Show active filters count */}
            {(searchTerm || statusFilter !== "all") && (
              <div className="text-sm text-muted-foreground">
                {filteredStaff.length} result{filteredStaff.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading staff data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No staff members found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : filteredStaff.map((staff) => {
                const fullName = staff.details ? `${staff.details.user_firstname} ${staff.details.user_lastname}` : (staff.user_email || "Staff Member")

                const profilePic = staff.profile?.user_pic
                  ? (staff.profile.user_pic.startsWith('http') ? staff.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${staff.profile.user_pic}`)
                  : null;

                return (
                  <TableRow key={staff.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {profilePic ? (
                            <img src={profilePic} className="w-full h-full object-cover" alt={fullName} />
                          ) : (
                            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{fullName}</p>
                          <p className="text-xs text-muted-foreground">{staff.user_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {staff.roles && staff.roles.length > 0 ? (
                          staff.roles.map((r: any) => (
                            <Badge key={r.role_id} variant="outline" className="text-[10px] bg-primary/5 border-primary/20">
                              {r.role_name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No Role</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(staff.user_status)}>
                        <span className="flex items-center">
                          {getStatusIcon(staff.user_status)}
                          {staff.user_status || 'Active'}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {staff.user_email}
                        </div>
                        {staff.details?.user_phone_number && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            {staff.details.user_phone_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{staff.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="backdrop-blur-md bg-background/95 border-primary/10"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedStaff(staff)
                            setIsViewDialogOpen(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-primary/10" />

                          {staff.user_status?.toLowerCase() === 'inactive' ? (
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600 focus:bg-green-50/50"
                              onClick={() => handleToggleStatus(staff)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50/50"
                              onClick={() => handleToggleStatus(staff)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Deactivate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] backdrop-blur-md bg-background/95 border-primary/10">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new team member
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@ecomart.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (Optional)</Label>
              <Select
                value={newStaff.roleId}
                onValueChange={(value) => setNewStaff({ ...newStaff, roleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/95 border-primary/10">
                  {availableRoles.length > 0 ? (
                    availableRoles.map(role => (
                      <SelectItem key={role.role_id} value={role.role_id.toString()}>{role.role_name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No roles available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStaff}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Staff Member
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0 backdrop-blur-md bg-background/95 border-primary/10">
          {/* Header Section with Cover */}
          <div className="relative">
            {/* Cover Image Placeholder */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

            {/* Profile Header */}
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  {selectedStaff?.profile?.user_pic ? (
                    <img
                      src={selectedStaff?.profile?.user_pic.startsWith('http')
                        ? selectedStaff?.profile?.user_pic
                        : `https://urbanviewre.com/adada-re-backend/api/storage/${selectedStaff?.profile?.user_pic}`
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <AvatarFallback className="text-3xl bg-primary/10">
                      {getInitials(selectedStaff?.details
                        ? `${selectedStaff.details.user_firstname} ${selectedStaff.details.user_lastname}`
                        : (selectedStaff?.user_email || "User")
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 pt-4 md:pt-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedStaff?.details
                          ? `${selectedStaff.details.user_firstname} ${selectedStaff.details.user_lastname}`
                          : (selectedStaff?.user_email || "User Profile")
                        }
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        {selectedStaff?.user_email}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff?.roles?.map((r: any) => (
                        <Badge key={r.role_id} variant="secondary" className="gap-1 backdrop-blur-sm">
                          <ShieldCheck className="h-3 w-3" />
                          {r.role_name}
                        </Badge>
                      ))}
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(selectedStaff?.user_status)} text-white border-0`}
                      >
                        {getStatusIcon(selectedStaff?.user_status)}
                        {selectedStaff?.user_status || 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="px-6 py-4 space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{selectedStaff?.user_email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">
                        {selectedStaff?.details?.user_phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm font-medium">
                        {selectedStaff?.created_at
                          ? new Date(selectedStaff?.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        First Name
                      </p>
                      <p className="text-sm font-medium">
                        {selectedStaff?.details?.user_firstname || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Last Name
                      </p>
                      <p className="text-sm font-medium">
                        {selectedStaff?.details?.user_lastname || "—"}
                      </p>
                    </div>
                  </div>

                  {selectedStaff?.details?.bio && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Bio
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStaff.details.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <Badge className={getStatusColor(selectedStaff?.user_status)}>
                      {getStatusIcon(selectedStaff?.user_status)}
                      {selectedStaff?.user_status || 'Active'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <MapPinIcon className="h-4 w-4 text-primary" />
                    </div>
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStaff?.addresses && selectedStaff.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {selectedStaff.addresses.map((addr: any, index: number) => (
                        <div
                          key={addr.id || `addr-${index}`}
                          className="border-l-2 border-primary/30 pl-3 py-1"
                        >
                          {addr.address_type && (
                            <p className="text-xs font-semibold text-primary mb-1">
                              {addr.address_type}
                            </p>
                          )}
                          <p className="text-sm">{addr.address_line1}</p>
                          {addr.address_line2 && (
                            <p className="text-sm">{addr.address_line2}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {[addr.person_city, addr.person_state, addr.postal_code]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {addr.person_country && (
                            <p className="text-sm text-muted-foreground">{addr.person_country}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPinIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No addresses provided</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Social Media Section */}
            <Card className="backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-md">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  Connect & Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStaff?.social_links && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedStaff.social_links.fb_link && (
                      <a
                        href={selectedStaff.social_links.fb_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                          <Facebook className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}

                    {selectedStaff.social_links.x_link && (
                      <a
                        href={selectedStaff.social_links.x_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="p-2 bg-sky-400/10 rounded-lg group-hover:bg-sky-400/20 transition-colors">
                          <Twitter className="h-4 w-4 text-sky-400" />
                        </div>
                        <span className="text-sm font-medium">X (Twitter)</span>
                      </a>
                    )}

                    {selectedStaff.social_links.inst_link && (
                      <a
                        href={selectedStaff.social_links.inst_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="p-2 bg-pink-600/10 rounded-lg group-hover:bg-pink-600/20 transition-colors">
                          <Instagram className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}

                    {selectedStaff.social_links.linkedin_link && (
                      <a
                        href={selectedStaff.social_links.linkedin_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="p-2 bg-blue-700/10 rounded-lg group-hover:bg-blue-700/20 transition-colors">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                        </div>
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    )}
                  </div>
                )}

                {(!selectedStaff?.social_links ||
                  (!selectedStaff.social_links.fb_link &&
                    !selectedStaff.social_links.x_link &&
                    !selectedStaff.social_links.inst_link &&
                    !selectedStaff.social_links.linkedin_link)) && (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No social media links connected</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-muted/20 backdrop-blur-sm">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="gap-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}