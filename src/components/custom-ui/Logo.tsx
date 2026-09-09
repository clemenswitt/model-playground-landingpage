import LogoMark from "@/assets/logo.svg?react"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"

/**
 * Brand block of the site: the Model Playground mark and its wordmark.
 *
 * `logo.svg` is the file the playground itself uses, imported as a component so
 * its `currentColor` follows the text colour into dark mode — an `<img>` would
 * stay black. It also serves as the favicon, from `index.html`.
 *
 * Mark size, spacing and type size are those of the logo in the playground, so
 * the three sites carry one brand. The canvas panel the playground wraps around
 * it is left out — here the header already provides the surface.
 *
 * The wordmark stays at every width; the header holds it alongside the two
 * jump-off links.
 *
 * @param {object} props Component props.
 * @param {string} [props.className] Extra classes, e.g. the smaller type size
 *   the brand chip sets.
 * @returns {JSX.Element} Link to the start page, showing mark and wordmark.
 */
export function Logo({ className }: { className?: string }) {
    return (
        <a
            href="/"
            className={cn(
                "flex items-center gap-[0.6em] whitespace-nowrap text-xl font-stretch-110%",
                className,
            )}
        >
            <LogoMark className="h-[1.4em] w-auto shrink-0 aspect-45/32" />
            <span className="select-none">{config.site.title}</span>
        </a>
    )
}
