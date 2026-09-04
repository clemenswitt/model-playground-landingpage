# Model Playground Landing Page
Einstiegsseite zum [Model Playground](../model-playground) und zu seiner
[Dokumentation](../model-playground-docs). Eine einzige Seite mit einem Zweck:
das Werkzeug zeigen und in beide Projekte verzweigen.

## Schnellstart
- `npm install` (Node 20.19+ oder 22.12+)
- `npm run dev` – Entwicklungsserver mit Hot Reload
- `npm run build` – Typprüfung und Produktionsbuild nach `dist/`

### Docker
- `docker build -t model-playground-landingpage .`
- `docker run --rm -p 3005:3005 model-playground-landingpage`

## Konfiguration
Alles, was eine Installation von einer anderen unterscheidet, steht in
`config.json` im Projektstamm – eine Datei, kein `.env`, damit die Werte
versioniert und dokumentiert sind. Dieselbe Regelung gilt in der Dokumentation.

```json
{
    "site": {
        "title": "Model Playground",
        "shortTitle": "MP",
        "description": "Neuronale Netze bauen, trainieren und verstehen — im Browser, ohne Installation",
        "lang": "de"
    },
    "playgroundUrl": "https://mp.witt.ml",
    "docsUrl": "https://docs.witt.ml",
    "repoUrl": "https://gitlab.com/clemenswitt/model-playground",
    "docsRepoUrl": "https://gitlab.com/clemenswitt/model-playground-docs",
    "port": 3005
}
```

| Schlüssel | Wirkung |
| --- | --- |
| `site.title` | Name im Kopfbereich und im Seitentitel |
| `site.shortTitle` | Kurzform für schmale Fenster |
| `site.description` | `description`-Metatag der Seite |
| `site.lang` | Sprachkennzeichen des `html`-Elements |
| `playgroundUrl` | Playground-Instanz, auf die alle Schaltflächen und die Kachel verweisen |
| `docsUrl` | Instanz der Dokumentation |
| `repoUrl`, `docsRepoUrl` | Quelltexte, verlinkt in der Fußzeile |
| `port` | Port für `npm run preview` und den Container |

Die Werte werden beim Build eingesetzt: In der Anwendung über
`src/lib/config.ts`, in `index.html` über die `%SITE_*%`-Platzhalter. Eine
Änderung braucht also einen neuen Build – im Entwicklungsserver startet Vite von
selbst neu. `EXPOSE` im `Dockerfile` ist reine Dokumentation und muss bei einem
anderen Port von Hand nachgezogen werden.

## Aufbau
Die Seite hat keine Adressen außer ihrer eigenen und deshalb keinen Router. Das
Impressum, das einzige Weitere zu Lesende, öffnet als Dialog darüber.

| Pfad | Inhalt |
| --- | --- |
| `config.json` | zentrale Parameter der Installation |
| `src/App.tsx` | die Seite als Folge ihrer Abschnitte |
| `src/components/custom-ui/` | Kopfbereich, Eingangsbereich mit Kachel, Kurzübersicht, Aufgabenkarussell, Fußzeile, Impressum |
| `src/components/ui/` | shadcn-Komponenten, Designsystem aus dem Playground |
| `src/lib/config.ts` | typisierter Zugriff auf `config.json` |
| `public/hero-*.webp` | die beiden Bildschirmfotos in der Kachel |
| `public/{datensatz,metriken,wahrheitsmatrix,inferenz}-*.webp` | die Bildschirmfotos der Kurzübersicht, je hell und dunkel |
| `public/hero-*.webm`, `.mp4` | die beiden Zeitraffer in der Kachel |
| `_arbeit/aufzeichnung.mjs` | Werkzeug, das die Zeitraffer aufnimmt |

`src/index.css` ist aus dem Model Playground übernommen und die gemeinsame
Quelle der Design-Tokens. Änderungen am Design dort zuerst vornehmen und
hierher kopieren. Alles unterhalb der Token gehört dieser Seite allein: das
Raster des Eingangsbereichs, die Kachel und die Spur des Karussells.

### Die Kachel
Die Kachel neigt sich zum Zeiger, ein schwacher Glanz wandert mit.
`HeroTile.tsx` misst dafür nur die Lage des Zeigers und schreibt sie als `--x`
und `--y` auf das Element; gerechnet wird in `index.css`. Geschrieben wird
höchstens einmal je Bild, und der Schatten bleibt fest – beides, weil die
Bewegung sonst hakt.
Auf Geräten ohne Zeiger und bei `prefers-reduced-motion` bleibt die Kachel in
ihrer Ruhelage – dann ist sie ein gerahmtes Bild, das zum Playground führt.

