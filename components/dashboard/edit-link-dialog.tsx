"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface EditLinkDialogProps {
  link: {
    id: string
    title: string
    url: string
    description: string | null
    category: {
      id: string
      name: string
      color: string
    } | null
    tags: Array<{
      id: string
      name: string
    }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLinkDialog({ link, open, onOpenChange }: EditLinkDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(link.tags.map((t) => t.id))
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url,
    description: link.description || "",
    categoryId: link.category?.id || "",
  })

  useEffect(() => {
    if (open) {
      loadCategoriesAndTags()
      setSelectedTags(link.tags.map((t) => t.id))
    }
  }, [open, link.tags])

  const loadCategoriesAndTags = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const [categoriesRes, tagsRes] = await Promise.all([
      supabase.from("categories").select("*").eq("user_id", user.id).order("name"),
      supabase.from("tags").select("*").eq("user_id", user.id).order("name"),
    ])

    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (tagsRes.data) setTags(tagsRes.data)
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("tags")
      .insert({ user_id: user.id, name: newTag.trim() })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating tag:", error)
      return
    }

    if (data) {
      setTags([...tags, data])
      setSelectedTags([...selectedTags, data.id])
      setNewTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from("links")
      .update({
        title: formData.title,
        url: formData.url,
        description: formData.description || null,
        category_id: formData.categoryId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", link.id)

    if (updateError) {
      console.error("[v0] Error updating link:", updateError)
      alert("Failed to update link")
      setIsLoading(false)
      return
    }

    await supabase.from("link_tags").delete().eq("link_id", link.id)

    if (selectedTags.length > 0) {
      const tagInserts = selectedTags.map((tagId) => ({
        link_id: link.id,
        tag_id: tagId,
      }))
      await supabase.from("link_tags").insert(tagInserts)
    }

    setIsLoading(false)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>Update your resource details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="e.g., React Documentation"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Brief description of the resource"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category (optional)</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTags(
                      selectedTags.includes(tag.id)
                        ? selectedTags.filter((id) => id !== tag.id)
                        : [...selectedTags, tag.id],
                    )
                  }}
                >
                  {tag.name}
                  {selectedTags.includes(tag.id) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
