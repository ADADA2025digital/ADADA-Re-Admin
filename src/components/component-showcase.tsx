import { useState } from "react"
import { 
  Calendar as CalendarIcon,
  ChevronDown,
  Mail,
  Settings,
  User,
  Bell,
  Home,
  Menu,
  Plus,
  Search,
  Star,
  Trash,
  Edit,
  Copy,
  Check,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react"

// Layout Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner";
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

export function ComponentShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className="container mx-auto py-10 space-y-10">
      <Toaster />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Component Showcase</h1>
          <p className="text-muted-foreground mt-2">
            All shadcn/ui components in one place
          </p>
        </div>
        <Button onClick={() => toast.success("Welcome to the showcase!")}>
          Show Toast
        </Button>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
        </TabsList>

        {/* Layout Components */}
        <TabsContent value="layout" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card */}
            <Card>
              <CardHeader>
                <CardTitle>Card Component</CardTitle>
                <CardDescription>This is a card with header, content, and footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here. You can put any content inside.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>

            {/* Accordion */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Accordion</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Section 1</AccordionTrigger>
                  <AccordionContent>
                    Content for section 1 goes here.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Section 2</AccordionTrigger>
                  <AccordionContent>
                    Content for section 2 goes here.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Tabs */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Tabs</h3>
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content for tab 1</TabsContent>
                <TabsContent value="tab2">Content for tab 2</TabsContent>
              </Tabs>
            </Card>

            {/* Separator */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Separator</h3>
              <div className="space-y-2">
                <div>Above separator</div>
                <Separator />
                <div>Below separator</div>
              </div>
            </Card>
          </div>

         {/* Resizable Panel */}
{/* <Card className="p-4">
  <h3 className="font-semibold mb-2">Resizable Panel</h3>
  <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
    <ResizablePanel defaultSize={50}>
      <div className="flex h-[200px] items-center justify-center p-6">
        <span className="font-semibold">Left panel</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={50}>
      <div className="flex h-[200px] items-center justify-center p-6">
        <span className="font-semibold">Right panel</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</Card> */}

          {/* Scroll Area */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Scroll Area</h3>
            <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
              <div className="space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="text-sm">
                    Item {i + 1}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Forms Components */}
        <TabsContent value="forms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Input & Label</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
              </div>
            </Card>

            {/* Textarea */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Textarea</h3>
              <Textarea placeholder="Type your message here." />
            </Card>

            {/* Select */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Select</h3>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>

            {/* Checkbox & Radio */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Checkbox & Radio</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms</Label>
                </div>
                <RadioGroup defaultValue="option1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="option1" />
                    <Label htmlFor="option1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="option2" />
                    <Label htmlFor="option2">Option 2</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>

            {/* Switch */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Switch</h3>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </Card>

            {/* Slider */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Slider</h3>
              <Slider defaultValue={[50]} max={100} step={1} />
            </Card>

            {/* Input OTP */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Input OTP</h3>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Card>

            {/* Date Picker */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Date Picker</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Card>
          </div>
        </TabsContent>

        {/* Navigation Components */}
        <TabsContent value="navigation" className="space-y-6">
          <div className="grid gap-6">
            {/* Breadcrumb */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Breadcrumb</h3>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Card>

            {/* Pagination */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Pagination</h3>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Card>

            {/* Menubar */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Menubar</h3>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New File <MenubarShortcut>?N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Open <MenubarShortcut>?O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Save</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </Card>

            {/* Navigation Menu */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Navigation Menu</h3>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Welcome
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Navigation menu example
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Card>
          </div>
        </TabsContent>

        {/* Data Display Components */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Table */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Table</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>Admin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            {/* Avatar */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Avatar</h3>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary/10">JS</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-green-100">MJ</AvatarFallback>
                </Avatar>
              </div>
            </Card>

            {/* Badge */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Badge Variants</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </Card>

            {/* Progress */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Progress</h3>
              <Progress value={75} className="w-[60%]" />
            </Card>

            {/* Skeleton */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Skeleton</h3>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </Card>

            {/* Carousel */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Carousel</h3>
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {[1, 2, 3].map((i) => (
                    <CarouselItem key={i}>
                      <div className="flex aspect-square items-center justify-center bg-muted rounded-lg">
                        <span className="text-4xl font-semibold">{i}</span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Card>
          </div>
        </TabsContent>

        {/* Feedback Components */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Alert */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Alert</h3>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Default Alert</AlertTitle>
                  <AlertDescription>
                    This is a default alert message.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Alert</AlertTitle>
                  <AlertDescription>
                    This is an error alert message.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>

            {/* Toast (via Sonner) */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Toast Notifications</h3>
              <div className="flex gap-2">
                <Button onClick={() => toast.success("Success!")}>
                  Success
                </Button>
                <Button variant="destructive" onClick={() => toast.error("Error!")}>
                  Error
                </Button>
                <Button variant="outline" onClick={() => toast.info("Info message")}>
                  Info
                </Button>
              </div>
            </Card>

            {/* Tooltip */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Tooltip</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>

            {/* Hover Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Hover Card</h3>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@username</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@username</h4>
                      <p className="text-sm">
                        User bio and information
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          </div>
        </TabsContent>

        {/* Overlay Components */}
        <TabsContent value="overlay" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dialog */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Dialog</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Dialog content goes here.</p>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>

            {/* Alert Dialog */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Alert Dialog</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>

            {/* Drawer */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Drawer</h3>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>Drawer description</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p>Drawer content</p>
                  </div>
                  <DrawerFooter>
                    <Button>Close</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Card>

            {/* Sheet */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Sheet</h3>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>
                      Sheet description
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <p>Sheet content</p>
                  </div>
                </SheetContent>
              </Sheet>
            </Card>

            {/* Popover */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Popover</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm">Popover content</p>
                  </div>
                </PopoverContent>
              </Popover>
            </Card>

            {/* Dropdown Menu */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Dropdown Menu</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>

            {/* Context Menu */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Context Menu</h3>
              <ContextMenu>
                <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Profile</ContextMenuItem>
                  <ContextMenuItem>Settings</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Logout</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Card>

            {/* Command Palette */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Command</h3>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Collapsible Example */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Collapsible</h3>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              Toggle Content
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="rounded-md border p-4">
              This content can be collapsed and expanded!
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Toggle & Toggle Group */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Toggle & Toggle Group</h3>
        <div className="space-y-4">
          <Toggle aria-label="Toggle italic">
            <Star className="h-4 w-4" />
          </Toggle>
          <ToggleGroup type="single">
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>

      {/* Aspect Ratio */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Aspect Ratio</h3>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <div className="flex h-full items-center justify-center">
            16:9 Aspect Ratio
          </div>
        </AspectRatio>
      </Card>
    </div>
  )
}
