import { createClient } from "@/lib/supabase/server"
import { LinkCard } from "./link-card"

interface LinksListProps {
  userId: string
}

export async function LinksList({ userId }: LinksListProps) {
  const supabase = await createClient()

  const { data: links, error } = await supabase
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
    return <div className="text-center text-muted-foreground">Error loading links</div>
  }

  if (!links || links.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">No links yet</p>
        <p className="text-sm text-muted-foreground">Click the &quot;Add Link&quot; button to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={{
            ...link,
            tags: link.link_tags?.map((lt: any) => lt.tag) || [],
          }}
        />
      ))}
    </div>
  )
}
