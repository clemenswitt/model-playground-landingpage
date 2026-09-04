import { useEffect, useRef, useState, type PointerEvent } from "react"
import { useTheme } from "next-themes"

import { config } from "@/lib/config"

/**
 * The two timelapses, in the order they are stacked.
 *
 * The light one lies underneath and stays opaque once it plays; the dark one
 * covers it and is faded in and out. Stacking them this way is what makes the
 * change of colour scheme a clean crossfade: at no point are both half
 * transparent, so the screenshot below never shows through the middle of it.
 */
const AUFNAHMEN = [
    { quelle: "/hero-hell", dunkel: false },
    { quelle: "/hero-dunkel", dunkel: true },
]

/**
 * The product screenshot as a tile that tilts towards the pointer.
 *
 * All the pointer part of this component does is measure where the pointer is;
 * tilt, sheen and shadow are derived from that in `index.css`. Keeping the
 * effect there has two benefits: it stays in one place, and a media query can
 * switch it off for touch screens and for readers who asked for less motion,
 * without this component knowing about either.
 *
 * On top of the screenshot runs a timelapse of the very model the screenshot
 * shows being assembled — one recording per colour scheme. Both are loaded and
 * both keep running; the colour scheme decides which one is painted. That is
 * more bytes than showing one and fetching the other on demand, and it is
 * deliberate: the two recordings then always stand at the same moment on their
 * own, with nothing to remember, restore or verify. Seeking a freshly loaded
 * video to a position is the kind of thing browsers disagree about, and the
 * disagreement is silent.
 *
 * The screenshot underneath is what the reader sees first and what remains if
 * the timelapses never arrive — a slow line, a decoder that refuses, or a
 * reader who asked for less motion.
 *
 * @returns {JSX.Element} Link to the playground, wrapped around the tile.
 */
