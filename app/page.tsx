import { Button } from "@/components/ui/button"
import { BookmarkIcon, FolderIcon, SearchIcon, TagIcon } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">DevLink Vault</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Organize Your Developer Resources</h2>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Save, categorize, and search through your favorite development links, documentation, and tools all in one
            place
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Start Organizing Free</Link>
          </Button>
        </section>

        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold">Features</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <BookmarkIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 text-xl font-semibold">Save Links</h4>
                <p className="text-muted-foreground">
                  Quickly save important development resources with title and description
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <FolderIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 text-xl font-semibold">Organize by Category</h4>
                <p className="text-muted-foreground">Create custom categories to keep your resources organized</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <TagIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 text-xl font-semibold">Tag Everything</h4>
                <p className="text-muted-foreground">Use tags for flexible organization and easy filtering</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 text-xl font-semibold">Powerful Search</h4>
                <p className="text-muted-foreground">Find any resource instantly with advanced search</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>DevLink Vault - Your Personal Developer Resource Manager</p>
        </div>
      </footer>
    </div>
  )
}
