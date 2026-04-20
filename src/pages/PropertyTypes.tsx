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
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash, Loader2, Home } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"

export function PropertyTypes() {
  const [types, setTypes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedType, setSelectedType] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [typeName, setTypeName] = useState("")
  const { toast } = useToast()

  const fetchTypes = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/property-types')
      if (response.data.success) {
        setTypes(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching property types:", error)
      toast({
        title: "Error",
        description: "Failed to fetch property types",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const handleOpenDialog = (type?: any) => {
    if (type) {
      setSelectedType(type)
      setTypeName(type.pr_type_name)
    } else {
      setSelectedType(null)
      setTypeName("")
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!typeName.trim()) return

    try {
      setIsSubmitting(true)
      const payload = { pr_type_name: typeName }

      if (selectedType) {
        await api.put(`/property-types/${selectedType.pr_type_id}`, payload)
        toast({
          title: "Success",
          description: "Property type updated successfully",
        })
      } else {
        await api.post('/property-types', payload)
        toast({
          title: "Success",
          description: "Property type created successfully",
        })
      }
      setIsDialogOpen(false)
      fetchTypes()
    } catch (error) {
      console.error("Error saving property type:", error)
      toast({
        title: "Error",
        description: "Failed to save property type",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRequest = (type: any) => {
    setSelectedType(type)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedType) return

    try {
      setIsSubmitting(true)
      await api.delete(`/property-types/${selectedType.pr_type_id}`)
      toast({
        title: "Success",
        description: "Property type deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      setSelectedType(null)
      fetchTypes()
    } catch (error) {
      console.error("Error deleting property type:", error)
      toast({
        title: "Error",
        description: "Failed to delete property type. It might be in use.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Types</h1>
          <p className="text-muted-foreground">Manage categories for your properties (e.g., Apartment, House, Villa)</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Property Types</CardTitle>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Type Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No property types found
                    </TableCell>
                  </TableRow>
                ) : (
                  types.map((type) => (
                    <TableRow key={type.pr_type_id}>
                      <TableCell className="font-medium">{type.pr_type_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          {type.pr_type_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(type)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteRequest(type)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedType ? "Edit Property Type" : "Add Property Type"}</DialogTitle>
            <DialogDescription>
              Enter the name for the property category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Type Name</Label>
              <Input
                id="typeName"
                placeholder="e.g. Apartment"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !typeName.trim()}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedType ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Confirm Deletion"
        description={
          <>
            Are you sure you want to delete <span className="font-bold text-foreground">"{selectedType?.pr_type_name}"</span>? 
            <br /><br />
            This category and all its associations will be permanently removed.
          </>
        }
      />
    </div>
  )
}