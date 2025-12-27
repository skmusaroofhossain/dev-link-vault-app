"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Plus, FolderOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { AddLinkDialog } from "./add-link-dialog"
import { ManageCategoriesDialog } from "./manage-categories-dialog"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">DevLink Vault</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsCategoriesDialogOpen(true)}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>
      <AddLinkDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} userId={user.id} />
      <ManageCategoriesDialog open={isCategoriesDialogOpen} onOpenChange={setIsCategoriesDialogOpen} userId={user.id} />
    </>
  )
}
