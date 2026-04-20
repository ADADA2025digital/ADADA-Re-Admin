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
import type { AgentMessage } from "@/lib/data"
// Removed AlertDialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCheck, Loader2, Mail, User, MessageSquare, Clock, Search, X, Phone, Home, Eye, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Helper to format asset URLs
function getAssetUrl(url: string | undefined) {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  // Ensure we use the correct storage path for relative URLs
  const cleanPath = url.replace(/^\//, '');
  if (cleanPath.startsWith('storage/')) {
    return `https://urbanviewre.com/adada-re-backend/api/${cleanPath}`;
  }
  if (cleanPath.startsWith('adada-re-backend/api/storage/')) {
    return `https://urbanviewre.com/${cleanPath}`;
  }
  return `https://urbanviewre.com/adada-re-backend/api/storage/${cleanPath}`;
}

export function AgentMessages() {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReadDialogOpen, setIsReadDialogOpen] = useState(false)
  const [idToMark, setIdToMark] = useState<number | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<AgentMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/agent-messages')
      if (response.data.success) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching agent messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch agent messages",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const intervalId = setInterval(() => {
      api.get('/agent-messages').then(response => {
        if (response.data.success) {
          setMessages(response.data.data)
        }
      }).catch(e => console.error(e))
    }, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const handleMarkAsRead = async () => {
    if (idToMark === null) return

    try {
      await api.patch(`/agent-messages/${idToMark}/read`)
      toast({
        title: "Success",
        description: "Message marked as read",
      })
      setIsReadDialogOpen(false)
      setIdToMark(null)
      fetchMessages()
    } catch (error) {
      console.error("Error marking message as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive"
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchMessages()
    setIsRefreshing(false)
    toast({ title: "Messages updated", description: "Latest messages loaded successfully" })
  }

  const filteredMessages = messages.filter(m => 
    m.guest_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.guest_query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.property?.property_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalItems = filteredMessages.length
  const actualItemsPerPage = itemsPerPage === "all" ? totalItems : itemsPerPage
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / (actualItemsPerPage || 1))
  const indexOfLastItem = currentPage * (actualItemsPerPage || totalItems)
  const indexOfFirstItem = indexOfLastItem - (actualItemsPerPage || totalItems)
  const currentItems = itemsPerPage === "all" ? filteredMessages : filteredMessages.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Messages</h1>
          <p className="text-muted-foreground">Manage messages sent by guests for your properties</p>
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
          <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
            {messages.length} Total Messages
          </Badge>
        </div>
      </div>

      {/* Stats Cards - Matching Properties.tsx style */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Total Messages</p>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">New Messages</p>
              <Mail className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.is_read === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Read Messages</p>
              <CheckCheck className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.is_read === 1).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">Properties</p>
              <Home className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">
              {new Set(messages.map(m => m.pr_id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Matching Properties.tsx style */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-background/50 h-10 border-primary/10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" onClick={() => setSearchTerm("")} className="h-10 px-3 text-muted-foreground hover:text-destructive shrink-0">
            <X className="h-4 w-4 mr-1"/> Reset
          </Button>
        )}
      </div>

      {/* Main Table Card - Matching Properties.tsx table styling */}
      <Card className="border-primary/10 shadow-xl overflow-hidden bg-background/50 backdrop-blur-md">
        <CardHeader className="bg-muted/30 border-b border-primary/5">
          <CardTitle>Message Inbox</CardTitle>
          <CardDescription>Messages from guests regarding your properties.</CardDescription>
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
                  <TableHead className="w-[200px]">Guest Details</TableHead>
                  <TableHead className="w-[250px]">Property</TableHead>
                  <TableHead className="w-[300px]">Query</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="text-right w-[100px]">Action</TableHead>
                  <TableHead className="text-right w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((msg) => (
                    <TableRow key={msg.c_m__id} className={`transition-colors border-primary/5 group ${msg.is_read === 1 ? 'opacity-70 bg-muted/20' : 'bg-primary/5 hover:bg-primary/10 font-medium'}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3 text-primary/70 shrink-0" /> 
                            <span className="truncate">{msg.guest_full_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" /> 
                            <span className="truncate">{msg.guest_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" /> 
                            <span className="truncate">{msg.guest_ph_number}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {msg.property ? (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-md">
                              {msg.property.assets?.find((a: any) => a.asset_type === 'img') ? (
                                <AvatarImage src={getAssetUrl(msg.property.assets.find((a: any) => a.asset_type === 'img').asset_value)} alt={msg.property.property_title} className="object-cover" />
                              ) : (
                                <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                  <Home className="h-5 w-5" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm line-clamp-1">{msg.property.property_title}</p>
                              <Badge variant="secondary" className="text-[10px] mt-1">PR-ID: {msg.pr_id}</Badge>
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary">PR-ID: {msg.pr_id}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 text-primary/70 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground line-clamp-2 max-w-[280px] leading-relaxed">
                            {msg.guest_query}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {msg.send_date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            onClick={() => {
                              setSelectedMessage(msg)
                              setViewDialogOpen(true)
                            }}
                            title="View Message"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {msg.is_read === 0 ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                              onClick={() => {
                                setIdToMark(msg.c_m__id)
                                setIsReadDialogOpen(true)
                              }}
                              title="Mark as Read"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="w-9 h-9" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={msg.is_read === 1 ? "outline" : "default"} className={msg.is_read === 0 ? "animate-pulse bg-primary" : ""}>
                          {msg.is_read === 1 ? "Read" : "New"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        
        {/* Pagination - Matching Properties.tsx style */}
        {filteredMessages.length > 0 && (
          <div className="flex items-center justify-between py-4 px-4 border-t border-primary/5 bg-muted/10">
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
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNumber = i + 1
                  if (totalPages > 5 && currentPage > 3) {
                    pageNumber = currentPage - 2 + i
                    if (pageNumber > totalPages) return null
                  }
                  if (pageNumber > totalPages) return null
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <Dialog open={isReadDialogOpen} onOpenChange={setIsReadDialogOpen}>
        <DialogContent className="bg-background border border-border rounded-xl shadow-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Read?</DialogTitle>
            <DialogDescription>
              This will mark the selected message as read and remove its standard highlight.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsReadDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={handleMarkAsRead}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              Mark Read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {selectedMessage && (
          <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[85vh] p-0 overflow-hidden backdrop-blur-md border-primary/20 shadow-2xl">
            <DialogHeader className="px-6 py-4 border-b bg-muted/30">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <MessageSquare className="h-5 w-5 text-primary" />
                Guest Query
              </DialogTitle>
              <DialogDescription>
                Details of the inquiry from {selectedMessage.guest_full_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[min(80vh,750px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
              <div className="space-y-6">
                {selectedMessage.property && (
                  <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10 shadow-sm">
                    <Avatar className="h-16 w-16 rounded-lg pointer-events-none">
                      {selectedMessage.property.assets?.find((a: any) => a.asset_type === 'img') ? (
                        <AvatarImage src={getAssetUrl(selectedMessage.property.assets.find((a: any) => a.asset_type === 'img').asset_value)} alt={selectedMessage.property.property_title} className="object-cover" />
                      ) : (
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                          <Home className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-muted-foreground text-[10px] uppercase font-semibold tracking-wider mb-1">Property Inquiry</p>
                      <p className="font-semibold text-base truncate">{selectedMessage.property.property_title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">PR-ID: {selectedMessage.pr_id}</Badge>
                        {selectedMessage.property.propert_status && (
                          <Badge variant="outline" className="text-[10px] bg-background">{selectedMessage.property.propert_status}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-primary/5 p-4 rounded-xl">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Guest Name</p>
                    <p className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-primary/70" /> {selectedMessage.guest_full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Guest Email</p>
                    <p className="font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-primary/70" /> {selectedMessage.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Phone Number</p>
                    <p className="font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-primary/70" /> {selectedMessage.guest_ph_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Date Sent</p>
                    <p className="font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-primary/70" /> {selectedMessage.send_date}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Message Content</p>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-xl text-sm leading-relaxed border border-primary/5 whitespace-pre-wrap">
                    {selectedMessage.guest_query}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="px-6 py-4 border-t bg-muted/10 sm:justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                {selectedMessage.is_read === 0 ? (
                  <Button 
                    onClick={() => {
                      setViewDialogOpen(false)
                      setIdToMark(selectedMessage.c_m__id)
                      setIsReadDialogOpen(true)
                    }}
                    variant="outline" 
                    className="rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" /> Mark as Read
                  </Button>
                ) : <div></div>}
                <Button onClick={() => setViewDialogOpen(false)} variant="ghost" className="rounded-xl ml-auto sm:ml-0">
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}