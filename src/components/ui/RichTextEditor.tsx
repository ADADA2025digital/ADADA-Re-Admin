// src/components/ui/RichTextEditor.tsx
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Undo,
  Redo,
  Link
} from 'lucide-react'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './dialog'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className,
  minHeight = '300px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const isInternalChange = useRef(false)
  const isUpdatingFromProp = useRef(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)

  // Initialize editor content when component mounts or value changes from outside
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      isUpdatingFromProp.current = true
      // Only update if content is different to avoid cursor jumps
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || ''
      }
      isUpdatingFromProp.current = false
    }
    // Reset internal change flag after update
    isInternalChange.current = false
  }, [value])

  // Initialize history when component mounts
  useEffect(() => {
    if (editorRef.current && value && history.length === 0) {
      setHistory([value])
      setHistoryIndex(0)
    }
  }, [])

  const saveToHistory = useCallback((content: string) => {
    if (history[historyIndex] === content) return
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(content)
    if (newHistory.length > 50) newHistory.shift()
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const handleInput = useCallback(() => {
    if (editorRef.current && !isUpdatingFromProp.current) {
      const content = editorRef.current.innerHTML
      isInternalChange.current = true
      onChange(content)
      saveToHistory(content)
    }
  }, [onChange, saveToHistory])

  const undo = () => {
    if (historyIndex > 0 && editorRef.current) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      isUpdatingFromProp.current = true
      editorRef.current.innerHTML = content
      onChange(content)
      setTimeout(() => {
        isUpdatingFromProp.current = false
      }, 0)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      isUpdatingFromProp.current = true
      editorRef.current.innerHTML = content
      onChange(content)
      setTimeout(() => {
        isUpdatingFromProp.current = false
      }, 0)
    }
  }
  
  const insertLink = useCallback(() => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0).cloneRange())
        setLinkUrl('')
        setIsLinkDialogOpen(true)
      } else {
        alert('Please select some text first')
      }
    }
  }, [])

  const handleLinkSubmit = () => {
    if (savedSelection && editorRef.current) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelection)
        
        document.execCommand('createLink', false, linkUrl || '#')
        handleInput()
      }
    }
    setIsLinkDialogOpen(false)
    setSavedSelection(null)
  }

  const execCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, value || '')
      handleInput()
    }
  }, [handleInput])

  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', `<${tag}>`)
  }, [execCommand])

  const ToolbarButton = ({ 
    onClick, 
    disabled = false,
    children 
  }: { 
    onClick: (e: React.MouseEvent) => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode 
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  const Divider = () => <div className="w-px h-6 bg-border mx-1" />

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden bg-background transition-colors duration-200", 
      isTyping ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
      className
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 sticky top-0 z-10">
        <ToolbarButton onClick={() => formatBlock('H1')}>
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock('H2')}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock('H3')}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock('H4')}>
          <Heading4 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock('H5')}>
          <Heading5 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock('H6')}>
          <Heading6 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')}>
          <u className="h-4 w-4">U</u>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('strikeThrough')}>
          <s className="h-4 w-4">S</s>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => execCommand('justifyLeft')}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyCenter')}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyRight')}>
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={insertLink}>
          <Link className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={undo} disabled={historyIndex <= 0}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={redo} disabled={historyIndex >= history.length - 1}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content - FIXED: No dangerouslySetInnerHTML */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={() => setIsTyping(false)}
        onFocus={() => setIsTyping(true)}
        className={cn(
          "p-4 outline-none overflow-y-auto prose prose-sm max-w-none focus:ring-0 editor-content",
          "prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-h4:text-lg prose-h5:text-base prose-h6:text-sm",
          "prose-p:my-2 prose-ul:my-2 prose-ol:my-2",
          "prose-li:my-0 prose-img:rounded-lg prose-img:shadow-md",
          "prose-a:text-primary prose-a:underline prose-code:bg-muted prose-code:px-1 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto"
        )}
        style={{ 
          minHeight,
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'normal'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        .editor-content {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: normal !important;
          color: hsl(var(--foreground)) !important;
        }
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        .editor-content:focus {
          outline: none;
        }
        .editor-content h1, 
        .editor-content h2, 
        .editor-content h3, 
        .editor-content h4, 
        .editor-content h5, 
        .editor-content h6,
        .editor-content p,
        .editor-content div,
        .editor-content span,
        .editor-content li,
        .editor-content blockquote,
        .editor-content pre,
        .editor-content code {
          color: hsl(var(--foreground)) !important;
        }
        .editor-content ul, 
        .editor-content ol { 
          padding-left: 1.5rem !important; 
          margin: 0.5rem 0 1rem 0 !important;
        }
        .editor-content li { 
          display: list-item !important;
          margin: 0.25rem 0 !important;
        }
        .editor-content blockquote { 
          border-left: 4px solid hsl(var(--border)); 
          padding-left: 1rem; 
          font-style: italic; 
          margin: 1rem 0;
        }
        .editor-content pre { 
          background: hsl(var(--muted)); 
          padding: 1rem; 
          border-radius: 0.5rem; 
          overflow-x: auto; 
          margin: 1rem 0;
        }
        .editor-content img { 
          max-width: 100%; 
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .editor-content a { 
          color: hsl(var(--primary)) !important; 
          text-decoration: underline;
        }
      `}</style>

      {/* URL Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background border-primary/20 shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Insert Hyperlink
            </DialogTitle>
            <DialogDescription>
              Enter the URL you want to link the selected text to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold">Web Address (URL)</Label>
              <Input 
                id="url" 
                placeholder="https://example.com" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleLinkSubmit()
                  }
                }}
                className="bg-muted/50 border-primary/10"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleLinkSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}