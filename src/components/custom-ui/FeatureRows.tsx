import { FeatureRow } from "@/components/custom-ui/FeatureRow"

/** The four views the overview shows, in the order the work happens. */
const FEATURES = [
    {
        image: "datensatz",
        width: 1536,
        height: 1530,
        alt: "Der Vorschaudialog des MNIST-Datensatzes mit Beschreibung, Klassenverteilung und einer Tabelle einzelner Ziffernbilder",
        motion: true,
        title: "Datensätze laden und untersuchen",
        text: "Der Playground lädt jeden Datensatz, der auf HuggingFace liegt und eine Vorschau anbietet — vorbereitete Einträge wie MNIST, CIFAR-10 oder Iris ebenso wie selbst gesuchte. Vor dem ersten Training lässt sich ansehen, was tatsächlich ankommt: Beschreibung, Klassen, einzelne Beispiele. Ein Datensatz, der sich nicht laden lässt oder dessen Klassen ungleich verteilt sind, fällt so vor der ersten Messung auf und nicht danach.",
    },
    {
        image: "metriken",
        width: 500,
        height: 700,
        alt: "Das Panel der Trainingsmetriken im Reiter Accuracy, mit den Kurven für Trainings- und Validierungsgenauigkeit über 50 Epochen",
        motion: true,
        threeQuarters: true,
        title: "Dem Training beim Laufen zusehen",
        text: "Während des Trainings zeichnet der Playground Genauigkeit und Verlust auf, jeweils getrennt für Trainings- und Validierungsdaten. Beide stehen in einem eigenen Reiter, Epoche für Epoche, samt Fortschritt über die geplanten Durchläufe. Ob ein Modell noch lernt, bereits steht oder sich nur noch an die Trainingsdaten anpasst, ist damit während des Laufs abzulesen und nicht erst am Endwert.",
    },
    {
        image: "wahrheitsmatrix",
        width: 2156,
        height: 1318,
        alt: "Die Wahrheitsmatrix eines auf CIFAR-10 trainierten Modells, zehn Klassen von airplane bis truck, die Diagonale eingefärbt",
        wide: true,
        title: "Wahrheitsmatrix und Inferenzpanel",
        text: "Nach dem Training zeigt die Wahrheitsmatrix, welche Klasse mit welcher verwechselt wird; die Genauigkeit als einzelne Zahl sagt darüber nichts. Das Inferenzpanel legt daneben einzelne Beispiele durch das Modell und nennt die Wahrscheinlichkeit für jede Klasse. Dort lassen sich auch eigene Daten einsetzen — ein selbst aufgenommenes Foto hochladen oder bei Tabellendaten einzelne Merkmale verändern und sehen, woran die Zuordnung hängt.",
        inset: {
            image: "inferenz",
            width: 600,
            height: 892,
            alt: "Das Inferenzpanel mit dem Bild eines Pferdes aus CIFAR-10 und einem Wahrscheinlichkeitsbalken je Klasse",
            motion: true,
        },
    },
    {
        image: "teilen",
        width: 1440,
        height: 900,
        alt: "Die Zeichenfläche mit dem trainierten MNIST-Modell, darüber der Dialog „Modellstruktur teilen“ mit dem QR-Code und dem Link zu genau diesem Aufbau",
        motion: true,
        wide: true,
        title: "Ein Modell als Link weitergeben",
        text: "Ein Modell muss niemand nachbauen, um es zu bekommen: Der Playground schreibt den Aufbau samt gewähltem Datensatz in einen Link und legt denselben Link als QR-Code daneben. Wer ihn öffnet, findet die Struktur auf seiner eigenen Zeichenfläche wieder — im Seminarraum genügt der Code an der Wand. Weitergegeben wird dabei der Bauplan und nicht das trainierte Modell; die Gewichte stehen im Export, den dieselbe Leiste anbietet.",
    },
]

/**
 * What the playground contains, in four rows of screenshot and paragraph.
 *
 * The rows alternate sides from `lg` upwards. That is the whole of the
 * section's structure: the header and the two links above it say where to go,
 * this says what is waiting there.
 *
 * Three of the four shots are the last moment of a recording that runs over
 * them; the fourth recording lies in the inset of the one shot that has none of
 * its own. What each recording shows is the one move the view is there for: a
 * dataset being read out before it is used, a training run filling its curves,
 * another example put through the model, a finished model handed on as a QR
 * code. The confusion matrix is the shot without one — it is a reading of a
 * finished run, and there is nothing about it to watch happen.
 *
 * @returns {JSX.Element} Overview section.
 */
export function FeatureRows() {
    return (
        <section aria-labelledby="werkzeuge-titel" className="mx-auto max-w-6xl px-4 pb-24">
            <h2
                id="werkzeuge-titel"
                className="mx-auto max-w-[26ch] text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            >
                Kurzübersicht über die enthaltenen Werkzeuge
            </h2>
            <p className="mx-auto mt-4 max-w-[60ch] text-center text-pretty text-muted-foreground">
                Vier Ansichten, die im Playground ineinandergreifen: der Datensatz vor
                dem Training, die Kurven währenddessen, die Auswertung danach — und der
                Link, mit dem das fertige Modell weitergeht.
            </p>

            <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
                {FEATURES.map((feature, index) => (
                    <FeatureRow key={feature.image} {...feature} flipped={index % 2 === 1} />
                ))}
            </div>
        </section>
    )
}