In der Kachel läuft ein Zeitraffer, der das Modell aufbaut, das das
Bildschirmfoto fertig zeigt – eine Aufnahme je Farbschema. **Beide** werden
geladen und laufen dauerhaft; das Farbschema entscheidet nur, welche gemalt
wird. Das sind mehr Bytes, als eine zu laden und die andere bei Bedarf
nachzuholen, und es ist Absicht: So stehen beide von selbst an derselben Stelle,
und es gibt nichts zu merken, wiederherzustellen oder nachzuprüfen. Ein frisch
geladenes Video an eine Stelle zu setzen ist etwas, worüber Browser uneins sind
– und sie schweigen dabei. Wer umschaltet, ändert die Beleuchtung und nicht den
Augenblick.

Zuerst zu sehen ist das Bildschirmfoto – die Zeitraffer legen sich darüber,
sobald sie spielen können. Bleiben sie aus, weil die Leitung langsam ist oder
kein Decoder mag, bleibt das Bildschirmfoto stehen. Bei
`prefers-reduced-motion` wird gar keine Videodatei erst angefordert.

Die helle Aufnahme liegt unten und bleibt deckend, die dunkle darüber wird ein-
und ausgeblendet. So blitzt beim Wechsel nie das Bildschirmfoto zwischen zwei
halbdurchsichtigen Videos durch.

Die Schleife läuft nicht über `loop`, sondern wird von Hand geschlossen: Endet
eine Aufnahme, beginnen beide von vorn. Mit `loop` springt jede für sich zurück,
und die Latenz dieses Rücksprungs summiert sich – gemessen ein halber Sekunden-
versatz je Minute. Gemeinsam umgebrochen bleiben sie unter drei Hundertsteln.

### Kurzübersicht
Drei Zeilen unter dem Eingangsbereich zeigen, was der Playground enthält:
Datensatzvorschau, Trainingsmetriken, Auswertung. Ab `lg` wechselt das Bild von
Zeile zu Zeile die Seite. Im Markup steht der Text immer vor dem Bild – das ist
die Lesereihenfolge, wenn beides untereinander steht; der Wechsel entsteht
allein daraus, dass jede zweite Zeile ihr Bild nach vorn zieht.

Jedes Bildschirmfoto sitzt im selben Rahmen: ein Kasten im Verhältnis 4:3 mit
Rand und gedämpftem Grund, in den das Bild hineinskaliert wird. Die Ausrichtung
ändert damit, was im Kasten steht, nie den Kasten – das ist es, was ein hohes
Panel und eine breite Wahrheitsmatrix in denselben Takt bringt. Der Grund ist
`bg-muted/50` und nicht `bg-card`, weil die aufgenommenen Panels selbst `bg-card`
sind; so setzen sie sich in beiden Schemata ab.

Wie in der Kachel liegen zwei `<img>` übereinander, und `dark:hidden` entscheidet.
Ein `<picture>` täte es nicht: das folgt der Systemeinstellung und nicht der
Wahl der lesenden Person. Anders als in der Kachel wird hier `loading="lazy"`
gesetzt – die Zeilen stehen unter dem Falz. Das bringt nebenbei mit, dass ein
per `display: none` verstecktes Bild den sichtbaren Bereich nie schneidet und
deshalb gar nicht erst geladen wird: Es kommen nur die vier Dateien des gerade
gewählten Schemas an, und die erst beim Scrollen.

Das Inferenzpanel steht in der dritten Zeile verkleinert über der
Wahrheitsmatrix statt in einer vierten Zeile. Eine vierte Zeile für ein Panel
dieser Breite würde den Abschnitt strecken, ohne einen Takt hinzuzufügen. Unter
`sm` fällt der Einschub weg – dort läge er auf der Matrix statt neben ihr.

### Aufgabenkarussell
Die Karten führen in den Materialbereich der Dokumentation, eine Aufgabe je
Schwerpunkt und zuletzt eine Karte auf die Übersicht. Die Liste steht von Hand
in `TaskCarousel.tsx`. Das Material liegt in einem anderen Repository, das
privat und noch nicht veröffentlicht ist; es gäbe zur Bauzeit nichts zu lesen,
was diesen Build nicht an eine Arbeitskopie jenes Repositoriums bände, und zur
Laufzeit nichts abzurufen – die Dokumentation ist eine Anwendung ohne
Suchindex, Sitemap oder Feed. Ändern sich Aufgaben, ist die Liste hier
nachzuziehen. Die Adressen selbst werden aus `docsUrl` gebaut.

Die Spur ist ein Scrollbereich mit Rastpunkten und kein Karussell aus einer
Bibliothek. Jede Karte ist ein Link, steht also ohnehin in der Tab-Reihenfolge,
und ein fokussiertes Element holt der Browser von selbst ins Bild – damit ist
die Tastaturbedienung erledigt, und genau dafür wäre die Bibliothek da. Die
beiden Pfeilknöpfe sind bewusst redundant: Sie sind für den Zeiger, dem mit der
ausgeblendeten Bildlaufleiste der Hinweis fehlt, dass es weitergeht. Auf
schmalen Bildschirmen entfallen sie, dort lugt stattdessen die nächste Karte
hervor.

