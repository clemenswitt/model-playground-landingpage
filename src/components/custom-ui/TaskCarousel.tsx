import { useEffect, useRef, useState } from "react"
import { ArrowRight, ArrowUpRight, ArrowUpRightSquare, ChevronLeft, ChevronRight, MoveUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { config } from "@/lib/config"

/** Difficulty, as the material itself grades it. */
type Level = "leicht" | "mittel" | "fortgeschritten"

/**
 * One exercise per Schwerpunkt, as a way in.
 *
 * The list is kept by hand. The material lives in another repository, private
 * and not yet published, so there is nothing to read at build time that would
 * not tie this build to a checkout of that one.
 *
 * Title, level and text are therefore copies, taken word for word from the
 * article's front matter — `title`, `level` and `description`. Kept that way,
 * a card can be checked against its source by comparing the two strings, and
 * a rewrite over there is carried over here without being reworded twice.
 */
const EXERCISES: { route: string; title: string; level: Level; text: string }[] = [
    {
        route: "/material/grundlagen/vollverbundenes-netz-ziffern",
        title: "Ein neuronales Netz für handgeschriebene Ziffern",
        level: "leicht",
        text: "Regeln für die Erkennung handgeschriebener Ziffern lassen sich von Hand formulieren, geraten aber an jeder Handschrift ins Wanken, die eine ihrer Annahmen verletzt. Ein neuronales Netz gewinnt die Unterscheidung stattdessen aus beschrifteten Beispielen. Der einfachste Aufbau dafür ist ein vollverbundenes Netz auf den eingeebneten Bildpunkten; offen bleibt, wie breit seine verdeckte Schicht sein muss. Wir konstruieren ein solches Netz auf dem MNIST-Datensatz, messen vier Breiten von keiner bis 64 Neuronen über je mehrere Läufe und entscheiden anhand der Spannen, welcher Unterschied belegt ist und welcher im Rauschen liegt.",
    },
    {
        route: "/material/grundlagen/netz-fuer-tabellendaten",
        title: "Ein neuronales Netz für Tabellendaten",
        level: "leicht",
        text: "Bei Tabellendaten ist ein Beispiel eine Reihe benannter Zahlen statt eines Rasters von Bildpunkten. Am Iris-Datensatz bauen wir ein neuronales Netz auf, das mit zwei vollverbundenen Schichten auskommt. Mithilfe des Inferenzpanels verändern wir anschließend einzelne Merkmale und finden heraus, an welchem von ihnen die Zuordnung am stärksten hängt.",
    },
    {
        route: "/material/modellstruktur/faltung-statt-einebnen",
        title: "Faltungsschicht statt Einebnen bei Farbfotos",
        level: "mittel",
        text: "Ein Netz, das die Bildpunkte sofort einebnet und in vollverbundene Schichten gibt, lässt auf Farbfotos ganze Klassen in der Wahrheitsmatrix leer. Wir stellen auf CIFAR-10 und auf einem Zwei-Klassen-Fotodatensatz je ein flaches und ein gefaltetes Modell gegenüber, halten dabei alle Trainingsparameter fest und führen den Unterschied auf die beim Einebnen verlorene räumliche Anordnung der Bildpunkte zurück.",
    },
    {
        route: "/material/vertiefung-bildverarbeitung/eigene-fotos-gegen-modell",
        title: "Eigene Fotos gegen ein auf sauberen Daten trainiertes Modell",
        level: "mittel",
        text: "Ein Modell, das jedes Testbild richtig zuordnet, sieht nach einem gelösten Problem aus. Wir trainieren ein Faltungsnetz auf Handzeichen-Fotos bis zur fehlerfreien Wahrheitsmatrix, halten dann selbst aufgenommene Bilder dagegen und zuletzt eine Eingabe, die zu keiner der drei Klassen gehört. Der Einbruch zeigt, wofür eine Testgenauigkeit überhaupt gilt und dass die Ausgabe eine unpassende Eingabe nicht als solche kennzeichnet.",
    },
    {
        route: "/material/modellevaluation/ueberanpassung-bremsen",
        title: "Überanpassung mit einer Dropout-Schicht verringern",
        level: "mittel",
        text: "Die Werte eines Modells steigen auf den Trainingsdaten weiter, während sie auf den Testdaten stehen bleiben; diesem Auseinanderlaufen wirkt eine eigene Schicht entgegen. Wir messen drei Modelle ohne Dropout und mit den Raten 0,5 und 0,8 über je drei Läufe und erfassen dabei vier Größen statt einer. Die Genauigkeit trennt die Modelle nicht, der Abstand zwischen den Kurven und die Lage des Verlustminimums dagegen deutlich. Daraus ergibt sich, welche Rate brauchbar ist und warum die stärkere die Trainingskurve als Vergleichsgröße unbrauchbar macht.",
    },
    {
        route: "/material/datenarbeit/einen-eigenen-datensatz-beurteilen",
        title: "Einen eigenen Datensatz finden und dafür ein Modell bauen",
        level: "fortgeschritten",
        text: "Datensatz und Aufbau sind hier nicht vorgegeben. Wir suchen einen eigenen Datensatz, prüfen ihn anhand eines siebenteiligen Protokolls auf Brauchbarkeit, von der ladbaren Vorschau bis zur Genauigkeit über der Grundrate, und leiten daraus einen Aufbau ab, der vor der ersten Messung schriftlich begründet wird. Drei Trainingsläufe entscheiden anschließend, ob Datensatz und Begründung getragen haben.",
    },
]

/** The overview the last card leads to. */
const OVERVIEW = "/material/uebersicht"

/**
 * Everything a card shares, so the last one can look different without a
 * condition inside the loop.
 *
 * `relative` is load-bearing, not decoration: the difficulty badge carries a
 * visually hidden label, and `sr-only` positions it absolutely. Without a
 * positioned ancestor its containing block would be the page itself, so a card
 * sitting far right in the scrolled track would push the document that wide —
 * the whole page could then be dragged sideways over empty ground.
 */
const CARD =
    "group relative flex h-full flex-col rounded-xl border p-5 text-left transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"

/**
 * The size every card keeps, whatever it has to say.
 *
 * The texts are the material's own descriptions and differ by a factor of
 * three in length. Left to themselves the longest would set the height of the
 * track and every card next to it would follow, since they are laid out in a
 * row and stretch to its tallest. Both heights are therefore fixed, and they
 * are the ones the track measured when its texts were still written to fit —
 * 348 and 308 pixels, rounded up to the half rem. What does not fit scrolls
 * inside the card rather than pushing the section open.
 */
const KARTE = "h-[22rem] w-[17rem] shrink-0 snap-start sm:h-[19.5rem] sm:w-[19rem]"

/**
 * Keeps a click that ends on a card's scrollbar from opening the exercise.
 *
 * The scrollable text sits inside the link the card is made of. Pressing the
 * thumb and letting go reaches that link as a click, so a reader who scrolls
 * the text to its end would be navigated away by the same gesture.
 *
 * @param {React.MouseEvent} ereignis Click on its way up to the card's link.
 */
function leiste(ereignis: React.MouseEvent) {
    const ziel = ereignis.target as HTMLElement
    if (ziel.closest("[data-slot='scroll-area-scrollbar']")) ereignis.preventDefault()
}

/**
 * Exercise suggestions from the material area as a track of cards.
 *
 * The track is a scroll container with snap points rather than a carousel
 * library. Every card is a link and therefore already in the tab order, and a
 * browser scrolls a focused element into view by itself — which is the whole
 * of the keyboard behaviour a library would otherwise be carried in for.
 *
 * @returns {JSX.Element} Carousel section.
 */
export function TaskCarousel() {
    const spur = useRef<HTMLUListElement>(null)
    /** Which ends of the track are reached. Both, until first measured. */
    const [rand, setRand] = useState({ anfang: true, ende: true })

    /** Reads which ends of the track are reached. */
    function messen() {
        const element = spur.current
        if (!element) return
        const { scrollLeft, scrollWidth, clientWidth } = element
        setRand({
            anfang: scrollLeft <= 1,
            ende: scrollLeft >= scrollWidth - clientWidth - 1,
        })
    }

    // The track's own scrolling reports through `onScroll`; a resize does not,
    // and it can turn a scrollable track into one where everything fits.
    useEffect(() => {
        messen()
        window.addEventListener("resize", messen)
        return () => window.removeEventListener("resize", messen)
    }, [])

    /**
     * Scrolls the track by exactly one card.
     *
     * The step is the distance between the first two cards rather than a card
     * width plus a hard-coded gap — that way the gap can change in a class
     * name without having to change here too.
     *
     * @param {-1 | 1} richtung Direction to move in.
     */
    function blaettern(richtung: -1 | 1) {
        const element = spur.current
        if (!element) return
        const [erste, zweite] = element.children
        const schritt =
            erste && zweite
                ? (zweite as HTMLElement).offsetLeft - (erste as HTMLElement).offsetLeft
                : element.clientWidth
        // No `behavior`: whether this glides or jumps is decided in
        // `index.css`, where the same question is already asked for the tile.
        element.scrollBy({ left: richtung * schritt })
    }

    return (
        <section aria-labelledby="aufgaben-titel" className="mx-auto max-w-6xl pt-8 pb-24">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4">
                {/* The size the overview's heading above carries, for the same
                    reason: with the paragraph under it gone, the line has to
                    stand as a heading on its own. It keeps the left edge of
                    the track it opens, and the arrows take the other end of
                    its line. */}
                <div className="flex items-center gap-3">
                    <h2
                        id="aufgaben-titel"
                        className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
                    >
                        Lernmaterialien
                    </h2>
                    <Badge variant="outline" className="text-xl font-light">Preview</Badge>
                </div>

                {/* Redundant by design: every card is reachable with Tab. The
                    buttons exist for the pointer, which has no such affordance
                    once the scrollbar is hidden. */}
                <div className="ml-auto hidden gap-2 sm:flex">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Vorherige Karten"
                        disabled={rand.anfang}
                        onClick={() => blaettern(-1)}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Nächste Karten"
                        disabled={rand.ende}
                        onClick={() => blaettern(1)}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            {/* `py-2` is not decoration: `overflow-x` computes `overflow-y` to
                `auto` as well, and without it the focus ring of a card would be
                clipped at the top and bottom edge of the track. */}
            <ul
                ref={spur}
                onScroll={messen}
                className="karussell mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 py-2"
            >
                {EXERCISES.map(({ route, title, level, text }) => (
                    <li key={route} className={KARTE}>
                        <a href={`${config.docsUrl}${route}`} className={`${CARD} bg-card`}>
                            <span className="w-fit rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                <span className="sr-only">Schwierigkeit: </span>
                                {level}
                            </span>
                            <h3 className="mt-3 font-medium">{title}</h3>
                            <ScrollArea type="hover" onClick={leiste} className="mt-2 -mr-3 min-h-0 flex-1 pr-3">
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </ScrollArea>
                            <span className="mt-4 flex items-center gap-1.5 text-sm font-medium">
                                Aufgabe öffnen
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </a>
                    </li>
                ))}

                {/* The overview stands outside the list above: it has no
                    difficulty, and it closes the track rather than continuing
                    it. */}
                <li className={KARTE}>
                    <a href={`${config.docsUrl}${OVERVIEW}`} className={`${CARD} bg-muted/50`}>
                        {/* No text under it any more, so the line has the card
                            to itself: it takes the space above the link and
                            sits in the middle of it. */}
                        <h3 className="flex flex-1 items-center justify-center text-center text-xl font-medium text-balance">
                            <MoveUpRight />
                            Alle Aufgaben
                        </h3>
                    </a>
                </li>
            </ul>
        </section>
    )
}
