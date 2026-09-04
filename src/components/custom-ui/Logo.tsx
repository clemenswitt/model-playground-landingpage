import { BrainCog } from "lucide-react"

import { config } from "@/lib/config"

/**
 * Brand block of the site: the Model Playground mark and its wordmark.
 *
 * Mark, spacing, type size and width are those of the logo in the playground
 * itself, so the three sites carry one brand. The canvas panel the playground
 * wraps around it is left out — here the header already provides the surface.
 *
 * The wordmark is written out at every width: on narrow screens the header
 * drops its two jump-off links instead, which leaves the full title room.
 *
 * @returns {JSX.Element} Link to the start page, showing mark and wordmark.
 */
export function Logo() {
    return (
        <a
            href="/"
            className="flex items-center gap-3 whitespace-nowrap text-xl font-stretch-110%"
        >
            <BrainCog className="size-6 shrink-0" />
            <span>{config.site.title}</span>
        </a>
    )
}
