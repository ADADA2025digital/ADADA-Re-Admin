// src/pages/Articles.tsx
import { useState, useEffect, useRef } from "react"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/RichTextEditor"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash,
  Eye,
  Image as ImageIcon,
  Video,
  FileText,
  Loader2,
  RefreshCw,
  Facebook,
  Instagram,
  Globe,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Grid3X3,
  List,
  Search,
  Settings,
  Check,
  MoreVertical,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Send,
  Heart,
  Share,
  MoreHorizontal,
  Bookmark
} from "lucide-react"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { ThumbsUp, MessageCircle } from "lucide-react"

interface SocialMediaPost {
  id: number
  aid: number
  platform: string
  post_id: string
  post_url: string
  status: string
}

function SocialPostItem({ post, socialMediaPlatforms, article }: { post: SocialMediaPost, socialMediaPlatforms: any[], article: any }) {
  const [stats, setStats] = useState<{ likes: number, comments: number } | null>(null)
  const [postData, setPostData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const social = socialMediaPlatforms.find(p => p.name === post.platform)
  const Icon = social?.icon || Globe

  useEffect(() => {
    if (post.platform === 'Facebook' && post.status === 'published') {
      let fullPostId = post.post_id
      try {
        const urlObj = new URL(post.post_url)
        const parts = urlObj.pathname.split('/').filter(Boolean)
        if (parts.length >= 3 && parts[1] === 'posts') {
          fullPostId = `${parts[0]}_${parts[2]}`
        }
      } catch (e) {}

      setIsLoading(true)
      api.get(`/facebook/posts/${fullPostId}`).then(res => {
        if (res.data && res.data.success && res.data.data) {
          const fetchedData = res.data.data
          setPostData(fetchedData)
          let totalLikes = 0
          if (fetchedData.reactions_summary) {
            Object.values(fetchedData.reactions_summary).forEach((v: any) => {
              if (v?.summary?.total_count) totalLikes += v.summary.total_count
            })
          } else if (Array.isArray(fetchedData.likes)) {
            totalLikes = fetchedData.likes.length
          } else if (fetchedData.likes?.summary?.total_count) {
            totalLikes = fetchedData.likes.summary.total_count
          } else if (fetchedData.likes?.data?.length) {
            totalLikes = fetchedData.likes.data.length
          }

          let totalComments = 0
          if (Array.isArray(fetchedData.comments)) {
            totalComments = fetchedData.comments.length
          } else if (fetchedData.comments?.summary?.total_count) {
            totalComments = fetchedData.comments.summary.total_count
          } else if (fetchedData.comments?.data?.length) {
            totalComments = fetchedData.comments.data.length
          }

          setStats({ likes: totalLikes, comments: totalComments })
        }
      }).catch(err => {
        console.error("Error fetching post stats", err)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [post])

  const renderFacebookUI = () => {
    const images = article?.assets?.filter((a: any) => a.asset_type === 'img') || []
    const mainImage = images[0]?.asset_value
    const message = postData?.post?.message || article?.article_shortdesc?.replace(/<[^>]*>?/gm, '') || article?.article_title

    return (
      <div className="max-w-lg mx-auto bg-[#242526] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-[#3E4042] overflow-hidden text-[#E4E6EB] font-sans w-full transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.7)]">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-[#18191A] flex items-center justify-center shrink-0 border border-[#3E4042]">
            <Facebook className="w-6 h-6 text-[#2D88FF]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[15px] hover:underline cursor-pointer tracking-wide">Urbanview Real Estate</div>
            <div className="text-[13px] text-[#B0B3B8] flex items-center gap-1.5 mt-0.5">
              {postData?.post?.created_time ? new Date(postData.post.created_time).toLocaleDateString() : 'Just now'}
              <span className="text-[10px]">•</span>
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="hover:bg-[#3A3B3C] p-2 rounded-full cursor-pointer transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[#B0B3B8]" />
          </div>
        </div>
        <div className="px-4 pb-3 text-[15px] leading-relaxed whitespace-pre-wrap">{message}</div>
        {mainImage && (
          <div className="w-full bg-[#18191A] flex justify-center border-y border-[#3E4042]/50">
            <img src={mainImage} alt="Post" className="w-full h-auto max-h-[500px] object-contain" />
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-2.5 text-[15px] text-[#B0B3B8] border-b border-[#3E4042]/80">
          <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
            <div className="bg-[#2D88FF] rounded-full p-1.5 shadow-sm"><ThumbsUp className="w-3 h-3 text-white" /></div>
            <span className="font-medium">{stats?.likes || 0}</span>
          </div>
          <div className="hover:underline cursor-pointer">{stats?.comments || 0} comments</div>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <Button variant="ghost" className="flex-1 text-[#B0B3B8] font-semibold text-[15px] rounded-md h-10 hover:bg-[#3A3B3C] hover:text-[#E4E6EB] transition-colors"><ThumbsUp className="w-5 h-5 mr-2 stroke-[2]" /> Like</Button>
          <Button variant="ghost" className="flex-1 text-[#B0B3B8] font-semibold text-[15px] rounded-md h-10 hover:bg-[#3A3B3C] hover:text-[#E4E6EB] transition-colors"><MessageCircle className="w-5 h-5 mr-2 stroke-[2]" /> Comment</Button>
          <Button variant="ghost" className="flex-1 text-[#B0B3B8] font-semibold text-[15px] rounded-md h-10 hover:bg-[#3A3B3C] hover:text-[#E4E6EB] transition-colors"><Share className="w-5 h-5 mr-2 stroke-[2]" /> Share</Button>
        </div>
      </div>
    )
  }

  const renderInstagramUI = () => {
    const images = article?.assets?.filter((a: any) => a.asset_type === 'img') || []
    const mainImage = images[0]?.asset_value
    const message = postData?.post?.message || article?.article_shortdesc?.replace(/<[^>]*>?/gm, '') || article?.article_title

    return (
      <div className="max-w-[470px] mx-auto bg-black rounded-lg border border-[#262626] overflow-hidden text-[#F5F5F5] font-sans w-full shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-all duration-300 hover:border-[#363636]">
        <div className="flex items-center p-3.5 border-b border-[#262626]/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] flex items-center justify-center mr-3 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-2 border-black">
              <Instagram className="w-4 h-4 text-[#F5F5F5]" />
            </div>
          </div>
          <div className="flex-1 font-semibold text-[14px] hover:text-white cursor-pointer tracking-tight">urbanview.realestate</div>
          <div className="hover:opacity-70 cursor-pointer p-1">
            <MoreHorizontal className="w-5 h-5 text-[#F5F5F5]" />
          </div>
        </div>
        {mainImage ? (
          <div className="w-full bg-[#121212] aspect-square flex items-center justify-center border-b border-[#262626]/30">
            <img src={mainImage} alt="Post" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square bg-[#121212] flex items-center justify-center border-b border-[#262626]/30">
            <FileText className="w-12 h-12 text-[#262626]" />
          </div>
        )}
        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-[#F5F5F5] hover:opacity-70 hover:scale-105 transition-all cursor-pointer stroke-[1.5]" />
            <MessageCircle className="w-6 h-6 text-[#F5F5F5] hover:opacity-70 hover:scale-105 transition-all cursor-pointer stroke-[1.5]" />
            <Send className="w-6 h-6 text-[#F5F5F5] hover:opacity-70 hover:scale-105 transition-all cursor-pointer stroke-[1.5] -rotate-[15deg] origin-bottom-left" />
          </div>
          <Bookmark className="w-6 h-6 text-[#F5F5F5] hover:opacity-70 hover:scale-105 transition-all cursor-pointer stroke-[1.5]" />
        </div>
        <div className="px-4 text-[14px] font-semibold mb-1.5 hover:text-white cursor-pointer">{stats?.likes || 0} likes</div>
        <div className="px-4 text-[14px] leading-snug whitespace-pre-wrap">
          <span className="font-semibold mr-2 hover:text-white cursor-pointer">urbanview.realestate</span>
          <span className="text-[#E0E0E0]">{message}</span>
        </div>
        {(stats?.comments ?? 0) > 0 && (
           <div className="px-4 text-[14px] text-[#A8A8A8] mt-2 cursor-pointer hover:text-[#F5F5F5] transition-colors">
             View all {stats?.comments} comments
           </div>
        )}
        <div className="px-4 text-[11px] text-[#A8A8A8] mt-2 pb-4 uppercase tracking-wider">
          {postData?.post?.created_time ? new Date(postData.post.created_time).toLocaleDateString() : '2 HOURS AGO'}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div onClick={() => setIsDialogOpen(true)} className="cursor-pointer flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors border">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0">
            <Icon className={`h-4 w-4 ${social?.color || 'text-muted-foreground'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{post.platform}</p>
            <p className="text-xs text-muted-foreground truncate">{post.post_id}</p>
          </div>
          <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">{post.status}</Badge>
        </div>
        
        {post.platform === 'Facebook' && post.status === 'published' && (
          <div className="flex items-center gap-4 px-3 text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-1 text-xs opacity-70">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading stats...
              </span>
            ) : stats ? (
              <>
                <span className="flex items-center gap-1.5"><ThumbsUp className="h-3 w-3" /> {stats.likes} Likes</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="h-3 w-3" /> {stats.comments} Comments</span>
              </>
            ) : null}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 flex flex-col overflow-hidden bg-transparent border-none shadow-none [&>button]:hidden">
          <div className="flex justify-end p-2 flex-none gap-2 items-center">
            <span className="text-white/60 text-sm font-medium">Post Preview</span>
            <Button variant="outline" size="icon" className="rounded-full bg-white/80 hover:bg-white text-black h-8 w-8" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto w-full px-2 pb-8 hide-scrollbar flex flex-col items-center">
            {post.platform === 'Instagram' ? renderInstagramUI() : renderFacebookUI()}
            <Button 
              className="mt-6 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shrink-0"
              onClick={() => window.open(post.post_url, '_blank')}
            >
              View on {post.platform}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


interface Article {
  aid: number
  article_type: string
  article_title: string
  article_shortdesc: string
  article_longdesc: string | null
  article_status: string
  created_by: number
  created_at: string
  updated_at: string
  eventVenue?: EventVenue
  assets?: Asset[]
  social_media?: SocialMedia[]
  socialMedia?: SocialMedia[]
  social_media_posts?: SocialMediaPost[]
  socialMediaPosts?: SocialMediaPost[]
}

interface EventVenue {
  ev_id: number
  aid: number
  start_date: string
  start_time: string
  end_date: string | null
  end_time: string | null
  venue: string
}

interface Asset {
  asid?: number
  asset_id?: number
  aid: number
  asset_type: string
  asset_value: string
}

interface SocialMedia {
  smid?: number
  sm_id?: number
  aid: number
  sm_name: string
  status: string
}

// Removed interface SocialMediaPost to avoid duplication

interface GalleryItem {
  gallery_id: number
  gallery_type: string
  gallery_assets: string
  gallery_assets_url: string
  created_at: string
}

interface ConfigurationStatus {
  facebook_configured: boolean
  instagram_configured: boolean
  website_configured: boolean
}

const articleTypes = [
  { value: 'Blog', label: 'Blog Post', icon: FileText },
  { value: 'Newsletter', label: 'Newsletter', icon: FileText }
]

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'deactive', label: 'Deactive', color: 'bg-red-500' }
]

const socialMediaPlatforms = [
  { name: 'Website', icon: Globe, color: 'text-green-600', configKey: 'website_configured' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600', configKey: 'facebook_configured' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-600', configKey: 'instagram_configured' }
]

const paginationOptions = [5, 10, 20, 50, 100]

export function Articles() {
  const { toast } = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewArticle, setViewArticle] = useState<Article | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isViewLoading, setIsViewLoading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  
  const [configStatus, setConfigStatus] = useState<ConfigurationStatus>({
    facebook_configured: false,
    instagram_configured: false,
    website_configured: false
  })
  
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryDocuments, setGalleryDocuments] = useState<GalleryItem[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isGalleryDeleteDialogOpen, setIsGalleryDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'image' | 'document'; url: string } | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    article_type: "Blog",
    article_title: "",
    article_shortdesc: "",
    article_longdesc: "",
    article_status: "draft"
  })

  const [assets, setAssets] = useState<{ asset_type: string; asset_value: string }[]>([])
  const [socialMedia, setSocialMedia] = useState<{ sm_name: string; status: string; configured: boolean }[]>([])

  const getArticleSocialMedia = (article: Article): SocialMedia[] => {
    return article.social_media || article.socialMedia || []
  }

  const getArticleSocialMediaPosts = (article: Article): SocialMediaPost[] => {
    return article.social_media_posts || article.socialMediaPosts || []
  }

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/articles')
      if (response.data.success) {
        const articlesData = response.data.data.data || response.data.data || []
        setArticles(articlesData)
      } else if (response.data.status) {
        const articlesData = response.data.data.data || response.data.data || []
        setArticles(articlesData)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast({ title: "Error", description: "Failed to fetch articles", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/gallery/type/image')
      if (response.data.status === true || response.data.success === true) {
        setGalleryImages(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error)
    }
  }

  const fetchGalleryDocuments = async () => {
    try {
      const response = await api.get('/gallery/type/document')
      if (response.data.status === true || response.data.success === true) {
        setGalleryDocuments(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching gallery documents:", error)
    }
  }

  const fetchConfigurationStatus = async () => {
    try {
      const response = await api.get('/configurations/first')
      if ((response.data.success || response.data.status) && response.data.data) {
        const config = response.data.data
        setConfigStatus({
          facebook_configured: !!(config.facebook_page_id && config.facebook_access_token && 
                                   config.facebook_page_id.trim() !== "" && 
                                   config.facebook_access_token.trim() !== ""),
          instagram_configured: !!(config.insta_page_id && config.insta_access_token && 
                                    config.insta_page_id.trim() !== "" && 
                                    config.insta_access_token.trim() !== ""),
          website_configured: !!(config.web_url && config.web_url.trim() !== "")
        })
      } else {
        setConfigStatus({
          facebook_configured: false,
          instagram_configured: false,
          website_configured: false
        })
      }
    } catch (error) {
      console.error("Error fetching configuration:", error)
      setConfigStatus({
        facebook_configured: false,
        instagram_configured: false,
        website_configured: false
      })
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchGalleryImages()
    fetchGalleryDocuments()
    fetchConfigurationStatus()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType, filterStatus])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchArticles()
    await fetchGalleryImages()
    await fetchGalleryDocuments()
    await fetchConfigurationStatus()
    setIsRefreshing(false)
    toast({ title: "Refreshed", description: "Data updated successfully" })
  }

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setSelectedArticle(article)
      setFormData({
        article_type: article.article_type,
        article_title: article.article_title,
        article_shortdesc: article.article_shortdesc,
        article_longdesc: article.article_longdesc || "",
        article_status: article.article_status
      })

      setAssets(article.assets?.map(a => ({ asset_type: a.asset_type, asset_value: a.asset_value })) || [])
      
      const articleSocialMedia = getArticleSocialMedia(article).map(s => ({ 
        sm_name: s.sm_name, 
        status: s.status,
        configured: getPlatformConfiguredStatus(s.sm_name)
      }))
      
      if (articleSocialMedia.length === 0) {
        setSocialMedia(socialMediaPlatforms.map(p => ({ 
          sm_name: p.name, 
          status: "active",
          configured: getPlatformConfiguredStatus(p.name)
        })))
      } else {
        setSocialMedia(articleSocialMedia)
      }
    } else {
      setSelectedArticle(null)
      setFormData({
        article_type: "Blog",
        article_title: "",
        article_shortdesc: "",
        article_longdesc: "",
        article_status: "draft"
      })
      setAssets([])
      setSocialMedia(socialMediaPlatforms.map(p => ({ 
        sm_name: p.name, 
        status: "active",
        configured: getPlatformConfiguredStatus(p.name)
      })))
    }
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const getPlatformConfiguredStatus = (platform: string): boolean => {
    switch (platform) {
      case 'Facebook': return configStatus.facebook_configured
      case 'Instagram': return configStatus.instagram_configured
      case 'Website': return configStatus.website_configured
      default: return false
    }
  }

  const handleUploadToGallery = async (file: File, type: 'image' | 'document') => {
    // 📸 Instagram Aspect Ratio Validation
    if (type === 'image') {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });
        
        const ratio = img.width / img.height;
        // Instagram constraints: Min 0.8 (4:5), Max 1.91 (1.91:1)
        if (ratio < 0.79 || ratio > 1.92) { // Allowing a tiny margin for rounding
          toast({ 
            title: "Aspect Ratio Not Supported", 
            description: `Instagram requires a ratio between 4:5 (0.8) and 1.91:1. Your image is ${ratio.toFixed(2)}. Please crop it before uploading.`, 
            variant: "destructive" 
          });
          return null;
        }
      } catch (err) {
        console.warn("Could not validate image dimensions", err);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }

    const formData = new FormData()
    formData.append('gallery_type', type)
    formData.append('file', file)

    try {
      const response = await api.post('/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.status === true || response.data.success === true) {
        if (type === 'image') {
          await fetchGalleryImages()
        } else {
          await fetchGalleryDocuments()
        }
        toast({ 
          title: "Upload Successful", 
          description: `${type === 'image' ? 'Image' : 'Document'} uploaded successfully` 
        })
        return response.data.data?.gallery_assets_url || null
      }
      return null
    } catch (error) {
      console.error("Upload failed:", error)
      toast({ 
        title: "Upload Failed", 
        description: `Could not upload ${type}`, 
        variant: "destructive" 
      })
      return null
    }
  }

  // Gallery Delete Functions
  const handleDeleteGalleryImage = async (galleryId: number) => {
    try {
      const response = await api.delete(`/gallery/${galleryId}`)
      if (response.data.status === true || response.data.success === true) {
        setGalleryImages(prev => prev.filter(img => img.gallery_id !== galleryId))
        toast({ 
          title: "Deleted", 
          description: "Image deleted successfully" 
        })
        return true
      } else {
        toast({ 
          title: "Delete Failed", 
          description: response.data.message || "Failed to delete image", 
          variant: "destructive" 
        })
        return false
      }
    } catch (error) {
      console.error("Error deleting gallery image:", error)
      toast({ 
        title: "Delete Failed", 
        description: "Could not delete image", 
        variant: "destructive" 
      })
      return false
    }
  }

  const handleDeleteGalleryDocument = async (galleryId: number) => {
    try {
      const response = await api.delete(`/gallery/${galleryId}`)
      if (response.data.status === true || response.data.success === true) {
        setGalleryDocuments(prev => prev.filter(doc => doc.gallery_id !== galleryId))
        toast({ 
          title: "Deleted", 
          description: "Document deleted successfully" 
        })
        return true
      } else {
        toast({ 
          title: "Delete Failed", 
          description: response.data.message || "Failed to delete document", 
          variant: "destructive" 
        })
        return false
      }
    } catch (error) {
      console.error("Error deleting gallery document:", error)
      toast({ 
        title: "Delete Failed", 
        description: "Could not delete document", 
        variant: "destructive" 
      })
      return false
    }
  }

  const confirmDeleteGalleryItem = (id: number, type: 'image' | 'document') => {
    setItemToDelete({ id, type, url: '' })
    setIsGalleryDeleteDialogOpen(true)
  }

  const handleConfirmedGalleryDelete = async () => {
    if (!itemToDelete) return
    
    if (itemToDelete.type === 'image') {
      await handleDeleteGalleryImage(itemToDelete.id)
    } else {
      await handleDeleteGalleryDocument(itemToDelete.id)
    }
    setIsGalleryDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleAddAssetFromGallery = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    let type = "img";
    
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    const vidExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    
    if (docExtensions.includes(ext)) {
      type = "doc";
    } else if (vidExtensions.includes(ext)) {
      type = "vid";
    }

    setAssets([...assets, { asset_type: type, asset_value: url }]);
    toast({ 
      title: "Added to Assets", 
      description: `Successfully added ${type === 'img' ? 'image' : type === 'vid' ? 'video' : 'document'}.` 
    });
  }

  const handleAddAsset = () => {
    setAssets([...assets, { asset_type: "img", asset_value: "" }])
  }

  const handleRemoveAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index))
  }

  const handleAssetChange = (index: number, field: string, value: string) => {
    const updated = [...assets]
    updated[index] = { ...updated[index], [field]: value }
    setAssets(updated)
  }

  const handleSocialMediaToggle = (index: number, checked: boolean) => {
    const updated = [...socialMedia]
    updated[index] = { ...updated[index], status: checked ? "active" : "inactive" }
    setSocialMedia(updated)
  }

  const handleNextTab = () => {
    if (activeTab === "basic") {
      if (!formData.article_type) {
        toast({ title: "Validation Error", description: "Article type is required", variant: "destructive" })
        return
      }
      if (!formData.article_title.trim()) {
        toast({ title: "Validation Error", description: "Article title is required", variant: "destructive" })
        return
      }
      const isShortDescEmpty = !formData.article_shortdesc || formData.article_shortdesc.trim() === "" || formData.article_shortdesc === "<p></p>" || formData.article_shortdesc === "<p><br></p>"
      if (isShortDescEmpty) {
        toast({ title: "Validation Error", description: "Short description is required", variant: "destructive" })
        return
      }
      setActiveTab("assets")
    } else if (activeTab === "assets") {
      const hasImage = assets.some(a => a.asset_type === 'img' && a.asset_value.trim())
      if (!hasImage) {
        toast({ title: "Validation Error", description: "At least one image asset is required", variant: "destructive" })
        return
      }
      setActiveTab("social")
    }
  }

  const handleSubmit = async () => {
    if (!formData.article_type) {
      toast({ title: "Validation Error", description: "Article type is required", variant: "destructive" })
      setActiveTab("basic")
      return
    }

    if (!formData.article_title.trim()) {
      toast({ title: "Validation Error", description: "Article title is required", variant: "destructive" })
      setActiveTab("basic")
      return
    }

    const isShortDescEmpty = !formData.article_shortdesc || formData.article_shortdesc.trim() === "" || formData.article_shortdesc === "<p></p>" || formData.article_shortdesc === "<p><br></p>"
    if (isShortDescEmpty) {
      toast({ title: "Validation Error", description: "Short description is required", variant: "destructive" })
      setActiveTab("basic")
      return
    }

    const hasImage = assets.some(a => a.asset_type === 'img' && a.asset_value.trim())
    if (!hasImage) {
      toast({ title: "Validation Error", description: "At least one image asset is required", variant: "destructive" })
      setActiveTab("assets")
      return
    }

    try {
      setIsSubmitting(true)
      const payload: any = {
        article_type: formData.article_type,
        article_title: formData.article_title,
        article_shortdesc: formData.article_shortdesc,
        article_longdesc: formData.article_longdesc || null,
        article_status: formData.article_status,
      }

      if (assets.length > 0) {
        payload.assets = assets.filter(a => a.asset_value.trim())
      }

      if (socialMedia.length > 0) {
        payload.social_media = socialMedia
          .filter(sm => sm.configured && sm.status === 'active')
          .map(sm => ({ sm_name: sm.sm_name, status: sm.status }))
      }

      let response
      if (selectedArticle) {
        response = await api.put(`/articles/${selectedArticle.aid}`, payload)
      } else {
        response = await api.post('/articles', payload)
      }

      if (response.data.success || response.data.status) {
        toast({ title: "Success", description: response.data.message || "Article saved successfully" })
        setIsDialogOpen(false)
        fetchArticles()
      } else {
        throw new Error(response.data.message || "Failed to save article")
      }
    } catch (error: any) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save article",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleSocialMediaInView = async (platformName: string, checked: boolean) => {
    if (!viewArticle) return;
    try {
      setIsPublishing(true)
      
      const currentList = getArticleSocialMedia(viewArticle);
      const updatedList = [...currentList];
      
      const existingIndex = updatedList.findIndex(sm => sm.sm_name === platformName);
      if (existingIndex >= 0) {
        updatedList[existingIndex] = { ...updatedList[existingIndex], status: checked ? 'active' : 'inactive' };
      } else {
        updatedList.push({ aid: viewArticle.aid, sm_name: platformName, status: checked ? 'active' : 'inactive' });
      }

      const payload: any = {
        article_type: viewArticle.article_type,
        article_title: viewArticle.article_title,
        article_shortdesc: viewArticle.article_shortdesc,
        article_longdesc: viewArticle.article_longdesc || null,
        article_status: viewArticle.article_status,
      }
      
      if (viewArticle.assets && viewArticle.assets.length > 0) {
        payload.assets = viewArticle.assets.map((a: any) => ({ asset_type: a.asset_type, asset_value: a.asset_value }));
      }
      
      payload.social_media = updatedList
        .filter(sm => sm.status === 'active' || sm.status === 'published')
        .map(sm => ({ aid: viewArticle.aid, sm_name: sm.sm_name, status: sm.status }));

      const response = await api.put(`/articles/${viewArticle.aid}`, payload)
      if (response.data.success || response.data.status) {
        const updatedArticleRes = await api.get(`/articles/${viewArticle.aid}`)
        if (updatedArticleRes.data.success || updatedArticleRes.data.status) {
          setViewArticle(updatedArticleRes.data.data)
        }
        fetchArticles()
        toast({ title: "Integration Updated", description: `${platformName} integration successfully ${checked ? 'activated' : 'deactivated'}.` })
      } else {
        throw new Error(response.data.message || "Failed to update platform status")
      }
    } catch (error: any) {
      console.error("Error updating platform:", error)
      toast({ title: "Error", description: error.response?.data?.message || error.message || "Failed to update platform", variant: "destructive" })
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePublishArticle = async (article: Article) => {
    try {
      setIsPublishing(true)
      
      const socialMediaList = getArticleSocialMedia(article)
      const activeSocialMedia = socialMediaList.filter(sm => sm.status === 'active')
      
      if (activeSocialMedia.length === 0) {
        toast({ 
          title: "No Active Platforms", 
          description: "Please enable at least one social media platform for this article before publishing.", 
          variant: "destructive" 
        })
        setIsPublishing(false)
        return
      }

      const configuredActive = activeSocialMedia.filter(sm => {
        if (sm.sm_name === 'Facebook') return configStatus.facebook_configured
        if (sm.sm_name === 'Instagram') return configStatus.instagram_configured
        if (sm.sm_name === 'Website') return configStatus.website_configured
        return false
      })

      if (configuredActive.length === 0) {
        toast({ 
          title: "Configuration Required", 
          description: "Selected platforms are not configured. Please configure them in Settings first.", 
          variant: "destructive" 
        })
        setIsPublishing(false)
        return
      }

      const response = await api.put(`/articles/${article.aid}/publish`, {
        platforms: configuredActive.map(sm => sm.sm_name)
      })
      
      if (response.data.success || response.data.status) {
        const responseData = response.data.data || {};
        const msg = responseData.message || response.data.message || "Processing complete";
        const isWarning = msg.toLowerCase().includes("no new platforms") || msg.toLowerCase().includes("failed");

        toast({ 
          title: isWarning ? "Publishing Warning" : "Publishing Action Successful", 
          description: msg,
          variant: isWarning ? "destructive" : "default"
        })
        
        // Brief delay to allow backend processing before refresh
        setTimeout(async () => {
          const updatedArticle = await api.get(`/articles/${article.aid}`)
          if (updatedArticle.data.success || updatedArticle.data.status) {
            setViewArticle(updatedArticle.data.data)
          }
          fetchArticles()
        }, 1500)
      } else {
        toast({ 
          title: "Publish Failed", 
          description: response.data.message || "Failed to publish article", 
          variant: "destructive" 
        })
      }
    } catch (error: any) {
      console.error("Error publishing article:", error)
      toast({ 
        title: "Publish Error", 
        description: error.response?.data?.message || "Failed to publish article", 
        variant: "destructive" 
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleViewArticle = async (article: Article) => {
    setIsViewLoading(true)
    setIsViewOpen(true)
    setActiveImageIndex(0)
    try {
      const response = await api.get(`/articles/${article.aid}`)
      if (response.data.success || response.data.status) {
        setViewArticle(response.data.data)
      } else {
        setViewArticle(article)
      }
    } catch (error) {
      console.error("Error fetching article detail:", error)
      setViewArticle(article)
    } finally {
      setIsViewLoading(false)
    }
  }

  const handleDeleteRequest = (article: Article) => {
    setSelectedArticle(article)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedArticle) return

    try {
      const response = await api.delete(`/articles/${selectedArticle.aid}`)
      if (response.data.success || response.data.status) {
        toast({ title: "Success", description: "Article deleted successfully" })
        setIsDeleteDialogOpen(false)
        setSelectedArticle(null)
        fetchArticles()
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(s => s.value === status) || statusOptions[0]
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${option.color} text-white shadow`}>{option.label}</span>
  }

  const isArticlePublished = (status: string) => {
    return status === 'publish' || status === 'Published' || status === 'active'
  }

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.article_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.article_shortdesc.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || article.article_type === filterType
      const matchesStatus = filterStatus === "all" || article.article_status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => a.aid - b.aid)

  const totalPages = Math.ceil(filteredArticles.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Manage blog posts and newsletters.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total Articles</p>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold mt-2">{articles.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Published</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {articles.filter(a => isArticlePublished(a.article_status)).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Draft</p>
              <FileText className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {articles.filter(a => a.article_status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-primary/10 font-outfit">
                <SelectItem value="all">All Types</SelectItem>
                {articleTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-background border-primary/10 font-outfit">
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-2"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-2"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles List - Table View */}
      {viewMode === "table" ? (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead className="w-[220px]">Title</TableHead>
                    <TableHead className="w-[110px]">Type</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Created</TableHead>
                    <TableHead className="w-[100px]">Social</TableHead>
                    <TableHead className="w-[50px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No articles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedArticles.map((article, idx) => {
                      const socialList = getArticleSocialMedia(article)
                      return (
                        <TableRow key={article.aid}>
                          <TableCell className="font-medium">{startIndex + idx + 1}</TableCell>
                          <TableCell>
                            <p className="font-medium truncate max-w-[400px]">{article.article_title}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.article_type}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(article.article_status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {socialList.length > 0 ? (
                                socialList.filter(sm => sm.status === 'active' || sm.status === 'published').map((sm, idx) => {
                                  const platform = socialMediaPlatforms.find(p => p.name === sm.sm_name)
                                  if (!platform) return null
                                  const Icon = platform.icon
                                  return (
                                    <span key={idx} className={platform.color} title={`${sm.status === 'published' ? 'Published' : 'Active'} on ${sm.sm_name}`}>
                                      <Icon className="h-5 w-5" />
                                    </span>
                                  )
                                })
                              ) : (
                                <span className="text-xs text-muted-foreground italic">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border shadow-xl font-outfit">
                                <DropdownMenuItem onClick={() => handleViewArticle(article)}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </DropdownMenuItem>
                                {!isArticlePublished(article.article_status) && (
                                  <DropdownMenuItem onClick={() => handleOpenDialog(article)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteRequest(article)}
                                >
                                  <Trash className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={entriesPerPage.toString()} onValueChange={(v) => { setEntriesPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/10 font-outfit">
                  {paginationOptions.map(option => (
                    <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                Next <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Grid View */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => {
              const socialList = getArticleSocialMedia(article)
              return (
                <Card key={article.aid} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    {article.assets?.find(a => a.asset_type === 'img') ? (
                      <img
                        src={article.assets.find(a => a.asset_type === 'img')!.asset_value}
                        alt={article.article_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
                        <FileText className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(article.article_status)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{article.article_type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1 flex-1">{article.article_title}</h3>
                      <div className="flex gap-1.5 items-center">
                        {socialList.filter(sm => sm.status === 'active' || sm.status === 'published').map((sm, idx) => {
                          const platform = socialMediaPlatforms.find(p => p.name === sm.sm_name)
                          if (!platform) return null
                          const Icon = platform.icon
                          return (
                            <span key={idx} className={platform.color} title={`${sm.status === 'published' ? 'Published' : 'Active'} on ${sm.sm_name}`}>
                              <Icon className="h-4 w-4" />
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <div 
                      className="text-sm text-muted-foreground line-clamp-2 mb-4 prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: article.article_shortdesc }}
                    />
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleViewArticle(article)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      {!isArticlePublished(article.article_status) && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(article)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDeleteRequest(article)}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* Pagination for Grid View */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={entriesPerPage.toString()} onValueChange={(v) => { setEntriesPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/10 font-outfit">
                  {paginationOptions.map(option => (
                    <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                Next <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-muted/30">
            <DialogTitle className="text-xl sm:text-2xl">
              {selectedArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Fill in the details below to {selectedArticle ? "update" : "create"} an article.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto mb-6 p-1 bg-muted/30 border border-border/50 rounded-xl gap-1 sm:gap-0">
                <TabsTrigger 
                  value="basic" 
                  className="gap-2 rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                >
                  <FileText className="h-4 w-4" /> Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="assets" 
                  className="gap-2 rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                  disabled={!formData.article_title.trim() || !formData.article_shortdesc || formData.article_shortdesc === "<p></p>" || formData.article_shortdesc === "<p><br></p>"}
                >
                  <ImageIcon className="h-4 w-4" /> Media & Assets
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="gap-2 rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                  disabled={!formData.article_title.trim() || !formData.article_shortdesc || formData.article_shortdesc === "<p></p>" || formData.article_shortdesc === "<p><br></p>" || !assets.some(a => a.asset_type === 'img' && a.asset_value.trim())}
                >
                  <Globe className="h-4 w-4" /> Social Media
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Article Type *</Label>
                    <Select value={formData.article_type} onValueChange={(v) => setFormData({ ...formData, article_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-background border-primary/10 font-outfit">
                        {articleTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" /> {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Status</Label>
                    <Select value={formData.article_status} onValueChange={(v) => setFormData({ ...formData, article_status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-background border-primary/10 font-outfit">
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${status.color}`} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Title *</Label>
                  <Input
                    value={formData.article_title}
                    onChange={(e) => setFormData({ ...formData, article_title: e.target.value })}
                    placeholder="Enter article title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Short Description *</Label>
                  <RichTextEditor
                    value={formData.article_shortdesc}
                    onChange={(value) => setFormData({ ...formData, article_shortdesc: value })}
                    placeholder="Brief summary of the article..."
                    minHeight="150px"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Full Content</Label>
                  <RichTextEditor
                    value={formData.article_longdesc}
                    onChange={(value) => setFormData({ ...formData, article_longdesc: value })}
                    placeholder="Write your full article content here..."
                    minHeight="400px"
                  />
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-5">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Media Assets *</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsGalleryOpen(true)}>
                      <ImageIcon className="h-4 w-4 mr-2" /> Browse Gallery
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddAsset}>
                      <Plus className="h-4 w-4 mr-2" /> Add Asset URL
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {assets.length === 0 ? (
                    <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No assets added yet</p>
                    </div>
                  ) : (
                    assets.map((asset, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 items-center p-3 bg-muted/20 rounded-lg border">
                        <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden border bg-background flex items-center justify-center">
                          {asset.asset_type === "img" && asset.asset_value.trim() ? (
                            <img src={asset.asset_value} className="h-full w-full object-cover" alt="Preview" onError={(e) => { (e.target as any).src = 'https://placehold.co/100x100?text=Invalid+URL'; }} />
                          ) : asset.asset_type === "vid" ? (
                            <Video className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Select value={asset.asset_type} onValueChange={(v) => handleAssetChange(index, "asset_type", v)}>
                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-background border-primary/10 font-outfit">
                              <SelectItem value="img">Image</SelectItem>
                              <SelectItem value="vid">Video</SelectItem>
                              <SelectItem value="doc">Document</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={asset.asset_value}
                            onChange={(e) => handleAssetChange(index, "asset_value", e.target.value)}
                            placeholder={asset.asset_type === "img" ? "Image URL" : asset.asset_type === "vid" ? "Video URL" : "Document URL"}
                            className="sm:col-span-2 h-10"
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveAsset(index)} className="self-end sm:self-auto">
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-5">
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Settings className="h-4 w-4" /> Social Media Configuration Status
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-2 bg-background rounded-md">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Website</span>
                      </div>
                      {configStatus.website_configured ? (
                        <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Configured</Badge>
                      ) : (
                        <Badge variant="destructive">Not Configured</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded-md">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Facebook</span>
                      </div>
                      {configStatus.facebook_configured ? (
                        <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Configured</Badge>
                      ) : (
                        <Badge variant="destructive">Not Configured</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded-md">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        <span className="text-sm">Instagram</span>
                      </div>
                      {configStatus.instagram_configured ? (
                        <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Configured</Badge>
                      ) : (
                        <Badge variant="destructive">Not Configured</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Publish to Social Media</Label>
                  {socialMedia.map((sm, index) => {
                    const social = socialMediaPlatforms.find(p => p.name === sm.sm_name)
                    const Icon = social?.icon || Globe
                    const isConfigured = sm.configured
                    
                    return (
                      <div key={index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all gap-4 sm:gap-0 ${!isConfigured ? 'opacity-60 bg-muted/20' : 'bg-muted/20'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-background flex items-center justify-center">
                            <Icon className={`h-5 w-5 ${social?.color || 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{sm.sm_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {!isConfigured ? 'Not configured in system settings' : sm.status === 'active' ? 'Will be published when article is published' : "Won't be published"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          {!isConfigured && <Badge variant="outline" className="text-xs"><Settings className="h-3 w-3 mr-1" /> Need Config</Badge>}
                          <div className="flex items-center gap-3">
                            <span className={`text-sm ${!isConfigured ? 'text-muted-foreground' : ''}`}>{sm.status === 'active' ? 'Active' : 'Inactive'}</span>
                            <label className={`switch-button ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`} htmlFor={`switch-${index}`}>
                              <div className="switch-outer">
                                <input 
                                  id={`switch-${index}`} 
                                  type="checkbox" 
                                  checked={sm.status === 'active'} 
                                  onChange={(e) => handleSocialMediaToggle(index, e.target.checked)} 
                                  disabled={!isConfigured} 
                                />
                                <div className="button">
                                  <span className="button-toggle"></span>
                                  <span className="button-indicator"></span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end gap-2 text-sm text-muted-foreground italic">
                  * Finalize configuration below to publish.
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="px-4 sm:px-6 py-4 border-t bg-muted/30 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            {activeTab === "basic" ? (
              <Button 
                onClick={handleNextTab} 
                className="w-full sm:w-auto"
                disabled={!formData.article_title.trim() || !formData.article_shortdesc || formData.article_shortdesc === "<p></p>" || formData.article_shortdesc === "<p><br></p>"}
              >
                Next <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            ) : activeTab === "assets" ? (
              <Button 
                onClick={handleNextTab} 
                className="w-full sm:w-auto"
                disabled={!assets.some(a => a.asset_type === 'img' && a.asset_value.trim())}
              >
                Next <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.article_title.trim() || !formData.article_shortdesc || formData.article_shortdesc === "<p></p>" || !assets.some(a => a.asset_type === 'img' && a.asset_value.trim())} 
                className="w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Check className="h-4 w-4 mr-2" />
                {selectedArticle ? "Update Article" : "Create Article"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog with Delete Functionality */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Media Gallery</DialogTitle>
            <DialogDescription>Select an image or document to add to your article. Click delete to remove items.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="images"><ImageIcon className="h-4 w-4 mr-2" /> Images</TabsTrigger>
              <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-2" /> Documents</TabsTrigger>
            </TabsList>

            {/* Images Tab with Delete Button */}
            <TabsContent value="images" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{galleryImages.length} images available</div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" /> {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsUploading(true)
                    await handleUploadToGallery(file, 'image')
                    setIsUploading(false)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }
                }} />
              </div>

              {galleryImages.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No images in gallery</p>
                  <Button variant="link" className="mt-2" onClick={() => fileInputRef.current?.click()}>Upload your first image</Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                  {galleryImages.map((image) => (
                    <div key={image.gallery_id} className="group relative aspect-square rounded-lg overflow-hidden border-2 hover:border-primary cursor-pointer transition-all">
                      <img
                        src={image.gallery_assets_url}
                        alt={`Gallery ${image.gallery_id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => handleAddAssetFromGallery(image.gallery_assets_url)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddAssetFromGallery(image.gallery_assets_url)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDeleteGalleryItem(image.gallery_id, 'image')
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Documents Tab with Delete Button */}
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{galleryDocuments.length} documents available</div>
                <Button variant="outline" size="sm" onClick={() => documentInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" /> {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
                <input ref={documentInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsUploading(true)
                    await handleUploadToGallery(file, 'document')
                    setIsUploading(false)
                    if (documentInputRef.current) documentInputRef.current.value = ''
                  }
                }} />
              </div>

              {galleryDocuments.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No documents in gallery</p>
                  <Button variant="link" className="mt-2" onClick={() => documentInputRef.current?.click()}>Upload your first document</Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {galleryDocuments.map((doc) => (
                    <div
                      key={doc.gallery_id}
                      className="group flex items-center justify-between p-3 rounded-lg border-2 hover:border-primary cursor-pointer transition-all bg-muted/20"
                      onClick={() => handleAddAssetFromGallery(doc.gallery_assets_url)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate max-w-[300px]">
                            {doc.gallery_assets_url.split('/').pop() || 'Document'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddAssetFromGallery(doc.gallery_assets_url)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDeleteGalleryItem(doc.gallery_id, 'document')
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGalleryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isGalleryDeleteDialogOpen}
        onClose={() => {
          setIsGalleryDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={handleConfirmedGalleryDelete}
        isLoading={isUploading}
        title="Delete Gallery Item"
        description={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone and will permanently remove it from the gallery.`}
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setActiveImageIndex(0); }}>
        <DialogContent className="sm:max-w-[1400px] w-[98vw] max-h-[95vh] p-0 flex flex-col overflow-hidden bg-background border-primary/20 shadow-2xl">
          <DialogHeader className="px-8 py-6 border-b bg-muted/20 flex-none bg-gradient-to-r from-muted/30 to-background">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Article Details - {viewArticle?.article_title}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-muted-foreground">
                  {viewArticle && getStatusBadge(viewArticle.article_status)}
                  <Badge variant="outline" className="capitalize">{viewArticle?.article_type}</Badge>
                  <span className="text-xs">{viewArticle?.created_at && new Date(viewArticle.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {viewArticle && (!isArticlePublished(viewArticle.article_status) || getArticleSocialMedia(viewArticle).some(sm => sm.status === 'active')) && (
                <Button onClick={() => handlePublishArticle(viewArticle)} disabled={isPublishing} className="bg-gradient-to-r from-blue-500 to-blue-600">
                  {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Publish Article
                </Button>
              )}
            </div>
          </DialogHeader>

          {isViewLoading ? (
            <div className="flex items-center justify-center p-24"><Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" /></div>
          ) : viewArticle && (
            <div className="flex-1 overflow-y-auto p-8 min-h-0 bg-muted/5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
                {/* Left Column - Images */}
                <div className="lg:col-span-8 space-y-8">
                  {(viewArticle.assets || []).filter(a => a.asset_type === 'img').length > 0 ? (
                    <div className="w-full bg-background rounded-lg border overflow-hidden shadow-sm">
                      <div className="relative w-full bg-black flex items-center justify-center">
                        <img src={(viewArticle.assets || []).filter(a => a.asset_type === 'img')[activeImageIndex]?.asset_value || ""} className="w-full h-auto max-h-[400px] object-contain" alt="Article Main" />
                        {(viewArticle.assets || []).filter(a => a.asset_type === 'img').length > 1 && (
                          <div className="absolute right-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                            {activeImageIndex + 1} / {(viewArticle.assets || []).filter(a => a.asset_type === 'img').length}
                          </div>
                        )}
                      </div>
                      {(viewArticle.assets || []).filter(a => a.asset_type === 'img').length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto bg-muted/30">
                          {(viewArticle.assets || []).filter(a => a.asset_type === 'img').map((asset, i) => (
                            <div key={i} onClick={() => setActiveImageIndex(i)} className={`h-16 w-24 shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${i === activeImageIndex ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'}`}>
                              <img src={asset.asset_value} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg border">
                      <FileText className="h-16 w-16 opacity-20 mb-4" />
                      <p>No images available</p>
                    </div>
                  )}

                  {/* Full Content */}
                  <div className="rounded-xl border overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow">
                    <div className="px-5 py-4 border-b bg-muted/40 font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Full Content</div>
                    </div>
                    <div className="p-6 prose prose-invert prose-blue max-w-none max-h-[600px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: viewArticle.article_longdesc || "No content provided." }} />
                  </div>

                  {/* Attachments */}
                  {(viewArticle.assets || []).filter(a => a.asset_type !== 'img').length > 0 && (
                    <div className="rounded-lg border overflow-hidden bg-background shadow-sm">
                      <div className="px-4 py-3 border-b bg-muted/40 font-medium"><ImageIcon className="h-4 w-4 inline mr-2" /> Attachments & Links</div>
                      <div className="p-4 space-y-2">
                        {(viewArticle.assets || []).filter(a => a.asset_type !== 'img').map((asset, i) => (
                          <a key={`asset-${i}`} href={asset.asset_value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline bg-background px-3 py-2 rounded-md border text-sm">
                            {asset.asset_type === 'vid' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            <span className="truncate">{asset.asset_value.split('/').pop() || asset.asset_value}</span>
                            <Badge variant="secondary" className="ml-auto text-[10px] capitalize">{asset.asset_type === 'vid' ? 'Video' : 'Document'}</Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Info Cards */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="rounded-lg border overflow-hidden bg-background shadow-sm">
                    <div className="px-4 py-3 border-b bg-muted/40 font-medium"><AlertCircle className="h-4 w-4 inline mr-2" /> Basic Information</div>
                    <div className="p-4 space-y-4 text-sm">
                      <div><p className="text-xs text-muted-foreground mb-1">Title</p><p className="font-semibold">{viewArticle.article_title}</p></div>
                      <Separator />
                      <div><p className="text-xs text-muted-foreground mb-1">Short Description</p><div className="text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewArticle.article_shortdesc }} /></div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-muted-foreground mb-1">Article Type</p><Badge variant="outline" className="capitalize">{viewArticle.article_type}</Badge></div>
                        <div><p className="text-xs text-muted-foreground mb-1">Status</p>{getStatusBadge(viewArticle.article_status)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Integration Configuration */}
                  <div className="rounded-lg border overflow-hidden bg-background shadow-sm">
                    <div className="px-4 py-3 border-b bg-muted/40 font-medium"><Settings className="h-4 w-4 inline mr-2" /> Social Media Configurations</div>
                    <div className="p-4">
                      {(() => {
                        const configuredPlatforms = socialMediaPlatforms.filter(p => getPlatformConfiguredStatus(p.name))
                        const articleSocialMediaList = getArticleSocialMedia(viewArticle)
                        
                        if (configuredPlatforms.length > 0) {
                          return (
                            <div className="space-y-3">
                              {configuredPlatforms.map((platform, idx) => {
                                const Icon = platform.icon;
                                const smData = articleSocialMediaList.find(sm => sm.sm_name === platform.name);
                                const status = smData?.status || 'inactive';
                                
                                return (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border shadow-sm"><Icon className={`h-5 w-5 ${platform.color}`} /></div>
                                      <div><p className="font-medium text-sm">{platform.name}</p><p className="text-xs text-muted-foreground capitalize">{status === 'published' ? 'Published' : status === 'active' ? 'Ready to Publish' : 'Inactive'}</p></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {status === 'published' ? (
                                        <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Published</Badge>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className={`text-xs font-medium ${status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span>
                                          <label className="switch-button scale-75 origin-right" htmlFor={`view-switch-${idx}`}>
                                            <div className="switch-outer">
                                              <input 
                                                id={`view-switch-${idx}`} 
                                                type="checkbox" 
                                                checked={status === 'active'} 
                                                disabled={isPublishing}
                                                onChange={(e) => handleToggleSocialMediaInView(platform.name, e.target.checked)} 
                                              />
                                              <div className="button">
                                                <span className="button-toggle"></span>
                                                <span className="button-indicator"></span>
                                              </div>
                                            </div>
                                          </label>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )
                        }
                        return <p className="text-sm text-muted-foreground text-center py-4">No social media platforms are globally configured.</p>
                      })()}
                    </div>
                  </div>

                  {/* Published Posts */}
                  {(() => {
                    const publishedPosts = getArticleSocialMediaPosts(viewArticle)
                    if (publishedPosts.length > 0) {
                      return (
                        <div className="rounded-lg border overflow-hidden bg-background shadow-sm">
                          <div className="px-4 py-3 border-b bg-muted/40 font-medium"><Globe className="h-4 w-4 inline mr-2" /> Published Posts</div>
                          <div className="p-4 space-y-3">
                            {publishedPosts.map((post, pIdx) => (
                              <SocialPostItem key={post.id || `${post.platform}-${pIdx}`} post={post} socialMediaPlatforms={socialMediaPlatforms} article={viewArticle} />
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-8 py-4 border-t bg-muted/20 flex items-center justify-between flex-none">
            <div className="hidden sm:block text-xs text-muted-foreground italic font-medium">
              <Globe className="h-3 w-3 inline mr-1 text-primary" /> Multi-platform publishing enabled.
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsViewOpen(false)} className="sm:px-8">Close</Button>
              {viewArticle && !isArticlePublished(viewArticle.article_status) && (
                <Button variant="secondary" onClick={() => { setIsViewOpen(false); handleOpenDialog(viewArticle!); }} className="sm:px-8 border shadow-sm">
                  <Edit className="h-4 w-4 mr-2" /> Edit Article
                </Button>
              )}
              {viewArticle && (!isArticlePublished(viewArticle.article_status) || getArticleSocialMedia(viewArticle).some(sm => sm.status === 'active')) && (
                <Button onClick={() => handlePublishArticle(viewArticle)} disabled={isPublishing} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-primary-foreground sm:px-8 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                  {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Publish Now
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Article Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${selectedArticle?.article_title}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default Articles