export function HeroTile() {
    const tile = useRef<HTMLDivElement>(null)
    /** Scheduled, not yet executed write. 0 means there is none. */
    const frame = useRef(0)

    const { resolvedTheme } = useTheme()
    /** Whether motion is wanted at all. Undecided until the query is read. */
    const [bewegung, setBewegung] = useState(false)
    /** The timelapses that have enough of themselves to be painted. */
    const [spielbereit, setSpielbereit] = useState<string[]>([])
    /** The mounted `<video>` elements, by source. */
    const videos = useRef(new Map<string, HTMLVideoElement>())
    /** When the loop was last restarted, to not restart it twice. */
    const letzterUmbruch = useRef(0)

    // The same question `index.css` asks for the tilt, asked in JavaScript
    // because the answer decides whether a file is fetched at all — something
    // a media query cannot do for a `<video>` that is already in the markup.
    useEffect(() => {
        const abfrage = window.matchMedia("(prefers-reduced-motion: reduce)")
        const lesen = () => setBewegung(!abfrage.matches)
        lesen()
        abfrage.addEventListener("change", lesen)
        return () => abfrage.removeEventListener("change", lesen)
    }, [])

    // A safeguard, not the mechanism: browsers are allowed to suspend a video
    // they consider not worth decoding, and one painted at zero opacity is a
    // candidate. Asking the one that just became visible to play costs nothing
    // when it already is.
    useEffect(() => {
        const quelle = resolvedTheme === "dark" ? "/hero-dunkel" : "/hero-hell"
        videos.current.get(quelle)?.play().catch(() => {
            /* Autoplay may be refused; the screenshot stays, which is fine. */
        })
    }, [resolvedTheme])

    const istDunkel = resolvedTheme === "dark"
    const bereit = (quelle: string) => spielbereit.includes(quelle)

    /**
     * Starts both timelapses over, together.
     *
     * This is what `loop` would do, except that `loop` does it to each
     * recording on its own. Each restart costs a moment, and those moments add
     * up on one recording independently of the other: measured over a minute
     * the two had drifted half a second apart, and over an hour it would be
     * far worse — the very mismatch this arrangement exists to avoid. Ending
     * the round for both at once puts them back level every twelve seconds.
     *
     * The two recordings differ by about a tenth of a second in length, so
     * whichever ends first cuts the other one's last moments. Those moments
     * are the still frame at the end; nothing is lost.
     *
     * @returns {void}
     */
    function umbrechen() {
        // Both may report the end within a few milliseconds of each other, and
        // the second report would start the round over a second time.
        const jetzt = Date.now()
        if (jetzt - letzterUmbruch.current < 500) return
        letzterUmbruch.current = jetzt

        for (const video of videos.current.values()) {
            video.currentTime = 0
            video.play().catch(() => {
                /* Refused autoplay leaves the screenshot, which is fine. */
            })
        }
    }

    /**
     * Whether a timelapse is painted at full opacity.
     *
     * The dark one is shown when the dark scheme is chosen. The light one is
     * shown whenever it may be seen at all — either because it is the chosen
     * one, or because the dark one covers it anyway. Without that second case
     * the light timelapse would flash under a dark page in the moment between
     * the two recordings becoming ready.
     *
     * @param {{quelle: string, dunkel: boolean}} aufnahme One of the two.
     * @returns {boolean} Whether to paint it.
     */
    function sichtbar(aufnahme: { quelle: string; dunkel: boolean }) {
        if (!bereit(aufnahme.quelle)) return false
        if (aufnahme.dunkel) return istDunkel
        return !istDunkel || bereit("/hero-dunkel")
    }

    /**
     * Writes the pointer position within the tile as two values from 0 to 1.
     *
     * A pointer reports more often than the screen redraws — on a 120-Hz mouse
     * several times per frame. Writing on each report would recompute the style
     * repeatedly for one and the same frame, which is what makes the tilt
     * stutter. The write is therefore deferred to the next frame, and a report
     * arriving before it replaces it: one write per frame, always the latest
     * position.
     *
     * @param {PointerEvent<HTMLDivElement>} event Pointer movement over the tile.
     */
    function track(event: PointerEvent<HTMLDivElement>) {
        const element = tile.current
        if (!element) return

        const { clientX, clientY } = event
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(() => {
            const { left, top, width, height } = element.getBoundingClientRect()
            element.style.setProperty("--x", String((clientX - left) / width))
            element.style.setProperty("--y", String((clientY - top) / height))
        })
    }

    return (
        <a
            href={config.playgroundUrl}
            aria-label="Playground öffnen"
            className="mx-auto mt-14 block max-w-[1180px] rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            <div
                ref={tile}
                onPointerMove={track}
                className="tile relative overflow-hidden rounded-xl border bg-card"
            >
                {/* Two shots of the same view; the colour scheme picks one.
                    A `<picture>` switch would not do: it follows the system
                    setting rather than the reader's own choice. */}
                <img
                    src="/hero-hell.webp"
                    alt="Der Model Playground mit einem Datensatzknoten und drei aufeinanderfolgenden Schichten auf der Zeichenfläche"
                    width={2880}
                    height={1800}
                    loading="eager"
                    decoding="async"
                    className="block w-full dark:hidden"
                />
                <img
                    src="/hero-dunkel.webp"
                    alt="Der Model Playground im dunklen Erscheinungsbild mit einem Datensatzknoten und drei aufeinanderfolgenden Schichten"
                    width={2880}
                    height={1800}
                    loading="eager"
                    decoding="async"
                    className="hidden w-full dark:block"
                />

                {/* Decorative: they show what the screenshot underneath already
                    describes, only in the making. */}
                {bewegung &&
                    AUFNAHMEN.map((aufnahme) => (
                        <video
                            key={aufnahme.quelle}
                            ref={(element) => {
                                if (element) videos.current.set(aufnahme.quelle, element)
                                else videos.current.delete(aufnahme.quelle)
                            }}
                            aria-hidden="true"
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            onEnded={umbrechen}
                            onCanPlay={() =>
                                setSpielbereit((bisher) =>
                                    bisher.includes(aufnahme.quelle)
                                        ? bisher
                                        : [...bisher, aufnahme.quelle],
                                )
                            }
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                                sichtbar(aufnahme) ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <source src={`${aufnahme.quelle}.webm`} type="video/webm" />
                            <source src={`${aufnahme.quelle}.mp4`} type="video/mp4" />
                        </video>
                    ))}

                <div className="tile-sheen pointer-events-none absolute inset-0" />
            </div>
        </a>
    )
}
