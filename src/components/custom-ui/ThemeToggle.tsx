import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * Switches between the light and dark theme.
 *
 * @returns {JSX.Element} Icon button.
 */
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Farbschema wechseln"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
        </Button>
    )
}
