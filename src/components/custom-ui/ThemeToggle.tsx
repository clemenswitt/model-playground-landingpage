import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * Switches between the light and dark theme.
 *
 * @param {object} props Component props.
 * @param {string} [props.className] Extra classes for the button, e.g. the
 *   spacing the header needs once its links drop away on narrow screens.
 * @returns {JSX.Element} Icon button.
 */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            className={className}
            aria-label="Farbschema wechseln"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
        </Button>
    )
}