Ob das Blättern gleitet oder springt, fragt die Komponente nicht: Sie ruft
`scrollBy` ohne `behavior` auf, und `scroll-behavior` steht in `index.css` unter
`prefers-reduced-motion` – dieselbe Abfrage, die auch die Kachel stillstellt.
Das `py-2` an der Spur ist nicht Zierde: `overflow-x` rechnet `overflow-y`
ebenfalls auf `auto`, und ohne die zwei Zeilen Luft schnitte der Scrollbereich
den Fokusring der Karten oben und unten ab.

### Bildschirmfotos
Die zehn Aufnahmen in `public/` entstehen mit dem Aufnahmewerkzeug der
Dokumentation, gesteuert über das Rezept `_arbeit/aufnahmen.json`:

```
node ../model-playground-docs/_arbeit/aufnahme.mjs _arbeit/aufnahmen.json
```

Das Werkzeug wird bewusst nicht kopiert – eine zweite Fassung wäre eine zweite
zu pflegende. Das Rezept trainiert das Modell aus dem hinterlegten Link, damit
die Kanten eingefärbt sind, und nimmt danach dasselbe Fenster hell und dunkel
auf: 1440×900 bei doppelter Pixeldichte, also 2880×1800.

Nach der Kachel nimmt dasselbe Rezept die vier Panels der Kurzübersicht auf –
Datensatzvorschau, Trainingsmetriken, Wahrheitsmatrix und Inferenzpanel –, und
zwar jedes zweimal. `ausschnitt` schneidet dabei auf ein Element zu, `rand` gibt
die Luft ringsum, `fenster` und `dichte` bestimmen die Ausgabegröße, und
`isolieren` blendet für die Dauer der Aufnahme die Zeichenfläche aus, damit
Knoten und Kanten nicht durch die runden Ecken der Panels stehen.

Alle zehn Aufnahmen entstehen **in einer Sitzung an einem trainierten Modell**.
Das ist keine Bequemlichkeit: Nur so zeigen helle und dunkle Wahrheitsmatrix
dieselben Zahlen und das Metrikpanel dieselben Kurven. Das Farbschema wird dabei
nicht emuliert, sondern im Playground umgeschaltet – das Werkzeug stellt
`prefers-color-scheme` global auf hell, und nur der Umschalter in der Anwendung
setzt sich darüber hinweg. Daraus folgt die Reihenfolge im Rezept: erst alle
dunklen Aufnahmen zusammenhängend, dann ein einziger Klick zurück auf hell, dann
dieselben vier noch einmal. Die Beschriftung des Schalters dreht sich dabei um
(`Darkmode aktivieren` / `Lightmode aktivieren`). Zu beachten ist außerdem, dass
sich das Werkzeug die zuletzt gesetzte Fenstergröße merkt: Wer sie für ein Panel
anhebt, muss sie im nächsten Eintrag ausdrücklich zurücksetzen.

Gegenüber den Rezepten der Dokumentation stehen die Datensatzaufnahmen hier auf
`rand: 0` statt `12`. Die zwölf Pixel fangen einen Streifen der abgedunkelten
Überlagerung hinter dem Dialog mit ein; im Artikel liest sich das als Tiefe, in
einem gerahmten Kasten auf heller Fläche als schmutzige Kante – und im dunklen
Schema verschwindet der Streifen, sodass die beiden Varianten nicht mehr
zueinander passen.

Es legt PNG ab; anderes kann das Werkzeug nicht. Als Titelbild sind die Dateien
damit rund 1,7 MB schwer, also werden sie umgerechnet:

```
cd public && for f in hero-hell hero-dunkel datensatz-hell datensatz-dunkel \
                      metriken-hell metriken-dunkel wahrheitsmatrix-hell \
                      wahrheitsmatrix-dunkel inferenz-hell inferenz-dunkel; do
    cwebp -q 82 "$f.png" -o "$f.webp" && rm "$f.png"
done
```

### Zeitraffer
Die vier Videodateien in `public/` entstehen mit einem eigenen Werkzeug, das
den Playground fernsteuert und dabei mitschneidet:

```
node _arbeit/aufzeichnung.mjs _arbeit/aufzeichnungen.json
```

Braucht Node 22, Google Chrome und ffmpeg. Es baut das Modell Schicht für
Schicht über die Bedienoberfläche auf, trainiert es und rechnet den Mitschnitt
in `webm` und `mp4` um: 1920×1200, knapp zwölf Sekunden, je etwa 0,7 MB. Menüs
und Einblendungen sind währenddessen unsichtbar geschaltet – zu sehen ist
allein die Zeichenfläche. Wie schnell das Ergebnis läuft, steht als
`geschwindigkeit` im Rezept.

Zeitraffer und Bildschirmfotos zeigen denselben Zustand, das eine im Werden,
das andere fertig. Ändert sich das Modell, sind beide neu aufzunehmen. Wie das
zusammenhängt und worauf beim Ändern des Rezepts zu achten ist, steht in
`_arbeit/aufzeichnungen.md`.
