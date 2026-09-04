import { useRef, type PointerEvent } from "react"

import { Screencast } from "@/components/custom-ui/Screencast"
import { config } from "@/lib/config"

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
 * shows being assembled. It is laid on by {@link Screencast}, which every
 * recording on this page goes through — including the three in the overview
 * below — and which says there why a recording is two files rather than one.
 *
 * @returns {JSX.Element} Link to the playground, wrapped around the tile.
 */
export function HeroTile() {
    const tile = useRef<HTMLDivElement>(null)
    /** Scheduled, not yet executed write. 0 means there is none. */
    const frame = useRef(0)

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
                    src="/hero-light.webp"
                    alt="Der Model Playground mit einem Datensatzknoten und drei aufeinanderfolgenden Schichten auf der Zeichenfläche"
                    width={2880}
                    height={1800}
                    loading="eager"
                    decoding="async"
                    className="block w-full dark:hidden"
                />
                <img
                    src="/hero-dark.webp"
                    alt="Der Model Playground im dunklen Erscheinungsbild mit einem Datensatzknoten und drei aufeinanderfolgenden Schichten"
                    width={2880}
                    height={1800}
                    loading="eager"
                    decoding="async"
                    className="hidden w-full dark:block"
                />

                <Screencast base="/hero" />

                <div className="tile-sheen pointer-events-none absolute inset-0" />
            </div>
        </a>
    )
}
