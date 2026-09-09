import { useCallback, useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * The two recordings of a pair, one per colour scheme.
 *
 * Which one is painted is decided in CSS, by the very classes the screenshots
 * underneath already carry. The hidden one is `display: none`, so nothing is
 * stacked half transparent over anything, and the two need not be held in
 * step: only ever one of them is on screen.
 */
const VARIANTS = [
    { suffix: "-light", visibility: "block dark:hidden" },
    { suffix: "-dark", visibility: "hidden dark:block" },
]

/**
 * A recording as a pair of files, over the screenshot it belongs to.
 *
 * The recordings follow the ordinary recipe for a background video, and
 * nothing beyond it: `muted`, `playsinline` and `loop` on the element, the
 * screenshot as `poster`, and an `IntersectionObserver` that plays what is in
 * the viewport and pauses what is not. That last part is not a nicety. Chrome
 * stops a muted video that plays by itself the moment it leaves the viewport
 * and does not start it again on the way back, so a page that leaves it to
 * `autoplay` alone shows a frozen frame from the second scroll onwards.
 *
 * H.264 stands first among the sources and VP9 behind it, against the usual
 * advice. On Apple Silicon, Chrome hands VP9 to the hardware decoder, and that
 * decoder returns `PIPELINE_ERROR_DECODE` for the smaller recordings here —
 * 600 x 840 and 1024 x 1024 fail where 1920 x 1200 plays. A decode error is
 * not a reason for the browser to try the next `<source>`: by then it has long
 * chosen. So the format every decoder is sure of goes first, and it costs
 * next to nothing: four of these five MP4s are the smaller file of the pair.
 *
 * Every request to play is made explicitly as well, rather than trusting the
 * `autoplay` attribute: React writes `muted` as a property but not as an
 * attribute, and an autoplay Chrome refuses is refused silently.
 *
 * Underneath lies the screenshot, and it stays what it was: the first thing
 * seen, and what remains if no recording arrives — a slow line, a decoder that
 * refuses, or a reader who asked for less motion. Nothing here is announced;
 * the recordings show what the screenshot below already describes, only in
 * motion.
 *
 * The component paints itself over its parent, which therefore has to be
 * positioned. Both users are: the hero tile and the screenshots of the
 * overview.
 *
 * @param {object} props Component props.
 * @param {string} props.base Basename in `public/`, without colour scheme and
 *   extension — `/metriken` for `metriken-light.webm` and its siblings.
 * @param {string} [props.radius] Corner radius to clip the recordings to. It
 *   is the screenshot underneath that gives the corners their shape, and a
 *   video knows nothing of the radius of the picture it covers: without this
 *   its square corners would stand out beyond the rounded ones below.
 * @param {boolean} [props.once] Run the recording a single time rather than in
 *   a loop, and offer a button to run it again once it has. For the hero tile:
 *   a timelapse that repeats forever beside the first words of the page pulls
 *   the eye away from them for as long as the reader stays. The overview
 *   further down is scrolled past rather than dwelt on, and keeps its loop.
 * @returns {JSX.Element} The layer holding both recordings, and, where the
 *   recording runs once, the button that starts it again.
 */
export function Screencast({
    base,
    radius = "rounded-xl",
    once = false,
}: {
    base: string
    radius?: string
    once?: boolean
}) {
    const frame = useRef<HTMLDivElement>(null)
    /** The mounted `<video>` elements, by source. */
    const players = useRef(new Map<string, HTMLVideoElement>())

    const { resolvedTheme } = useTheme()
    /** Whether motion is wanted at all. Undecided until the query is read. */
    const [motionAllowed, setMotionAllowed] = useState(false)
    /** Whether the recordings have come close enough to be worth fetching. */
    const [nearViewport, setNearViewport] = useState(false)
    /** Whether a single run has finished and the button is to be shown. */
    const [finished, setFinished] = useState(false)
    // The same answer, where the watches below read it: they are set up once
    // and would otherwise go on asking a recording that has had its one run to
    // play again — and a browser answers that by starting it over.
    const finishedRef = useRef(false)

    /**
     * Asks every mounted recording to run.
     *
     * @returns {void}
     */
    const playAll = useCallback(() => {
        if (finishedRef.current) return
        for (const player of players.current.values()) {
            player.play().catch(() => {
                /* A refusal leaves the screenshot standing, which is fine. */
            })
        }
    }, [])

    // The same question `index.css` asks for the tilt, asked in JavaScript
    // because the answer decides whether a file is fetched at all — something
    // a media query cannot do for a `<video>` that is already in the markup.
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)")
        const read = () => setMotionAllowed(!query.matches)
        read()
        query.addEventListener("change", read)
        return () => query.removeEventListener("change", read)
    }, [])

    // The second question that decides whether a file is fetched: four of the
    // five recordings on this page stand below the fold, and a reader who
    // never scrolls that far should not pay for them. Once a recording has
    // been asked for, this watch ends — it is not to be unloaded again on the
    // way back up.
    useEffect(() => {
        const element = frame.current
        if (!element) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                setNearViewport(true)
                observer.disconnect()
            },
            { rootMargin: "300px" },
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    // Play what is on screen, pause what is not. The margin of the watch above
    // is deliberately absent here: that one asks whether a file is worth
    // fetching and answers early, this one asks whether anybody is looking.
    useEffect(() => {
        const element = frame.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) playAll()
            else for (const player of players.current.values()) player.pause()
        })
        observer.observe(element)

        // The same stop from the other direction: a tab in the background is
        // no more watched than a recording below the fold.
        const onReturn = () => {
            if (document.visibilityState === "visible") playAll()
        }
        document.addEventListener("visibilitychange", onReturn)

        return () => {
            observer.disconnect()
            document.removeEventListener("visibilitychange", onReturn)
        }
    }, [playAll, nearViewport])

    // The recording that has just become the visible one of the pair was
    // `display: none` a moment ago, and a browser does not run what it does
    // not paint. Asking it to play costs nothing when it already does.
    useEffect(() => {
        playAll()
    }, [playAll, resolvedTheme])

    /**
     * Notes that the single video run is over.
     *
     * @returns {void}
     */
    function finish() {
        finishedRef.current = true
        setFinished(true)
    }

    /**
     * Resets both recordings back and runs them again.
     *
     * @returns {void}
     */
    function restart() {
        finishedRef.current = false
        setFinished(false)
        for (const player of players.current.values()) {
            player.currentTime = 0
            player.play().catch(() => {
                /* A refusal leaves the screenshot standing, which is fine. */
            })
        }
    }

    /**
     * Keeps hold of a mounted recording and starts it.
     *
     * @param {string} source The recording's basename in `public/`.
     * @param {HTMLVideoElement | null} element The element, or nothing on unmount.
     * @returns {void}
     */
    function register(source: string, element: HTMLVideoElement | null) {
        if (!element) {
            players.current.delete(source)
            return
        }
        players.current.set(source, element)
        // React writes `muted` as a property and never as an attribute, and a
        // video Chrome reads as unmuted is a video Chrome will not play by
        // itself. `defaultMuted` is the property that writes the attribute.
        element.muted = true
        element.defaultMuted = true
        if (finishedRef.current) return
        element.play().catch(() => {
            /* Below the fold there is nothing to play yet; the watch above
               comes back to it when it is on screen. */
        })
    }

    return (
        <>
            <div
                ref={frame}
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 overflow-hidden ${radius}`}
            >
                {motionAllowed &&
                    nearViewport &&
                    VARIANTS.map(({ suffix, visibility }) => (
                        <video
                            key={suffix}
                            ref={(element) =>
                                register(`${base}${suffix}`, element)
                            }
                            autoPlay
                            muted
                            loop={!once}
                            playsInline
                            preload="auto"
                            poster={`${base}${suffix}.webp`}
                            onCanPlay={playAll}
                            onEnded={once ? finish : undefined}
                            className={`absolute inset-0 h-full w-full object-cover ${visibility}`}
                        >
                            <source
                                src={`${base}${suffix}.mp4`}
                                type="video/mp4"
                            />
                            <source
                                src={`${base}${suffix}.webm`}
                                type="video/webm"
                            />
                        </video>
                    ))}
            </div>

            {once && finished && (
                <Button
                    type="button"
                    size="sm"
                    onClick={restart}
                    className="absolute right-3 bottom-3 z-10 bg-foreground text-background shadow-sm hover:bg-foreground/90"
                >
                    <RotateCcw />
                    Wiederholen
                </Button>
            )}
        </>
    )
}
