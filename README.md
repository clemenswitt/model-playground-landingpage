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
        "description": "Virtuelle Lernumgebung, in der Lernende mit der Struktur neuronaler Netze experimentieren. Kein Code, keine Installation, keine Anmeldung",
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
| `public/{hero,wahrheitsmatrix}-*.webp` | die Bildschirmfotos, die für sich stehen: Kachel und Wahrheitsmatrix |
| `public/{hero,datensatz,metriken,inferenz,teilen}-*.webm`, `.mp4` | die fünf Aufzeichnungen, je hell und dunkel |
| `public/{datensatz,metriken,inferenz,teilen}-*.webp` | deren Standbilder, aus der Aufzeichnung selbst geschnitten |
| `_arbeit/aufzeichnung.mjs` | Werkzeug, das die Aufzeichnungen aufnimmt |

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
Bildschirmfoto fertig zeigt. Er kommt aus derselben Komponente wie die vier
Aufzeichnungen der Kurzübersicht darunter; wie die funktioniert, steht in
[Aufzeichnungen auf der Seite](#aufzeichnungen-auf-der-seite).

### Aufzeichnungen auf der Seite
Fünf Ansichten der Seite bewegen sich: die Kachel und die vier Zeilen der
Kurzübersicht. Alle fünf gehen durch `Screencast.tsx`, das über einem
Bildschirmfoto liegt und dieselbe Aufnahme in zwei Farbschemata hält.

**Beide** Fassungen werden geladen und laufen dauerhaft; das Farbschema
entscheidet nur, welche gemalt wird. Das sind mehr Bytes, als eine zu laden und
die andere bei Bedarf nachzuholen, und es ist Absicht: So stehen beide von
selbst an derselben Stelle, und es gibt nichts zu merken, wiederherzustellen
oder nachzuprüfen. Ein frisch geladenes Video an eine Stelle zu setzen ist etwas,
worüber Browser uneins sind – und sie schweigen dabei. Wer umschaltet, ändert
die Beleuchtung und nicht den Augenblick.

Zuerst zu sehen ist das Bildschirmfoto – die Aufzeichnung legt sich darüber,
sobald sie spielen kann. Bleibt sie aus, weil die Leitung langsam ist oder kein
Decoder mag, bleibt das Bildschirmfoto stehen. Bei `prefers-reduced-motion`
wird gar keine Videodatei erst angefordert, und vier der fünf Aufzeichnungen
stehen unter dem Falz: Sie werden erst angefordert, wenn sie in die Nähe des
sichtbaren Bereichs kommen. Einmal angefordert, bleiben sie – auf dem Weg
zurück nach oben wieder auszuladen brächte nichts ein.

Die helle Aufnahme liegt unten und bleibt deckend, die dunkle darüber wird ein-
und ausgeblendet. So blitzt beim Wechsel nie das Bildschirmfoto zwischen zwei
halbdurchsichtigen Videos durch.

Die Schleife läuft nicht über `loop`, sondern wird von Hand geschlossen: Ist die
spätere der beiden durch, beginnen beide von vorn. Mit `loop` springt jede für
sich zurück, und die Latenz dieses Rücksprungs summiert sich – gemessen ein
halber Sekundenversatz je Minute. Gemeinsam umgebrochen bleiben sie unter drei
Hundertsteln. Umgebrochen wird mit der späteren und nicht mit der ersten, weil
ein Paar selten auf dieselbe Länge kommt: Es sind zwei Läufe desselben Wegs
durch den Playground, und ein Dialog, der einmal schneller lädt, verkürzt einen
davon. Wer zuerst durch ist, wartet auf seinem letzten Bild – und das ist genau
das Standbild, das dort ohnehin liegt.

### Kurzübersicht
Vier Zeilen unter dem Eingangsbereich zeigen, was der Playground enthält:
Datensatzvorschau, Trainingsmetriken, Auswertung, Teilen. Ab `lg` wechselt das Bild von
Zeile zu Zeile die Seite. Im Markup steht der Text immer vor dem Bild – das ist
die Lesereihenfolge, wenn beides untereinander steht; der Wechsel entsteht
allein daraus, dass jede zweite Zeile ihr Bild nach vorn zieht.

Welche der beiden Spalten die breitere ist, entscheidet die Form der Aufnahme
und nicht die Seite: Eine breite Ansicht – der Datensatzdialog – nimmt die 60
und bleibt so hoch wie der Text daneben. Ein hochkantes Panel nimmt die 40; in
der breiten Spalte wüchse es auf die doppelte Höhe seines eigenen Absatzes und
machte aus einer Zeile eine Seite.

Zwei Zeilen gehen darüber hinaus und nehmen zwei Drittel: die Wahrheitsmatrix
mit dem Inferenzpanel darauf und das ganze Fenster beim Teilen. Beide zeigen
mehr als ein Panel, und was in ihnen steht – ein zweites Panel, ein Modell samt
QR-Code – bliebe auf drei Fünfteln zu klein, um es noch zu lesen. Im Bauteil ist
das `wide`.

Um die Aufnahmen liegt kein Rahmen. Sie bringen selbst einen mit – drei sind
ein Panel des Playgrounds, mit eigenem Rand und runden Ecken, die vierte ist wie
die Kachel sein ganzes Fenster –, und ein zweiter Kasten darum machte das Bild
nur kleiner. Was sie von der Seite abhebt, ist der Schatten aus `index.css`,
derselbe wie unter der Kachel, nur flacher.

Wie in der Kachel liegen zwei `<img>` übereinander, und `dark:hidden` entscheidet.
Ein `<picture>` täte es nicht: das folgt der Systemeinstellung und nicht der
Wahl der lesenden Person. Anders als in der Kachel wird hier `loading="lazy"`
gesetzt – die Zeilen stehen unter dem Falz. Das bringt nebenbei mit, dass ein
per `display: none` verstecktes Bild den sichtbaren Bereich nie schneidet und
deshalb gar nicht erst geladen wird: Es kommen nur die Dateien des gerade
gewählten Schemas an, und die erst beim Scrollen.

Über drei der vier Bilder läuft eine Aufzeichnung derselben Ansicht; über dem
der Wahrheitsmatrix liegt sie allein in deren Einschub. Gezeigt wird jeweils der
eine Handgriff, für den die Ansicht da ist: ein Datensatz, der ausgelesen wird,
ein Trainingslauf, der seine Kurven füllt, ein anderes Beispiel, das durch das
Modell geht, eine fertige Struktur, die zum QR-Code wird. Die Matrix selbst
bekommt keine: Sie ist die Ablesung eines fertigen Laufs, an ihr ist nichts, dem
man beim Geschehen zusehen könnte. Das Bildschirmfoto darunter ist der letzte
Augenblick der jeweiligen Aufzeichnung.

Das Inferenzpanel steht in der dritten Zeile verkleinert über der
Wahrheitsmatrix statt in einer Zeile für sich. Eine eigene Zeile für ein Panel
dieser Breite würde den Abschnitt strecken, ohne einen Takt hinzuzufügen. Unter
`sm` fällt der Einschub weg – dort läge er auf der Matrix statt neben ihr.

Das Metrikpanel geht den umgekehrten Weg und wird kleiner gezeichnet, als seine
Spalte hergäbe. Es ist die einzige Ansicht, die höher als breit ist, und das
schlägt in beiden Anordnungen durch: Ab `lg` stand es selbst in der schmalen
Spalte anderthalbmal so hoch wie der Absatz daneben, darunter – wo jede Zeile
einspaltig steht und jede Aufnahme die ganze Seitenbreite hat – halb so hoch
wie ein Telefonbildschirm. Die Aufnahme selbst ist für beides nicht angetastet:
Das Panel behält seine Maße und sein ganzes Diagramm, es wird nur kleiner
dargestellt.

Die beiden Anordnungen kommen zu diesem Maß auf verschiedenen Wegen, weil sie
verschiedene Fragen stellen. Ab `lg` ist es eine Frage des Zeilenbilds: Die
Aufnahme nimmt drei Viertel ihrer Spalte, und dass es drei Viertel sind, steht
als `threeQuarters` an der Zeile. Darunter ist es eine Frage der Form: Keine
Aufnahme soll höher werden, als ihre Spalte breit ist – das Maß, das die
quadratische Datensatzvorschau von sich aus hat. Die Regel dafür steht in
`index.css`; das Seitenverhältnis reicht die Komponente aus den Maßen der
Aufnahme selbst hinein, sodass sie auch für eine künftige hochkante Ansicht
gilt und nicht nur für diese eine.

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
Vier Aufnahmen in `public/` sind reine Bildschirmfotos: die beiden der Kachel
und die beiden der Wahrheitsmatrix. Sie entstehen mit dem Aufnahmewerkzeug der
Dokumentation, gesteuert über das Rezept `_arbeit/aufnahmen.json`:

```
node ../model-playground-docs/_arbeit/aufnahme.mjs _arbeit/aufnahmen.json
```

Das Werkzeug wird bewusst nicht kopiert – eine zweite Fassung wäre eine zweite
zu pflegende. Für die Kachel trainiert das Rezept das Modell aus dem hinterlegten
MNIST-Link, damit die Kanten eingefärbt sind, und nimmt dasselbe Fenster hell und
dunkel auf: 1440×900 bei doppelter Pixeldichte, also 2880×1800. `ausschnitt`
schneidet dabei auf ein Element zu, `rand` gibt die Luft ringsum, `fenster` und
`dichte` bestimmen die Ausgabegröße, und `isolieren` blendet für die Dauer der
Aufnahme die Zeichenfläche aus, damit Knoten und Kanten nicht durch die runden
Ecken des Panels stehen.

Die beiden Wahrheitsmatrizen bringen danach einen **eigenen Link** mit und
trainieren ein zweites Modell: CIFAR-10 statt MNIST. Auf MNIST ist die Matrix
eine saubere Diagonale und sagt damit nichts über das, was der Text daneben
behauptet – welche Klasse mit welcher verwechselt wird. Es ist derselbe Link, aus
dem die Inferenzaufzeichnung entsteht; wer eines von beiden erneuert, muss das
andere mitnehmen.

Die Standbilder der vier bewegten Ansichten stehen **nicht** in diesem Rezept.
Sie kommen aus der Aufzeichnung selbst (siehe unten), denn ihr Ausschnitt wäre
mit einem Bildwerkzeug gar nicht zu treffen: Beim Inferenzpanel gehört die
Beispielauswahl mit ins Bild, und die gibt es erst mitten im Lauf.

Beide Wahrheitsmatrizen entstehen **in einer Sitzung an einem trainierten
Modell**. Das ist keine Bequemlichkeit: Nur so zeigen helle und dunkle Fassung
dieselben Zahlen. Das Farbschema wird dabei nicht emuliert, sondern im
Playground umgeschaltet – das Werkzeug stellt `prefers-color-scheme` global auf
hell, und nur der Umschalter in der Anwendung setzt sich darüber hinweg. Daraus
folgt die Reihenfolge im Rezept: erst die dunkle Aufnahme, dann ein einziger
Klick zurück auf hell. Ob eine Farbwahl den Wechsel des Links überlebt, ist
nicht zugesichert; das Rezept klickt den Umschalter deshalb nicht blind, sondern
prüft erst den Stand. Die Beschriftung des Schalters dreht
sich dabei um (`Darkmode aktivieren` / `Lightmode aktivieren`). Zu beachten ist
außerdem, dass sich das Werkzeug die zuletzt gesetzte Fenstergröße merkt: Wer
sie für ein Panel anhebt, muss sie im nächsten Eintrag ausdrücklich zurücksetzen.

Es legt PNG ab; anderes kann das Werkzeug nicht. Als Titelbild sind die Dateien
damit rund 1,7 MB schwer, also werden sie umgerechnet:

```
cd public && for f in hero-light hero-dark \
                      wahrheitsmatrix-light wahrheitsmatrix-dark; do
    cwebp -q 82 "$f.png" -o "$f.webp" && rm "$f.png"
done
```

### Aufzeichnungen
Die zwanzig Videodateien in `public/` – fünf Ansichten, je hell und dunkel, je
`webm` und `mp4` – entstehen mit einem eigenen Werkzeug, das den Playground
fernsteuert und dabei mitschneidet:

```
node _arbeit/aufzeichnung.mjs _arbeit/aufzeichnungen.json [id ...] [--behalte]
```

Braucht Node 22, Google Chrome und ffmpeg. Für die Kachel baut es das Modell
Schicht für Schicht über die Bedienoberfläche auf, trainiert es und rechnet den
Mitschnitt in `webm` und `mp4` um: 1920×1200, knapp zwölf Sekunden, je etwa
0,7 MB. Menüs und Einblendungen sind währenddessen unsichtbar geschaltet – zu
sehen ist allein die Zeichenfläche.

Für die Kurzübersicht nimmt dasselbe Werkzeug vier kurze Ausschnitte auf,
jeweils die eine Handlung, für die eine Ansicht da ist: die Vorschau eines
Datensatzes, die sich füllt und durch die geblättert wird; ein Trainingslauf,
dessen Kurven wachsen, mit dem Wechsel in den Reiter `Loss` und zurück; zwei
Pferde aus CIFAR-10, die durch das Modell gehen und die Balken verschieben.
Neun bis elf Sekunden, je 0,2 bis 0,4 MB.

Die fünfte Aufnahme, das Teilen, schneidet nichts aus: Sie zeigt wie die Kachel
das ganze Fenster, weil das Modell dazugehört, das da weitergegeben wird. Erst
steht der fertige Aufbau, dann geht der Teilen-Dialog darüber auf und trägt den
Link als QR-Code. 1440×900, neun Sekunden, je 0,4 bis 0,6 MB.

Vor jeder der drei Panelaufnahmen legt eine Stilregel die Zeichenfläche auf
`visibility: hidden` und schaltet allein den Ausschnitt wieder sichtbar – sonst
stünde in den vier Zwickeln zwischen den runden Ecken des Panels und dem eckigen
Ausschnitt, was dahinter liegt. Beim Datensatzdialog fällt zusätzlich die
abgedunkelte Überlagerung weg, und in jedem Fall die Einblendungen: Der Hinweis
auf den importierten Link steht am oberen Rand und ragte in den Dialog hinein.
Beim Teilen bleibt die Zeichenfläche stehen – sie ist dort das Gezeigte –, und
statt ihrer wird die Überlagerung des Dialogs gedämpft, die das Modell sonst
grau und unscharf zudeckte.

Die Pixeldichte steht als Chrome-Flagge (`--force-device-scale-factor`) und
nicht nur in der Emulation: Chrome 152 liefert die Bilder des Screencasts sonst
in CSS-Pixeln, `maxWidth` hin oder her – ein Panelausschnitt käme mit 300 statt
600 Bildpunkten an und müsste für die Seite hochgerechnet werden. Dasselbe
Verhalten ist im Bildwerkzeug der Dokumentation noch offen, siehe
`_arbeit/aufnahmen.md`.

Aufgenommen wird immer das ganze Fenster; was davon bleibt, entscheidet der
Schritt `ausschnitt`. Er misst ein oder mehrere Elemente und legt sie zum
umschließenden Rechteck zusammen, auf das ffmpeg am Ende zuschneidet. Wo im Lauf
er steht, ist frei – der Zuschnitt wirkt erst beim Umrechnen. `standbild: true`
legt zusätzlich das letzte Bild als WebP daneben; das ist das Bildschirmfoto,
über dem die Aufzeichnung auf der Seite liegt, und es deckt sich mit ihr damit
pixelgenau. Wie schnell das Ergebnis läuft, steht als `geschwindigkeit` im
Rezept, `tempo` rafft einzelne Abschnitte.

Kachelaufnahme und Kachelbildschirmfoto zeigen denselben Zustand, das eine im
Werden, das andere fertig. Ändert sich das Modell, sind beide neu aufzunehmen.
Wie das zusammenhängt und worauf beim Ändern des Rezepts zu achten ist, steht in
`_arbeit/aufzeichnungen.md`.
