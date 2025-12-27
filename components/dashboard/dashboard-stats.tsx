import { createClient } from "@/lib/supabase/server"
import { Bookmark, Folder, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  const [linksCount, categoriesCount, tagsCount] = await Promise.all([
    supabase.from("links").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("tags").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ])

  const stats = [
    {
      label: "Total Links",
      value: linksCount.count || 0,
      icon: Bookmark,
    },
    {
      label: "Categories",
      value: categoriesCount.count || 0,
      icon: Folder,
    },
    {
      label: "Tags",
      value: tagsCount.count || 0,
      icon: Tag,
    },
  ]

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
