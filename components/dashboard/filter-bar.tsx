"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface FilterBarProps {
  userId: string
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  selectedTags: string[]
  onTagsChange: (tagIds: string[]) => void
  showFavoritesOnly: boolean
  onFavoritesToggle: (show: boolean) => void
}

export function FilterBar({
  userId,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  showFavoritesOnly,
  onFavoritesToggle,
}: FilterBarProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    loadFilters()
  }, [userId])

  const loadFilters = async () => {
    const supabase = createClient()
    const [categoriesRes, tagsRes] = await Promise.all([
      supabase.from("categories").select("*").eq("user_id", userId).order("name"),
      supabase.from("tags").select("*").eq("user_id", userId).order("name"),
    ])

    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (tagsRes.data) setTags(tagsRes.data)
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const clearAllFilters = () => {
    onCategoryChange(null)
    onTagsChange([])
    onFavoritesToggle(false)
  }

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || showFavoritesOnly

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => onFavoritesToggle(!showFavoritesOnly)}
        >
          <Heart className={`mr-2 h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
          Favorites
        </Button>

        <Select value={selectedCategory || "all"} onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
              {selectedTags.includes(tag.id) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
