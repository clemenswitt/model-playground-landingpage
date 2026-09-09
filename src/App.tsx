import { useRef } from "react"

import { FeatureRows } from "@/components/custom-ui/FeatureRows"
import { Hero } from "@/components/custom-ui/Hero"
import { LandingFooter } from "@/components/custom-ui/LandingFooter"
import { LandingHeader } from "@/components/custom-ui/LandingHeader"
import { TaskCarousel } from "@/components/custom-ui/TaskCarousel"

/**
 * Application root: one page, composed of its sections.
 *
 * There is no router. The page has a single address; the imprint, the only
 * other thing to read, opens as a dialog over it.
 *
 * @returns {JSX.Element} The landing page.
 */
export default function App() {
    const brand = useRef<HTMLDivElement>(null)

    return (
        <div className="flex min-h-svh flex-col bg-background">
            <LandingHeader brand={brand} />
            <main className="flex-1">
                <Hero brand={brand} />
                <FeatureRows />
                <TaskCarousel />
            </main>
            <LandingFooter />
        </div>
    )
}
