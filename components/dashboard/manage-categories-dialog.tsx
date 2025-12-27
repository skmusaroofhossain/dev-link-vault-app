"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ManageCategoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

const COLOR_OPTIONS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
]

export function ManageCategoriesDialog({ open, onOpenChange, userId }: ManageCategoriesDialogProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [newCategory, setNewCategory] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("categories").select("*").eq("user_id", userId).order("name")
    if (data) setCategories(data)
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: userId, name: newCategory.trim(), color: selectedColor })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating category:", error)
      alert("Failed to create category")
    } else if (data) {
      setCategories([...categories, data])
      setNewCategory("")
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Links will not be deleted.")) return

    const supabase = createClient()
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting category:", error)
      alert("Failed to delete category")
    } else {
      setCategories(categories.filter((c) => c.id !== id))
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>Create and organize your link categories</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Add New Category</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
              />
              <Button onClick={handleAddCategory} disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border p-2">
                    <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                      {category.name}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
