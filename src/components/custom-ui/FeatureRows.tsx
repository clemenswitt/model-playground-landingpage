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
        text: (
            <>
                Über die{" "}
                <a
                    href="https://huggingface.co/datasets"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    Hugging-Face-Datasets-API
                </a>{" "}
                stehen mehr als 500&#8239;000 Datensätze zur Auswahl; eigene Datensätze können auf diese
                Weise ebenso importiert werden. Vor dem Hinzufügen können Datensätze hinsichtlich ihrer
                Klassenverteilung und einzelner Beispiele analysiert werden.
            </>
        ),
    },
    {
        image: "metriken",
        width: 500,
        height: 700,
        alt: "Das Panel der Trainingsmetriken im Reiter Accuracy, mit den Kurven für Trainings- und Validierungsgenauigkeit über 50 Epochen",
        motion: true,
        threeQuarters: true,
        title: "Trainingsverläufe analysieren",
        text: "Modellgenauigkeit und -verlust werden während des Trainings epochenweise aufgezeichnet, getrennt für Trainings- und Validierungsdaten. Ein wachsender Abstand zwischen beiden Kurven zeigt Überanpassung an, ein flacher Verlauf auf niedrigem Niveau eine zu geringe Modellkapazität oder eine unpassend gewählte Lernrate.",
    },
    {
        image: "wahrheitsmatrix",
        width: 2156,
        height: 1318,
        alt: "Die Wahrheitsmatrix eines auf CIFAR-10 trainierten Modells, zehn Klassen von airplane bis truck, die Diagonale eingefärbt",
        wide: true,
        title: "Wahrheitsmatrix und Inferenzpanel",
        text: "Die Wahrheitsmatrix schlüsselt die erreichte Genauigkeit eines trainierten Modells nach Klassen auf und zeigt, welche zuverlässig getrennt und welche miteinander verwechselt werden. Das Inferenzpanel stellt für ein gewähltes Beispiel die vollständige Modellausgabe über alle Klassen dar. Mit eigenen Bildern oder selbst gewählten Merkmalswerten kann die Generalisierungsfähigkeit trainierter Modelle überprüft werden.",
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
        title: "Modelle teilen",
        text: (
            <>
                Ein Modellaufbau samt gewähltem Datensatz lässt sich als Link oder QR-Code
                weitergeben und auf einem anderen Gerät fortführen. Über die Exportfunktion
                können trainierte Modelle als Archiv gesichert und in Frameworks wie{" "}
                <a
                    href="https://www.tensorflow.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    TensorFlow
                </a>{" "} oder <a
                    href="https://pytorch.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    PyTorch
                </a>{" "}
                weiterverwendet werden.
            </>
        ),
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
                className="mx-auto max-w-auto text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            >
                Kurzübersicht über die enthaltenen Werkzeuge
            </h2>

            <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
                {FEATURES.map((feature, index) => (
                    <FeatureRow key={feature.image} {...feature} flipped={index % 2 === 1} />
                ))}
            </div>
        </section>
    )
}
