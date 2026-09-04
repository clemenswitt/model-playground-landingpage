import type { CSSProperties } from "react"

import { Screencast } from "@/components/custom-ui/Screencast"

/** One screenshot of a row, in both colour schemes. */
type Shot = {
    /** Basename in `public/`, without colour scheme and extension. */
    image: string
    /** Native size, so the space is reserved before the shot loads. */
    width: number
    height: number
    alt: string
    /** Whether a recording of the same view runs over the shot. */
    motion?: boolean
}

type FeatureRowProps = Shot & {
    title: string
    text: string
    /** Text left, image right. The section alternates it from row to row. */
    flipped: boolean
    /** Two thirds for the shot rather than the usual three fifths. */
    wide?: boolean
    /** Three quarters of the column for the shot rather than all of it. */
    threeQuarters?: boolean
    /** A panel laid over the lower right of the row's screenshot. */
    inset?: Shot
}

/**
 * The screenshot itself: the two shots and the space they are given.
 *
 * There is no frame around them. The shots already carry one — three are a
 * panel of the playground, with its own border and rounded corners, and the
 * fourth is the whole window the hero tile also shows — and a second box
 * around that only made the picture smaller. What lifts them off the page is
 * the shadow from `index.css`, the one the hero tile casts.
 *
 * Where the view has something to do rather than something to be, a recording
 * of that doing runs over the shot, cut to the very same frame. The shot is
 * then the recording's last moment, and it keeps two jobs of its own: it is
 * what stands there first, and it is what stays for a reader who asked for
 * less motion. Only the confusion matrix has no recording — a matrix does not
 * do anything, it says something, and it says it standing still.
 *
 * @param {Shot & { threeQuarters?: boolean, inset?: Shot }} props The shot, how
 *   much of its column it takes, and an optional overlay.
 * @returns {JSX.Element} One screenshot, at the width it is given.
 */
function Screenshot({
    image,
    width,
    height,
    alt,
    motion,
    threeQuarters,
    inset,
}: Shot & { threeQuarters?: boolean; inset?: Shot }) {
    // Below `lg` every row is a single column and the shot has the whole page
    // width to grow into. That suits the four views wider than they are tall.
    // The metrics panel is the one that is not, and on a phone it stood half
    // again as tall as the shots around it. Its own ratio goes to `index.css`,
    // which caps the width there so that no shot is ever taller than its
    // column is wide — the shape the dataset dialog already has.
    const hochkant = height > width

    return (
        <div
            className={`relative mx-auto w-full max-w-xl ${hochkant ? "hochkant" : ""} ${
                threeQuarters ? "lg:max-w-[75%]" : "lg:max-w-none"
            }`}
            style={
                hochkant
                    ? ({
                          "--seitenverhaeltnis": (width / height).toFixed(4),
                      } as CSSProperties)
                    : undefined
            }
        >
            {/* Two shots of the same view, as the hero tile does it: a
                `<picture>` switch would follow the system setting rather than
                the reader's own choice. One `alt` for both — the hidden one is
                never announced, and a second description would only be a
                second thing to keep true. */}
            <img
                src={`/${image}-light.webp`}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="aufnahme block h-auto w-full rounded-xl dark:hidden"
            />
            <img
                src={`/${image}-dark.webp`}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="aufnahme hidden h-auto w-full rounded-xl dark:block"
            />

            {motion && <Screencast base={`/${image}`} />}

            {/* The inference panel over the matrix: the row names both, and a
                fourth row for a panel this narrow would stretch the section
                without adding a beat. A third of the width is what the tall
                panel can take before it reaches the top edge of the wide
                matrix. Below `sm` it would cover the matrix rather than sit
                on it, so it goes. */}
            {inset && (
                <div className="pointer-events-none absolute right-4 bottom-4 hidden w-[34%] sm:block">
                    <img
                        src={`/${inset.image}-light.webp`}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        loading="lazy"
                        decoding="async"
                        className="aufnahme w-full rounded-lg dark:hidden"
                    />
                    <img
                        src={`/${inset.image}-dark.webp`}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        loading="lazy"
                        decoding="async"
                        className="aufnahme hidden w-full rounded-lg dark:block"
                    />
                    {inset.motion && (
                        <Screencast base={`/${inset.image}`} radius="rounded-lg" />
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * One row of the overview: a screenshot beside the paragraph that explains it.
 *
 * A row is text and one shot at 40 : 60, and which of the two gets the 60
 * follows the shape of the shot rather than the side it stands on. A wide view
 * — a dialog, a matrix — takes the wider share and stays as tall as the text
 * beside it. A tall panel takes the narrower one: given the wide share it would
 * grow to twice the height of its own paragraph and turn a row into a page.
 *
 * `wide` moves a row up to two thirds, for the two shots that are more than a
 * single panel: the matrix carrying the inference panel on it, and the whole
 * playground window in which a model is handed on. Both hold something that
 * has to stay legible when the picture is scaled down to a column.
 *
 * `threeQuarters` goes the other way and draws a shot smaller than its column.
 * The metrics panel needs it: it is the one view taller than it is wide, and
 * filling even the narrow column it stood half again as tall as the paragraph
 * beside it. The shot is not recut for this — the panel keeps its proportions
 * and its whole chart, it is simply drawn smaller.
 *
 * @param {FeatureRowProps} props The row's screenshots, its text and its side.
 * @returns {JSX.Element} A single feature row.
 */
export function FeatureRow({
    title,
    text,
    flipped,
    wide,
    threeQuarters,
    inset,
    ...shot
}: FeatureRowProps) {
    // Both questions decide the same thing — which grid column is the wide one
    // — and they cancel out: a tall shot on the right wants the wider column
    // first, and so does a wide shot on the left.
    const hoch = shot.height > shot.width
    const columns = wide
        ? "lg:grid-cols-3"
        : hoch === flipped
          ? "lg:grid-cols-[3fr_2fr]"
          : "lg:grid-cols-[2fr_3fr]"

    return (
        <div className={`grid items-center gap-8 lg:gap-16 ${columns}`}>
            <div>
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{title}</h3>
                <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">{text}</p>
            </div>

            {/* The text precedes the image in the markup of every row. In one
                column that is the reading order; the alternation begins at
                `lg` and comes solely from every other row pulling its image
                forward. */}
            <div className={`${wide ? "lg:col-span-2" : ""} ${flipped ? "" : "lg:order-first"}`}>
                <Screenshot {...shot} threeQuarters={threeQuarters} inset={inset} />
            </div>
        </div>
    )
}
