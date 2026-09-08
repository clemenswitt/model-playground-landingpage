import { useEffect, useState } from "react"

/** How long one phrase stays before the next takes its place, in milliseconds. */
const INTERVAL = 3000

type RotatingTextProps = {
    /** Phrases to cycle through, in the order they are to appear. */
    items: string[]
}

/**
 * A line of text whose phrase is replaced every few seconds.
 *
 * @param {RotatingTextProps} props The phrases to cycle through.
 * @returns {JSX.Element} The line, as a single block element.
 */
export function RotatingText({ items }: RotatingTextProps) {
    const [index, setIndex] = useState(0)
    /** Whether motion is wanted at all. Undecided until the query is read. */
    const [motionAllowed, setMotionAllowed] = useState(false)

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)")
        const read = () => setMotionAllowed(!query.matches)
        read()
        query.addEventListener("change", read)
        return () => query.removeEventListener("change", read)
    }, [])

    useEffect(() => {
        if (!motionAllowed) return
        const step = setInterval(
            () => setIndex((current) => (current + 1) % items.length),
            INTERVAL,
        )
        return () => clearInterval(step)
    }, [motionAllowed, items.length])

    if (!motionAllowed) return <span>{items.join(" ")}</span>

    return (
        // Every phrase occupies the same grid cell, all but the current one
        // invisible, so the box is as wide as the longest of them and keeps
        // that width from one phrase to the next. Inside a chip the slack
        // beside a shorter phrase reads as padding; a box that resized itself
        // every few seconds would not.
        <span className="inline-grid justify-items-center whitespace-nowrap">
            <span className="sr-only">{items.join(" ")}</span>

            {items.map((item) => (
                <span
                    key={item}
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1"
                >
                    {item}
                </span>
            ))}

            <span
                key={index}
                aria-hidden="true"
                className="animate-in fade-in-0 slide-in-from-bottom-2 col-start-1 row-start-1 duration-500"
            >
                {items[index]}
            </span>
        </span>
    )
}
