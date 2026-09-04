/** One screenshot of the pair a row shows, in both colour schemes. */
type Shot = {
    /** Basename in `public/`, without colour scheme and extension. */
    image: string
    /** Native size, so the frame is reserved before the shot loads. */
    width: number
    height: number
    alt: string
}

type FeatureRowProps = Shot & {
    title: string
    text: string
    /** Text left, image right. The section alternates it from row to row. */
    flipped: boolean
    /** A second shot beside the first, each in a frame of its own. */
    second?: Shot
    /** A panel laid over the lower right of the row's screenshot. */
    inset?: Shot
}

/**
 * The screenshot itself: the two shots and the space they are given.
 *
 * There is no frame around them. The shots already carry one — each is a
 * panel of the playground, with its own border and rounded corners — and a
 * second box around that only made the picture smaller. What lifts them off
 * the page is the shadow from `index.css`, the one the hero tile casts.
 *
 * @param {Shot & { inset?: Shot }} props The shot and an optional overlay.
 * @returns {JSX.Element} One screenshot, at the width it is given.
 */
function Frame({ image, width, height, alt, inset }: Shot & { inset?: Shot }) {
    return (
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Two shots of the same view, as the hero tile does it: a
                `<picture>` switch would follow the system setting rather than
                the reader's own choice. One `alt` for both — the hidden one is
                never announced, and a second description would only be a
                second thing to keep true. */}
            <img
                src={`/${image}-hell.webp`}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="aufnahme block h-auto w-full rounded-xl dark:hidden"
            />
            <img
                src={`/${image}-dunkel.webp`}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="aufnahme hidden h-auto w-full rounded-xl dark:block"
            />

            {/* The inference panel over the matrix: the row names both, and a
                fourth row for a panel this narrow would stretch the section
                without adding a beat. Below `sm` it would cover the matrix
                rather than sit on it, so it goes. */}
            {inset && (
                <div className="pointer-events-none absolute right-4 bottom-4 hidden w-[34%] sm:block">
                    <img
                        src={`/${inset.image}-hell.webp`}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        loading="lazy"
                        decoding="async"
                        className="aufnahme w-full rounded-lg dark:hidden"
                    />
                    <img
                        src={`/${inset.image}-dunkel.webp`}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        loading="lazy"
                        decoding="async"
                        className="aufnahme hidden w-full rounded-lg dark:block"
                    />
                </div>
            )}
        </div>
    )
}

/**
 * One row of the overview: a screenshot beside the paragraph that explains it.
 *
 * A row is either text and one shot at 40 : 60, or — where two shots belong
 * together, as accuracy and loss do — text and both shots in equal thirds.
 * Either way the shots run to the full width of their frame; what differs
 * between rows is how much width a frame gets, not how the shot sits in it.
 *
 * @param {FeatureRowProps} props The row's screenshots, its text and its side.
 * @returns {JSX.Element} A single feature row.
 */
export function FeatureRow({ title, text, flipped, second, inset, ...shot }: FeatureRowProps) {
    const columns = second
        ? "lg:grid-cols-3"
        : flipped
          ? "lg:grid-cols-[2fr_3fr]"
          : "lg:grid-cols-[3fr_2fr]"

    return (
        <div className={`grid items-center gap-8 lg:gap-16 ${columns}`}>
            <div>
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{title}</h3>
                <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">{text}</p>
            </div>

            {/* The text precedes the image in the markup of every row. In one
                column that is the reading order; the alternation begins at
                `lg` and comes solely from every other row pulling its image
                forward. A pair of shots keeps the text ahead of it either
                way — split in two, neither shot would carry the side. */}
            {second ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
                    <Frame {...shot} />
                    <Frame {...second} />
                </div>
            ) : (
                <div className={flipped ? "" : "lg:order-first"}>
                    <Frame {...shot} inset={inset} />
                </div>
            )}
        </div>
    )
}
