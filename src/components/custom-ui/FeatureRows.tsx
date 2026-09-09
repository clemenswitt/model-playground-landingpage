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
        text: "Lernende greifen auf vier vorbereitete Datensätze zu oder suchen unter mehr als 500 000 Einträgen auf Hugging Face. Vor dem Hinzufügen zeigt die Vorschau Klassenverteilung, Form der Eingabe und einzelne Beispiele. Wer eigene Daten nutzen will, veröffentlicht sie auf Hugging Face und lädt sie von dort.",
    },
    {
        image: "metriken",
        width: 500,
        height: 700,
        alt: "Das Panel der Trainingsmetriken im Reiter Accuracy, mit den Kurven für Trainings- und Validierungsgenauigkeit über 50 Epochen",
        motion: true,
        threeQuarters: true,
        title: "Trainingsverläufe lesen",
        text: "Während ein Lauf rechnet, füllen sich die Reiter für Genauigkeit und Verlust Epoche für Epoche, je eine Kurve für die Trainings- und eine für die Validierungsdaten. Am Verlauf lesen Lernende ab, ob ein Modell noch lernt, bereits gesättigt ist oder sich an die Trainingsdaten anpasst.",
    },
    {
        image: "wahrheitsmatrix",
        width: 2156,
        height: 1318,
        alt: "Die Wahrheitsmatrix eines auf CIFAR-10 trainierten Modells, zehn Klassen von airplane bis truck, die Diagonale eingefärbt",
        wide: true,
        title: "Wahrheitsmatrix und Inferenzpanel auswerten",
        text: "Nach dem Lauf steht in der Wahrheitsmatrix, welche Klassen sauber getroffen und welche als eine andere ausgegeben werden. Das Inferenzpanel schickt einzelne Beispiele durch das Modell und gibt je Klasse einen Prozentwert aus. Ein eigenes Bild oder veränderte Merkmalswerte zeigen, wie weit ein Modell trägt.",
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
        title: "Modelle als Link weitergeben",
        text: "Ein QR-Code im Teilen-Dialog gibt einen ganzen Modellaufbau weiter. Der Link daneben trägt Aufbau und gewählten Datensatz auf jede andere Zeichenfläche. Der Export legt Aufbau und trainierte Gewichte in zwei Dateien, aus denen sich die Gewichte in TensorFlow weiterverwenden lassen.",
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
