"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Heart, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { EditLinkDialog } from "./edit-link-dialog"

interface LinkCardProps {
  link: {
    id: string
    title: string
    url: string
    description: string | null
    is_favorite: boolean
    created_at: string
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
  onUpdate?: () => void
}

export function LinkCard({ link, onUpdate }: LinkCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)

  const toggleFavorite = async () => {
    setIsFavoriting(true)
    const supabase = createClient()
    await supabase.from("links").update({ is_favorite: !link.is_favorite }).eq("id", link.id)
    setIsFavoriting(false)
    onUpdate?.()
  }

  const deleteLink = async () => {
    if (!confirm("Are you sure you want to delete this link?")) return

    setIsDeleting(true)
    const supabase = createClient()
    await supabase.from("links").delete().eq("id", link.id)
    onUpdate?.()
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">{link.title}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFavorite} disabled={isFavoriting}>
                <Heart
                  className={`h-4 w-4 ${link.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={deleteLink} disabled={isDeleting} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {link.description && <CardDescription className="line-clamp-2 text-sm">{link.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="line-clamp-1">{link.url}</span>
          </a>
          {link.category && (
            <Badge variant="outline" style={{ borderColor: link.category.color, color: link.category.color }}>
              {link.category.name}
            </Badge>
          )}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {link.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <EditLinkDialog link={link} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  )
}
