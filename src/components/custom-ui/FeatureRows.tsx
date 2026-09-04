import { FeatureRow } from "@/components/custom-ui/FeatureRow"

/** The three views the overview shows, in the order the work happens. */
const FEATURES = [
    {
        image: "datensatz",
        width: 1536,
        height: 1530,
        alt: "Der Vorschaudialog des MNIST-Datensatzes mit Beschreibung, Klassenverteilung und einer Tabelle einzelner Ziffernbilder",
        title: "Datensätze laden und untersuchen",
        text: "Der Playground lädt jeden Datensatz, der auf HuggingFace liegt und eine Vorschau anbietet — vorbereitete Einträge wie MNIST, CIFAR-10 oder Iris ebenso wie selbst gesuchte. Vor dem ersten Training lässt sich ansehen, was tatsächlich ankommt: Beschreibung, Klassen, einzelne Beispiele. Ein Datensatz, der sich nicht laden lässt oder dessen Klassen ungleich verteilt sind, fällt so vor der ersten Messung auf und nicht danach.",
    },
    {
        image: "metriken",
        width: 900,
        height: 1285,
        alt: "Das Panel der Trainingsmetriken im Reiter Accuracy, mit den Kurven für Trainings- und Validierungsgenauigkeit über 50 Epochen",
        second: {
            image: "metriken-verlust",
            width: 900,
            height: 1285,
            alt: "Dasselbe Panel im Reiter Loss, mit den Kurven für Trainings- und Validierungsverlust über 50 Epochen",
        },
        title: "Dem Training beim Laufen zusehen",
        text: "Während des Trainings zeichnet der Playground Genauigkeit und Verlust auf, jeweils getrennt für Trainings- und Validierungsdaten. Beide stehen in einem eigenen Reiter, Epoche für Epoche, samt Fortschritt über die geplanten Durchläufe. Ob ein Modell noch lernt, bereits steht oder sich nur noch an die Trainingsdaten anpasst, ist damit während des Laufs abzulesen und nicht erst am Endwert.",
    },
    {
        image: "wahrheitsmatrix",
        width: 2068,
        height: 1305,
        alt: "Die Wahrheitsmatrix eines auf MNIST trainierten Modells, zehn Klassen, die Diagonale eingefärbt",
        title: "Wahrheitsmatrix und Inferenzpanel",
        text: "Nach dem Training zeigt die Wahrheitsmatrix, welche Klasse mit welcher verwechselt wird; eine Genauigkeit von 89,0 % sagt darüber nichts. Das Inferenzpanel legt daneben einzelne Beispiele durch das Modell und nennt die Wahrscheinlichkeit für jede Klasse. Dort lassen sich auch eigene Daten einsetzen — ein selbst aufgenommenes Foto hochladen oder bei Tabellendaten einzelne Merkmale verändern und sehen, woran die Zuordnung hängt.",
        inset: {
            image: "inferenz",
            width: 900,
            height: 1363,
            alt: "Das Inferenzpanel mit einem einzelnen Ziffernbild und einem Wahrscheinlichkeitsbalken je Klasse",
        },
    },
]

/**
 * What the playground contains, in three rows of screenshot and paragraph.
 *
 * The rows alternate sides from `lg` upwards. That is the whole of the
 * section's structure: the header and the two links above it say where to go,
 * this says what is waiting there.
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
                Drei Ansichten, die im Playground ineinandergreifen: der Datensatz vor
                dem Training, die Kurven währenddessen, die Auswertung danach.
            </p>

            <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
                {FEATURES.map((feature, index) => (
                    <FeatureRow key={feature.image} {...feature} flipped={index % 2 === 1} />
                ))}
            </div>
        </section>
    )
}
