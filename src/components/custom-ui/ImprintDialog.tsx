import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { config } from "@/lib/config"

/**
 * Imprint and privacy notice, opened from the footer.
 *
 * The dialog is self-contained: it renders its own trigger, so the footer only
 * has to place it. Unlike the playground's version it scrolls in a plain
 * container rather than a `ScrollArea` — the only thing that has to scroll here
 * is one column of text.
 *
 * @returns {JSX.Element} Trigger link plus the imprint dialog.
 */
export function ImprintDialog() {
    // Deployment URL is not fixed (dev server, Docker host, public domain), so
    // the privacy section names whatever origin the page is actually served from.
    const siteUrl = typeof window !== "undefined" ? window.location.origin : ""

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer underline-offset-4 hover:text-foreground hover:underline"
                >
                    Impressum &amp; Datenschutz
                </button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Impressum</DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-4 text-sm text-muted-foreground">
                    <p>Es gilt das Impressum der TU Dresden mit folgenden Abweichungen:</p>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-foreground">
                            Verantwortlichkeiten
                        </h3>
                        <p>Bei inhaltlichen Fragen wenden Sie sich bitte an:</p>
                        <p>
                            Clemens Witt
                            <br />
                            Technische Universität Dresden
                            <br />
                            01062 Dresden
                            <br />
                            E-Mail:{" "}
                            <a
                                href="mailto:clemens.witt@tu-dresden.de"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                clemens.witt@tu-dresden.de
                            </a>
                            <br />
                            Telefon: +49 351 463-38424
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-foreground">
                            Datenschutzerklärung
                        </h3>
                        <p>
                            Die TU Dresden verarbeitet im Rahmen der Nutzung des
                            öffentlich zugänglichen Webangebots ({siteUrl})
                            personenbezogene bzw. pseudonyme Daten wie folgt:
                        </p>
                        <p>
                            Bei der Nutzung dieser Seite wird auf dem Endgerät der
                            Nutzer:in lokal ausschließlich die gewählte Darstellung
                            (helles, dunkles oder dem System folgendes Erscheinungsbild)
                            gespeichert. Diese Speicherung dient allein dazu, die
                            Einstellung beim nächsten Aufruf wiederherzustellen. Es
                            handelt sich nicht um ein Cookie und die Daten werden nicht
                            zur Nachverfolgung der Nutzung verwendet.
                        </p>
                        <p>
                            Eine serverseitige Speicherung von Nutzungsdaten findet
                            nicht statt. Sämtliche Inhalte werden mit der Seite
                            ausgeliefert; beim Laden werden keine externen Dienste
                            eingebunden. Die Seite verweist auf den Model Playground
                            ({config.playgroundUrl}) und auf dessen Dokumentation
                            ({config.docsUrl}); für die dort verarbeiteten Daten gilt
                            das jeweils eigene Impressum.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-foreground">Rechtsgrundlage</h3>
                        <p>Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. f DSGVO.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-foreground">
                            Rechte betroffener Personen
                        </h3>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                Sie haben das Recht, von der TU Dresden Auskunft über die
                                zu Ihrer Person gespeicherten Daten zu erhalten und/oder
                                unrichtig gespeicherte Daten berichtigen zu lassen.
                            </li>
                            <li>
                                Sie haben das Recht auf Löschung oder auf Einschränkung
                                der Verarbeitung oder ein Widerspruchsrecht gegen die
                                Verarbeitung.
                            </li>
                            <li>
                                Sie können sich jederzeit an den Datenschutzbeauftragten
                                der TU Dresden wenden:
                                <br />
                                <br />
                                Technische Universität Dresden
                                <br />
                                Datenschutzbeauftragter
                                <br />
                                01062 Dresden
                                <br />
                                Tel.: +49 (0) 351 463 32839
                                <br />
                                Fax: +49 (0) 351 463 39718
                                <br />
                                E-Mail:{" "}
                                <a
                                    href="mailto:informationssicherheit@tu-dresden.de"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    informationssicherheit@tu-dresden.de
                                </a>
                                <br />
                                <a
                                    href="https://tu-dresden.de/informationssicherheit"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    https://tu-dresden.de/informationssicherheit
                                </a>
                            </li>
                            <li>
                                Sie haben weiterhin das Recht auf Beschwerde bei einer
                                Aufsichtsbehörde, wenn Sie der Ansicht sind, dass die
                                Verarbeitung der Sie betreffenden personenbezogenen Daten
                                gegen die Rechtsvorschriften verstößt. Die zuständige
                                Aufsichtsbehörde für den Datenschutz ist:
                                <br />
                                <br />
                                Sächsische Datenschutz- und Transparenzbeauftragte
                                <br />
                                Frau Dr. Juliane Hundert
                                <br />
                                Postfach 11 01 32
                                <br />
                                01330 Dresden
                                <br />
                                E-Mail:{" "}
                                <a
                                    href="mailto:post@sdtb.sachsen.de"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    post@sdtb.sachsen.de
                                </a>
                                <br />
                                Telefon: +49 (0) 351 85471 101
                                <br />
                                <a
                                    href="https://www.datenschutz.sachsen.de"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    www.datenschutz.sachsen.de
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    )
}
