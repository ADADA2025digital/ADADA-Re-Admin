import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { useToast } from "@/hooks/use-toast"
import { Trash, Loader2, Mail, User, MessageSquare, Clock, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function Contacts() {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/contact-us')
      if (response.data.success) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async () => {
    if (idToDelete === null) return

    try {
      await api.delete(`/contact-us/${idToDelete}`)
      toast({
        title: "Success",
        description: "Message deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      setIdToDelete(null)
      fetchMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to remove inquiry",
        variant: "destructive"
      })
    }
  }

  const filteredMessages = messages.filter(m => 
    m.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.contact_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.contact_message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">Manage messages from the contact us form</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
          {messages.length} Total Messages
        </Badge>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search inquiries..." 
            className="pl-9 bg-background/50 h-10 border-primary/10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" onClick={() => setSearchTerm("")} className="h-10 px-3 text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4 mr-1"/> Reset
          </Button>
        )}
      </div>

      <Card className="border-primary/10 shadow-xl rounded-2xl overflow-hidden bg-background/50 backdrop-blur-md">
        <CardHeader className="bg-muted/30 border-b border-primary/5">
          <CardTitle>Inquiry Inbox</CardTitle>
          <CardDescription>Messages sent via the website contact form.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="w-[200px]">Sender</TableHead>
                  <TableHead className="w-[250px]">Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="text-right w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((msg) => (
                    <TableRow key={msg.contact_id} className="hover:bg-primary/5 transition-colors border-primary/5 group">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-sm">
                            <User className="h-3 w-3 text-primary/70" /> {msg.contact_name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Mail className="h-3 w-3" /> {msg.contact_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium text-sm">
                           <MessageSquare className="h-3 w-3 text-primary/70 shrink-0" />
                           <span className="truncate">{msg.contact_subject}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {msg.contact_message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(msg.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            setIdToDelete(msg.contact_id)
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

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Inquiry?"
        description="This message will be permanently removed from the vault."
      />
    </div>
  )
}
