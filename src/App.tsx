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
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <LandingHeader />
            <main className="flex-1">
                <Hero />
                <FeatureRows />
                <TaskCarousel />
            </main>
            <LandingFooter />
        </div>
    )
}
