"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { LinkCard } from "./link-card"
import { SearchBar } from "./search-bar"
import { FilterBar } from "./filter-bar"

interface DashboardContentProps {
  userId: string
}

export function DashboardContent({ userId }: DashboardContentProps) {
  const [links, setLinks] = useState<any[]>([])
  const [filteredLinks, setFilteredLinks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLinks()
  }, [userId])

  useEffect(() => {
    filterLinks()
  }, [links, searchQuery, selectedCategory, selectedTags, showFavoritesOnly])

  const loadLinks = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("links")
      .select(
        `
        *,
        category:categories(id, name, color),
        link_tags(tag:tags(id, name))
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching links:", error)
    } else if (data) {
      const formattedLinks = data.map((link) => ({
        ...link,
        tags: link.link_tags?.map((lt: any) => lt.tag) || [],
      }))
      setLinks(formattedLinks)
      setFilteredLinks(formattedLinks)
    }
    setIsLoading(false)
  }

  const filterLinks = () => {
    let filtered = [...links]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (link) =>
          link.title.toLowerCase().includes(query) ||
          link.description?.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((link) => link.category?.id === selectedCategory)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((link) => link.tags.some((tag: any) => selectedTags.includes(tag.id)))
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((link) => link.is_favorite)
    }

    setFilteredLinks(filtered)
  }

  const handleRefresh = () => {
    loadLinks()
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FilterBar
        userId={userId}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={setShowFavoritesOnly}
      />
      {filteredLinks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">{links.length === 0 ? "No links yet" : "No links match your filters"}</p>
          <p className="text-sm text-muted-foreground">
            {links.length === 0 ? 'Click the "Add Link" button to get started' : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} onUpdate={handleRefresh} />
          ))}
        </div>
      )}
    </div>
  )
}
