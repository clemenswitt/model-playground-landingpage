import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

/** Difficulty, as the material itself grades it. */
type Level = "leicht" | "mittel" | "fortgeschritten"

/**
 * One exercise per Schwerpunkt, as a way in.
 *
 * The list is kept by hand. The material lives in another repository, private
 * and not yet published, so there is nothing to read at build time that would
 * not tie this build to a checkout of that one.
 */
const EXERCISES: { route: string; title: string; level: Level; text: string }[] = [
    {
        route: "/material/grundlagen/vollverbundenes-netz-ziffern",
        title: "Ein neuronales Netz für handgeschriebene Ziffern",
        level: "leicht",
        text: "Ein vollverbundenes Netz auf MNIST, dem Datensatz handgeschriebener Ziffern. Vier Breiten der verdeckten Schicht werden über mehrere Läufe gemessen — und daran entschieden, welcher Unterschied belegt ist und welcher im Rauschen liegt.",
    },
    {
        route: "/material/grundlagen/netz-fuer-tabellendaten",
        title: "Ein neuronales Netz für Tabellendaten",
        level: "leicht",
        text: "Bei Tabellendaten ist ein Beispiel eine Reihe benannter Zahlen; zwei vollverbundene Schichten genügen. Im Inferenzpanel verändern wir einzelne Maße des Iris-Datensatzes und finden heraus, an welchem die Zuordnung am stärksten hängt.",
    },
    {
        route: "/material/aufbau/faltung-statt-einebnen",
        title: "Faltungsschicht statt Einebnen bei Farbfotos",
        level: "mittel",
        text: "Auf Farbfotos versagt ein Netz, das die Bildpunkte sofort einebnet, nicht bloß graduell — in der Wahrheitsmatrix bleiben ganze Klassen leer. Flach gegen gefaltet auf CIFAR-10, bei festgehaltenen Trainingsparametern.",
    },
    {
        route: "/material/einblick/eigene-fotos-gegen-modell",
        title: "Eigene Fotos gegen ein auf sauberen Daten trainiertes Modell",
        level: "mittel",
        text: "Ein Faltungsnetz auf Handzeichen-Fotos, trainiert bis zur fehlerfreien Wahrheitsmatrix. Dagegen halten wir selbst aufgenommene Bilder und sehen, wofür eine Testgenauigkeit überhaupt gilt.",
    },
    {
        route: "/material/diagnose/ueberanpassung-bremsen",
        title: "Überanpassung mit einer Dropout-Schicht bremsen",
        level: "mittel",
        text: "Drei Modelle auf dem Beans-Datensatz, unterschieden allein durch die Dropout-Rate: keine, 0,5 und 0,8. Die Genauigkeit trennt sie nicht, der Abstand der Kurven und die Lage des Verlustminimums dagegen deutlich.",
    },
    {
        route: "/material/daten/einen-eigenen-datensatz-beurteilen",
        title: "Einen eigenen Datensatz finden und dafür ein Modell bauen",
        level: "fortgeschritten",
        text: "Datensatz und Aufbau sind hier nicht vorgegeben. Ein siebenteiliges Prüfprotokoll entscheidet, ob ein selbst gesuchter Datensatz taugt; der Aufbau wird vor der ersten Messung schriftlich begründet.",
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
        <section aria-labelledby="aufgaben-titel" className="mx-auto max-w-6xl pb-24">
            <div className="flex flex-wrap items-end justify-between gap-4 px-4">
                <div>
                    <h2
                        id="aufgaben-titel"
                        className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
                    >
                        Aufgabenvorschläge aus dem Material
                    </h2>
                    <p className="mt-4 max-w-[60ch] text-pretty text-muted-foreground">
                        Zweiundzwanzig Aufgaben liegen in der Dokumentation, gegliedert
                        nach der Frage, die sie stellen. Sechs davon als Einstieg — jede
                        eigenständig, jede mit vorbereiteten Modellen.
                    </p>
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
                className="karussell mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 py-2"
            >
                {EXERCISES.map(({ route, title, level, text }) => (
                    <li key={route} className="w-[17rem] shrink-0 snap-start sm:w-[19rem]">
                        <a href={`${config.docsUrl}${route}`} className={`${CARD} bg-card`}>
                            <span className="w-fit rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                <span className="sr-only">Schwierigkeit: </span>
                                {level}
                            </span>
                            <h3 className="mt-3 font-medium">{title}</h3>
                            <p className="mt-2 flex-1 text-sm text-muted-foreground">{text}</p>
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
                <li className="w-[17rem] shrink-0 snap-start sm:w-[19rem]">
                    <a href={`${config.docsUrl}${OVERVIEW}`} className={`${CARD} bg-muted/50`}>
                        <h3 className="font-medium">Alle 22 Aufgaben</h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">
                            Fünf Schwerpunkte: die Bestandteile eines Netzes, die
                            Entscheidungen an seiner Struktur, was im Inneren sichtbar
                            wird, die Ursache stagnierender Werte und der Beitrag der
                            Daten.
                        </p>
                        <span className="mt-4 flex items-center gap-1.5 text-sm font-medium">
                            Übersicht öffnen
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </a>
                </li>
            </ul>
        </section>
    )
}
