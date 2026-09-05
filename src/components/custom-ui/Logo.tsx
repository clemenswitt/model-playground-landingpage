import LogoMark from "@/assets/logo.svg?react"
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
 * Only the wordmark gives way: below the `sm` breakpoint the short title takes
 * its place, because the header still has to hold the two jump-off links.
 *
 * @returns {JSX.Element} Link to the start page, showing mark and wordmark.
 */
export function Logo() {
    return (
        <a
            href="/"
            className="flex items-center gap-3 whitespace-nowrap text-xl font-stretch-110%"
        >
            <LogoMark className="h-7 w-auto shrink-0 aspect-45/32" />
            <span className="hidden select-none sm:inline">{config.site.title}</span>
            <span className="select-none sm:hidden">{config.site.shortTitle}</span>
        </a>
    )
}
