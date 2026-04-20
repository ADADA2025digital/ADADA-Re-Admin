import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  PlusCircle,
  Edit,
  Trash,
  Eye,
  Search,
  Download,
  Users,
  Key,
  UserCog,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X } from "lucide-react"

// Roles state is now managed inside the component

// Roles state is now managed inside the component

export function Roles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewMembersOpen, setIsViewMembersOpen] = useState(false)
  const [isAssignPersonOpen, setIsAssignPersonOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [roles, setRoles] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [memberToRemove, setMemberToRemove] = useState<any>(null)
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false)

  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const { toast } = useToast()

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"
  }

  const handleCreateRole = async () => {
    if (!newRoleName) return
    try {
      await api.post('/roles', {
        role_name: newRoleName,
        description: newRoleDesc
      })
      toast({
        title: "Success",
        description: "Role created successfully",
      })
      setIsCreateDialogOpen(false)
      fetchRoles()
      setNewRoleName("")
      setNewRoleDesc("")
    } catch (error: any) {
      console.error("Failed to create role", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create role",
        variant: "destructive"
      })
    }
  }

  const handleDeleteRole = async () => {
    if (!selectedRole) return
    try {
      await api.delete(`/roles/${selectedRole.id}`)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
      fetchRoles()
    } catch (error: any) {
      console.error("Failed to delete role", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete role",
        variant: "destructive"
      })
    }
  }

  const fetchMembers = async (roleId: number) => {
    try {
      const response = await api.get(`/roles/${roleId}/members`)
      if (response.data.success) {
        setMembers(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch members", error)
    }
  }

  const fetchAvailableUsers = async () => {
    try {
      const response = await api.get('/roles/available-users')
      if (response.data.success) {
        setAvailableUsers(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch available users", error)
    }
  }

  const handleAssignRole = async () => {
    if (!selectedRole || !selectedUserId) return
    try {
      await api.post('/roles/assign', {
        user_id: selectedUserId,
        role_id: selectedRole.id
      })
      toast({
        title: "Success",
        description: "Role assigned successfully",
      })
      setIsAssignPersonOpen(false)
      setSelectedUserId("")
      fetchRoles()
    } catch (error: any) {
      console.error("Failed to assign role", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign role",
        variant: "destructive"
      })
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      if (response.data.success && response.data.data) {
        // Map backend role structure to frontend structure
        const mappedRoles = response.data.data.map((r: any) => ({
          id: r.role_id,
          name: r.role_name,
          description: r.description || "Role description",
          users: r.users_count || 0,
          createdAt: r.created_at || new Date().toISOString(),
          status: "active"
        }))
        setRoles(mappedRoles)
        console.log("Roles API connected correctly");
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUsers = roles.reduce((sum, role) => sum + (role.users || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and staff assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Roles</p>
                <p className="text-2xl font-bold text-green-600">{roles.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="backdrop-blur-md bg-background/80 border-primary/10">
                    <DropdownMenuItem onClick={() => {
                      setSelectedRole(role)
                      setIsEditDialogOpen(true)
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedRole(role)
                      fetchMembers(role.id)
                      setIsViewMembersOpen(true)
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedRole(role)
                      fetchAvailableUsers()
                      setIsAssignPersonOpen(true)
                    }}>
                      <UserCog className="mr-2 h-4 w-4" />
                      Assign Person
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => {
                      setSelectedRole(role)
                      setIsDeleteDialogOpen(true)
                    }}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{role.users} users assigned</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto backdrop-blur-md bg-background/80 border-primary/20">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Modify name and description for this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" defaultValue={selectedRole?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Input id="roleDescription" defaultValue={selectedRole?.description} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] backdrop-blur-md bg-background/80 border-primary/20">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a new role for your staff members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newRoleName">Role Name</Label>
              <Input id="newRoleName" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g., Content Manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newRoleDescription">Description</Label>
              <Input id="newRoleDescription" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} placeholder="Brief description of this role" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Members Dialog */}
      <Dialog open={isViewMembersOpen} onOpenChange={setIsViewMembersOpen}>
        <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-background/80 border-primary/20">
          <DialogHeader>
            <DialogTitle>Members: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              List of users assigned to this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto pr-2">
            {members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground italic">
                No members found for this role.
              </div>
            ) : (
              members.map((user) => {
                const profilePic = user.profile?.user_pic
                  ? (user.profile.user_pic.startsWith('http') ? user.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${user.profile.user_pic}`)
                  : null;
                const fullName = user.details ? `${user.details.user_firstname} ${user.details.user_lastname}` : user.user_email;
                return (
                  <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        {profilePic ? (
                          <img src={profilePic} className="w-full h-full object-cover" alt={fullName} />
                        ) : (
                          <AvatarFallback className="bg-primary/5 text-primary">
                            {getInitials(fullName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{fullName}</span>
                        <span className="text-xs text-muted-foreground">{user.user_email}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMemberToRemove(user)
                        setIsRemoveMemberOpen(true)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewMembersOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Person Dialog */}
      <Dialog open={isAssignPersonOpen} onOpenChange={setIsAssignPersonOpen}>
        <DialogContent className="sm:max-w-[450px] backdrop-blur-md bg-background/80 border-primary/20">
          <DialogHeader>
            <DialogTitle>Assign Person to {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Select a user to grant them this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select onValueChange={setSelectedUserId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Search users..." />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 max-h-[300px]">
                  {availableUsers
                    .filter(u => !u.roles?.some((r: any) => r.role_id === selectedRole?.id))
                    .map(user => {
                      const profilePic = user.profile?.user_pic
                        ? (user.profile.user_pic.startsWith('http') ? user.profile.user_pic : `https://urbanviewre.com/adada-re-backend/api/storage/${user.profile.user_pic}`)
                        : null;
                      const fullName = user.details ? `${user.details.user_firstname} ${user.details.user_lastname}` : user.user_email;

                      return (
                        <SelectItem key={user.user_id} value={user.user_id.toString()}>
                          <div className="flex items-center gap-3 py-1">
                            <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                              {profilePic ? (
                                <img src={profilePic} className="w-full h-full object-cover" alt={fullName} />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignPersonOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignRole} disabled={!selectedUserId}>Assign Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <DeleteConfirmDialog
        isOpen={isRemoveMemberOpen}
        onClose={() => setIsRemoveMemberOpen(false)}
        onConfirm={async () => {
          try {
            const response = await api.delete('/roles/remove', {
              data: { user_id: memberToRemove.user_id, role_id: selectedRole.id }
            });
            if (response.data.success) {
              toast({ title: "Member removed from role" });
              setIsRemoveMemberOpen(false)
              setMemberToRemove(null)
              fetchMembers(selectedRole.id);
              fetchRoles();
            }
          } catch (err) {
            console.error("Failed to remove member", err);
            toast({
              title: "Failed to remove member",
              variant: "destructive"
            });
          }
        }}
        title="Revoke Access?"
        confirmText="Confirm Removal"
        description={
          <>
            Are you sure you want to remove <strong>{memberToRemove?.details ? `${memberToRemove.details.user_firstname} ${memberToRemove.details.user_lastname}` : memberToRemove?.user_email}</strong> from the <strong>{selectedRole?.name}</strong> role?
          </>
        }
      />

      {/* Remove Member Confirmation */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        confirmText="Delete Role"
        description={
          <>
            This will permanently delete the <strong>{selectedRole?.name}</strong> role and remove it from all assigned users. This action cannot be undone.
          </>
        }
      />
    </div>
  )
}
