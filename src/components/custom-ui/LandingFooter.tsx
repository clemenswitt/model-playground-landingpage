import { ImprintDialog } from "@/components/custom-ui/ImprintDialog"

/**
 * Footer: responsible institution and imprint.
 *
 * @returns {JSX.Element} Footer bar.
 */
export function LandingFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-4 text-xs text-muted-foreground">
                <ImprintDialog />
            </div>
        </footer>
    )
}
