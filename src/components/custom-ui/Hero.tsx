import { ArrowUpRight, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroTile } from "@/components/custom-ui/HeroTile"
import { config } from "@/lib/config"

/**
 * Opening section: what the playground is, the two ways in, and the tile.
 *
 * @returns {JSX.Element} Hero section.
 */
export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 pt-16 pb-20">
            <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="relative mx-auto max-w-[1400px] text-center">
                <h1 className="mx-auto max-w-[20ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Neuronale Netze entwickeln, trainieren und verstehen.
                </h1>

                <p className="mx-auto mt-6 max-w-[56ch] text-pretty text-muted-foreground sm:text-lg">
                    Der Model Playground ist eine Zeichenfläche für neuronale Netze:
                    Schichten zusammenstecken, auf echten Datensätzen trainieren, dem
                    Modell beim Lernen zusehen. Alles im Browser, ohne Installation und
                    ohne Konto.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button size="lg" asChild>
                        <a href={config.playgroundUrl} target="_blank">
                            <Play />
                            Model Playground öffnen
                        </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href={config.docsUrl} target="_blank">
                            Zur Dokumentation
                            <ArrowUpRight />
                        </a>
                    </Button>
                </div>

                <HeroTile />
            </div>
        </section>
    )
}
