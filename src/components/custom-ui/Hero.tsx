import { ArrowUpRight, Check, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroTile } from "@/components/custom-ui/HeroTile"
import { RotatingText } from "@/components/custom-ui/RotatingText"
import { config } from "@/lib/config"

/**
 * Opening section: what the playground is, the two ways in, and the tile.
 *
 * The copy here follows the house rules the docs and the exercise material are
 * held to (`_arbeit/docs-stilregeln.md` and its base document), because a
 * landing page that advertises in a different voice than the thing it links to
 * reads as written by someone else. Those rules rule out most of what a claim
 * normally reaches for: no Dreierfiguren of synonyms, no headline built on a
 * negation or a "X statt Y" contrast, no label-plus-colon punchline, no em
 * dash, no anthropomorphism, and none of the vocabulary of advertising. What is
 * left is the device the rules do encourage, which is understatement: name the
 * thing plainly and let the modesty of the means carry the surprise.
 *
 * Between headline and buttons stand two lines rather than a paragraph. What
 * the tile below shows within a second of loading, no sentence describes
 * faster, and the four rows further down say what the views are for. What is
 * left is what neither of them can carry: the three conditions that decide
 * whether a teacher can use this in a lesson at all, and the invitation under
 * them. The conditions take turns in the upper line, which puts each of them in
 * front of a reader who would have skimmed a list of three.
 *
 * @returns {JSX.Element} Hero section.
 */
export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 pt-16 pb-20">
            <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="relative mx-auto max-w-[1400px] text-center">
                <h1 className="mx-auto max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Neuronale Netze entwerfen, trainieren und testen.
                </h1>

                <p className="mt-6 text-muted-foreground sm:text-xl">
                    <span className="bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-5 py-2 text-lg font-medium shadow-sm sm:text-xl">
                        <Check className="text-muted-foreground size-5" />
                        <RotatingText
                            items={[
                                "Kein Code.",
                                "Keine Installation.",
                                "Keine Anmeldung.",
                            ]}
                        />
                    </span>
                    <span className="mt-4 block">Direkt im Browser loslegen.</span>
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button size="lg" asChild>
                        <a href={config.playgroundUrl} target="_blank">
                            <Play />
                            Model Playground starten
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
