import configJson from "../../config.json"

/**
 * Zentrale Konfiguration der Installation.
 *
 * Alle Werte, die eine Installation gegenüber einer anderen unterscheiden,
 * stehen in `config.json` im Projektstamm – sie ist die einzige Stelle, die
 * beim Aufsetzen einer eigenen Instanz angefasst werden muss. Anders als eine
 * `.env` liegt sie im Repository und ist damit versioniert und dokumentiert.
 *
 * Die Datei wird beim Build in das Bundle aufgenommen; eine Änderung erfordert
 * also einen neuen Build. Aufbau und Wirkung entsprechen der gleichnamigen
 * Datei der Dokumentation.
 */
export type Config = {
    site: {
        /** Voller Name im Kopfbereich und im Seitentitel. */
        title: string
        /** Kurzform für schmale Fenster. */
        shortTitle: string
        /** Kurzbeschreibung für den `description`-Metatag. */
        description: string
        /** Sprachkennzeichen des `html`-Elements, z. B. `de`. */
        lang: string
    }
    /** Adresse der Playground-Instanz, auf die die Seite verweist. */
    playgroundUrl: string
    /** Adresse der Dokumentation, auf die die Seite verweist. */
    docsUrl: string
    /** Quelltext des Playgrounds, verlinkt in der Fußzeile. */
    repoUrl: string
    /** Quelltext der Dokumentation, verlinkt in der Fußzeile. */
    docsRepoUrl: string
    /** Port für Vorschau (`npm run preview`) und Container. */
    port: number
}

export const config: Config = configJson
