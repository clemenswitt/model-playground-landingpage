import { BrainCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/custom-ui/ThemeToggle"
import { config } from "@/lib/config"

/**
 * Sticky top bar: brand, the two jump-off links and the theme toggle.
 *
 * The links repeat what the hero already offers — they exist for the reader who
 * has scrolled past it. Long labels give way to short ones on narrow screens,
 * the same staircase the docs header uses.
 *
 * @returns {JSX.Element} Header bar.
 */
export function LandingHeader() {
    return (
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-1 px-4">
                <a
                    href="/"
                    className="flex items-center gap-2 font-medium whitespace-nowrap font-stretch-110%"
                >
                    <BrainCog className="size-5 shrink-0" />
                    <span className="hidden sm:inline">{config.site.title}</span>
                    <span className="sm:hidden">{config.site.shortTitle}</span>
                </a>

                <nav aria-label="Projekte" className="ml-auto flex items-center">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.playgroundUrl}>Playground</a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.docsUrl}>
                            <span className="hidden sm:inline">Dokumentation</span>
                            <span className="sm:hidden">Docs</span>
                        </a>
                    </Button>
                </nav>

                <ThemeToggle />
            </div>
        </header>
    )
}
