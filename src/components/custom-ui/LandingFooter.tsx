import { ImprintDialog } from "@/components/custom-ui/ImprintDialog"
import { config } from "@/lib/config"

/**
 * Footer: responsible institution, imprint and the two source repositories.
 *
 * @returns {JSX.Element} Footer bar.
 */
export function LandingFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-8 text-xs text-muted-foreground">
                <span>Technische Universität Dresden</span>
                <ImprintDialog />
                <a
                    href={config.repoUrl}
                    className="underline-offset-4 hover:text-foreground hover:underline"
                >
                    Quelltext Playground
                </a>
                <a
                    href={config.docsRepoUrl}
                    className="underline-offset-4 hover:text-foreground hover:underline"
                >
                    Quelltext Dokumentation
                </a>
            </div>
        </footer>
    )
}
