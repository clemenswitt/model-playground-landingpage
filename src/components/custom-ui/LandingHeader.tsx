import { useEffect, useState, type RefObject } from "react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/custom-ui/Logo"
import { ThemeToggle } from "@/components/custom-ui/ThemeToggle"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"

/**
 * Top bar: brand, the two jump-off links and the theme toggle.
 *
 * The links repeat what the hero already offers — they exist for the reader who
 * has scrolled past it. Below the `sm` breakpoint they step aside entirely: the
 * hero sits close enough on a phone, and the room goes to the full wordmark.
 * Only the theme toggle stays.
 *
 * @param {object} props Component props.
 * @param {RefObject<HTMLDivElement | null>} props.brand The hero's brand chip,
 *   whose presence on screen decides whether the bar shows.
 * @returns {JSX.Element} Header bar.
 */
export function LandingHeader({
    brand,
}: {
    brand: RefObject<HTMLDivElement | null>
}) {
    const [shown, setShown] = useState(false)

    useEffect(() => {
        // The hero renders the chip and React sets refs before effects run, so
        // there is one by now. Were there none, the bar would stay away — a
        // header that never appears rather than one that appears too early.
        const chip = brand.current
        if (!chip) return

        const observer = new IntersectionObserver(([entry]) =>
            setShown(!entry.isIntersecting),
        )
        observer.observe(chip)
        return () => observer.disconnect()
    }, [brand])

    return (
        <header
            inert={!shown}
            className={cn(
                "bg-background/85 fixed inset-x-0 top-0 z-30 border-b backdrop-blur-sm",
                "transition duration-300 ease-out motion-reduce:transition-none",
                shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
            )}
        >
            <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-1 px-4">
                <Logo />

                <nav
                    aria-label="Projekte"
                    className="ml-auto hidden items-center sm:flex"
                >
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.playgroundUrl} target="_blank">Playground</a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <a href={config.docsUrl} target="_blank">Dokumentation</a>
                    </Button>
                </nav>

                <ThemeToggle className="ml-auto sm:ml-0" />
            </div>
        </header>
    )
}
