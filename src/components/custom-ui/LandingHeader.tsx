import { Button } from "@/components/ui/button"
import { Logo } from "@/components/custom-ui/Logo"
import { ThemeToggle } from "@/components/custom-ui/ThemeToggle"
import { config } from "@/lib/config"

/**
 * Sticky top bar: brand, the two jump-off links and the theme toggle.
 *
 * The links repeat what the hero already offers — they exist for the reader who
 * has scrolled past it. Below the `sm` breakpoint they step aside entirely: the
 * hero sits close enough on a phone, and the room goes to the full wordmark.
 * Only the theme toggle stays.
 *
 * @returns {JSX.Element} Header bar.
 */
export function LandingHeader() {
    return (
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-1 px-4">
                <Logo />

                <nav
                    aria-label="Projekte"
                    className="ml-auto hidden items-center sm:flex"
                >
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.playgroundUrl}>Playground</a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.docsUrl}>Dokumentation</a>
                    </Button>
                </nav>

                <ThemeToggle className="ml-auto sm:ml-0" />
            </div>
        </header>
    )
}
