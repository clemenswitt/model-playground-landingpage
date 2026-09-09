import type { Ref } from "react"

import { Logo } from "@/components/custom-ui/Logo"

/**
 * The logo as a chip, standing at the head of the hero.
 *
 * @param {object} props Component props.
 * @param {Ref<HTMLDivElement>} [props.ref] Handle for the header's observer.
 * @returns {JSX.Element} The chip.
 */
export function BrandPill({ ref }: { ref?: Ref<HTMLDivElement> }) {
    return (
        <div
            ref={ref}
            className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-3.5 py-1.5 shadow-sm"
        >
            <Logo className="text-sm sm:text-base" />
        </div>
    )
}
