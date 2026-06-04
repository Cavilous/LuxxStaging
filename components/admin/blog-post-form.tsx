"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Quote, Minus, Eye, Edit2, X, Search, Underline, AlignLeft, AlignCenter, AlignRight, Upload, Loader2 } from "lucide-react"
import DOMPurify from "dompurify"
import { toast } from "sonner"

interface BlogPostFormProps {
  action: (formData: FormData) => Promise<void>
  initialData?: {
    id?: string
    title?: string
    content?: string
    excerpt?: string
    featuredImage?: string | null
    category?: string | null
    metaTitle?: string | null
    metaDescription?: string | null
    author?: string | null
    isPublished?: boolean
  }
}

export function BlogPostForm({ action, initialData }: BlogPostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [author, setAuthor] = useState(initialData?.author || "Luxx Miami")
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && initialData?.content) {
      const sanitizedContent = DOMPurify.sanitize(initialData.content, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'figure', 'figcaption', 'hr', 'div', 'span'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
      })
      editorRef.current.innerHTML = sanitizedContent
    }
  }, [initialData?.content])

  const execCommand = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }, [])

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
  }, [])

  const formatBlock = useCallback((tag: string) => {
    document.execCommand('formatBlock', false, tag)
    editorRef.current?.focus()
    updateContent()
  }, [updateContent])

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand('createLink', url)
    }
  }, [execCommand])

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand('insertImage', url)
    }
  }, [execCommand])

  const toolbarButtons = [
    { icon: Bold, action: () => execCommand('bold'), title: "Bold (Ctrl+B)" },
    { icon: Italic, action: () => execCommand('italic'), title: "Italic (Ctrl+I)" },
    { icon: Underline, action: () => execCommand('underline'), title: "Underline (Ctrl+U)" },
    { divider: true },
    { icon: Heading1, action: () => formatBlock('h1'), title: "Heading 1" },
    { icon: Heading2, action: () => formatBlock('h2'), title: "Heading 2" },
    { icon: Heading3, action: () => formatBlock('h3'), title: "Heading 3" },
    { divider: true },
    { icon: List, action: () => execCommand('insertUnorderedList'), title: "Bullet List" },
    { icon: ListOrdered, action: () => execCommand('insertOrderedList'), title: "Numbered List" },
    { icon: Quote, action: () => formatBlock('blockquote'), title: "Quote" },
    { divider: true },
    { icon: AlignLeft, action: () => execCommand('justifyLeft'), title: "Align Left" },
    { icon: AlignCenter, action: () => execCommand('justifyCenter'), title: "Align Center" },
    { icon: AlignRight, action: () => execCommand('justifyRight'), title: "Align Right" },
    { divider: true },
    { icon: LinkIcon, action: insertLink, title: "Insert Link" },
    { icon: ImageIcon, action: insertImage, title: "Insert Image" },
    { icon: Minus, action: () => execCommand('insertHorizontalRule'), title: "Horizontal Rule" },
  ]

  const sanitizeHtml = useCallback((html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'figure', 'figcaption', 'hr', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button', 'object', 'embed'],
      FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
    })
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const html = e.clipboardData.getData('text/html')
    const text = e.clipboardData.getData('text/plain')
    
    if (html) {
      const cleanHtml = sanitizeHtml(html)
      document.execCommand('insertHTML', false, cleanHtml)
    } else {
      document.execCommand('insertText', false, text)
    }
    updateContent()
  }, [updateContent, sanitizeHtml])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      setFeaturedImage(data.url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    if (initialData?.id) formData.append("id", initialData.id)
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("featuredImage", featuredImage)
    formData.append("category", category)
    formData.append("metaTitle", metaTitle)
    formData.append("metaDescription", metaDescription)
    formData.append("author", author)
    formData.append("isPublished", isPublished.toString())

    await action(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="bg-[#0A0A0A] border-[#333333] text-white text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-gray-300">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post..."
                  className="bg-[#0A0A0A] border-[#333333] text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Content</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={activeTab === "edit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("edit")}
                      className={activeTab === "edit" ? "bg-[#ECAC36] text-black" : "border-[#333333] text-gray-300"}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant={activeTab === "preview" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("preview")}
                      className={activeTab === "preview" ? "bg-[#ECAC36] text-black" : "border-[#333333] text-gray-300"}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>

                {activeTab === "edit" && (
                  <div className="flex flex-wrap gap-1 p-2 bg-[#0A0A0A] border border-[#333333] border-b-0 rounded-t">
                    {toolbarButtons.map((btn, idx) => (
                      'divider' in btn ? (
                        <div key={idx} className="w-px h-6 bg-[#333333] mx-1 self-center" />
                      ) : (
                        <Button
                          key={idx}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={btn.action}
                          title={btn.title}
                          className="text-gray-400 hover:text-white hover:bg-[#222222] h-8 w-8 p-0"
                        >
                          <btn.icon className="h-4 w-4" />
                        </Button>
                      )
                    ))}
                  </div>
                )}

                {activeTab === "edit" ? (
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={updateContent}
                    onPaste={handlePaste}
                    className="bg-[#0A0A0A] border border-[#333333] text-white min-h-[400px] p-4 rounded-b focus:outline-none focus:ring-2 focus:ring-[#ECAC36] overflow-auto rich-text-editor"
                    style={{ lineHeight: 1.6 }}
                    suppressContentEditableWarning
                  />
                ) : (
                  <div 
                    className="bg-[#0A0A0A] border border-[#333333] rounded p-6 min-h-[400px] overflow-auto blog-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                  />
                )}
                <p className="text-xs text-gray-500">Rich text editor - paste formatted content or use toolbar to format</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished" className="text-gray-300">Published</Label>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
              >
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Post" : "Create Post"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage && (
                <div className="relative aspect-video rounded overflow-hidden">
                  <img src={featuredImage} alt="Featured" className="object-cover w-full h-full" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!featuredImage && (
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 bg-[#0A0A0A]">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-3">
                      <Label htmlFor="featured-image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 text-[#ECAC36] hover:text-[#d4a030] transition-colors">
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Image
                            </>
                          )}
                        </div>
                      </Label>
                      <input
                        ref={fileInputRef}
                        id="featured-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Max 50MB • JPG, PNG, WebP, GIF</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Or enter image URL</Label>
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="bg-[#0A0A0A] border-[#333333] text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Lifestyle, Travel, Tips"
                  className="bg-[#0A0A0A] border-[#333333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-gray-300">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="bg-[#0A0A0A] border-[#333333] text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-gray-300">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title (defaults to post title)"
                  className="bg-[#0A0A0A] border-[#333333] text-white"
                />
                <p className="text-xs text-gray-500">{metaTitle.length || title.length}/60 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-gray-300">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO description (defaults to excerpt)"
                  className="bg-[#0A0A0A] border-[#333333] text-white resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500">{metaDescription.length || excerpt.length}/160 characters</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .rich-text-editor:empty:before {
          content: "Write your post content here or paste formatted text...";
          color: #666;
        }
        .rich-text-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          color: white;
        }
        .rich-text-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
          color: white;
        }
        .rich-text-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
          color: white;
        }
        .rich-text-editor p {
          margin: 1em 0;
          color: #d1d5db;
        }
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 1em 0;
          padding-left: 2em;
          color: #d1d5db;
        }
        .rich-text-editor ul {
          list-style-type: disc;
        }
        .rich-text-editor ol {
          list-style-type: decimal;
        }
        .rich-text-editor blockquote {
          border-left: 4px solid #ECAC36;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #9ca3af;
        }
        .rich-text-editor a {
          color: #ECAC36;
          text-decoration: underline;
        }
        .rich-text-editor img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 8px;
        }
        .rich-text-editor hr {
          border: none;
          border-top: 1px solid #333;
          margin: 2em 0;
        }
        .rich-text-editor strong, .rich-text-editor b {
          font-weight: bold;
        }
        .rich-text-editor em, .rich-text-editor i {
          font-style: italic;
        }
        .rich-text-editor u {
          text-decoration: underline;
        }
      `}</style>
    </form>
  )
}
