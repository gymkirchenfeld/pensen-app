# Web-Client für den neuen Pensenmanager

[Dokumentation](https://craft.rothe.io/Ua4g7o8IbMqe3m)

## Lokale Entwicklung

Vorausgesetzt sind Node 22 und Corepack. Die Yarn-Version ist über das Feld
`packageManager` in der `package.json` auf 4.12.0 festgenagelt — Corepack zieht
sie automatisch, eine manuelle Yarn-Installation ist nicht nötig:

```sh
corepack enable
yarn install
```

| Befehl | Zweck |
| --- | --- |
| `yarn serve` | Dev-Server auf `localhost` |
| `yarn build` | Produktions-Build nach `dist/` |
| `yarn lint` | ESLint über das Projekt |

Das Projekt nutzt Yarn Plug'n'Play, es gibt also kein `node_modules/`.
`yarn.lock` ist eingecheckt und **muss bei jeder Dependency-Änderung
mitcommittet werden** — sonst schlägt die CI fehl (siehe unten).

## Was beim Push nach GitHub passiert

Drei Workflows unter `.github/workflows/`. Welcher läuft, hängt vom Ereignis ab:

| Ereignis | `ci.yml` | `staging.yml` | `release.yml` |
| --- | --- | --- | --- |
| Push auf einen Feature-Branch (ohne offenen PR) | — | — | — |
| Pull Request geöffnet oder aktualisiert | ✅ | — | — |
| Push/Merge nach `main` | ✅ | — | — |
| Manueller Start über die Actions-Oberfläche | — | ✅ | — |
| Push eines Tags `v*` | — | — | ✅ |

Ein Push auf einen Feature-Branch ohne offenen PR löst also nichts aus. Sobald
ein PR offen ist, läuft die CI bei jedem weiteren Push auf diesen Branch.

### CI (`ci.yml`)

Läuft bei Pull Requests und bei Pushes nach `main`:

1. Repository auschecken
2. Corepack aktivieren (muss vor `setup-node` laufen, weil dessen
   Yarn-Caching bereits ein funktionierendes Yarn braucht)
3. Node 22 einrichten, Yarn-Cache wiederherstellen
4. `yarn install --immutable` — bricht ab, sobald der Install das `yarn.lock`
   verändern würde. Das ist der Grund, warum das Lockfile eingecheckt sein muss.
5. `yarn lint --no-fix`
6. `yarn build`

Schlägt einer der Schritte fehl, wird der PR rot markiert. Es wird nichts
veröffentlicht und nichts deployt.

### Staging (`staging.yml`)

Stellt einen Teststand für den Auftraggeber bereit, **bevor** ein Tag gesetzt
wird. Der Workflow wird von Hand gestartet: *Actions → Staging → Run workflow*,
dort im Dropdown den gewünschten Branch wählen. Optional lässt sich eine Notiz
mitgeben, die in der Beschreibung des Prereleases landet.

Gebaut wird der Stand des gewählten Branches. Ergebnis ist ein als
*Pre-release* markiertes Release mit dem Tag `staging-<branch>-<sha>`, an dem
`dist` als `.zip` und `.tar.gz` hängt. Beide Archive enthalten einen Ordner
`dist/`, entpacken sich also nicht in das aktuelle Verzeichnis. Weil das
Repository öffentlich ist, sind die Asset-Links ohne Anmeldung ladbar und können
direkt weitergegeben werden.

Der Titel des Prereleases enthält den Zeitpunkt des Builds in Schweizer Zeit,
etwa `Staging: 001-show-ipb-balances - 11.08.2026 16:42`. Die Releases-Seite
sortiert nämlich nach dem zugrunde liegenden Tag und nicht nach dem Zeitpunkt
des Workflow-Laufs — am Titel erkennst du zuverlässig, welcher Eintrag der
aktuelle ist.

Der Namensraum ist bewusst von den Release-Tags getrennt: `release.yml` reagiert
nur auf `v*`, ein `staging-*`-Tag löst dort also nichts aus. Der SHA im Namen
macht jeden Teststand eindeutig nachvollziehbar. Ein erneuter Lauf auf demselben
Commit ersetzt lediglich die Assets des bestehenden Prereleases.

Prereleases sammeln sich mit der Zeit an — alte Einträge können unter *Releases*
von Hand gelöscht werden (samt Tag über *Delete tag*).

### Release (`release.yml`)

Läuft ausschliesslich bei Tags, die mit `v` beginnen. Der Workflow hat als
einziger Schreibrechte auf das Repository (`contents: write`):

1. Auschecken, Corepack, Node 22, `yarn install --immutable` (wie oben)
2. **Versions-Check**: Der Tag ohne führendes `v` wird mit der Konstante in
   `src/version.js` verglichen. Bei `v3.9.0` muss dort `VERSION = '3.9.0'`
   stehen, sonst bricht der Workflow ab und es entsteht kein Release.
3. `yarn build`
4. `dist/` wird in zwei Formaten gepackt: `pensen-app-<tag>.zip` und
   `pensen-app-<tag>.tar.gz`. Beide enthalten einen Ordner `dist/`, entpacken
   sich also nicht in das aktuelle Verzeichnis.
5. `gh release create --draft` legt ein GitHub-Release zum Tag an, hängt beide
   Archive als Assets an und generiert die Release-Notes aus den Commits seit
   dem letzten Release

Das Release entsteht als **Entwurf** und ist damit zunächst nur für Personen mit
Schreibrechten sichtbar. Titel und Beschreibung lassen sich unter
*Releases → Edit release* frei überarbeiten — die generierten Notes sind nur ein
Startwert. Veröffentlicht wird es erst mit einem Klick auf *Publish release*.

Beachte: Der Release-Workflow führt **kein** Lint aus. Er setzt voraus, dass der
Stand bereits über einen PR durch die CI gelaufen ist.

### Ein Release erstellen

```sh
# 1. src/version.js auf die neue Version setzen und über einen PR nach main
# 2. dann auf main:
git tag v3.9.0
git push origin v3.9.0
```

Passt der Tag nicht zu `src/version.js`, schlägt der Workflow fehl und es
entsteht kein Release. Der Tag bleibt in dem Fall bestehen — er muss lokal und
auf dem Remote gelöscht werden, bevor er korrigiert neu gesetzt werden kann:

```sh
git tag -d v3.9.0
git push origin :refs/tags/v3.9.0
```

## Deployment

Das Deployment ist **nicht** automatisiert. Es läuft weiterhin über die Skripte
im Projektwurzelverzeichnis, die das Ergebnis per `rsync` auf den Zielserver
kopieren:

| Skript | Ziel | baut selbst |
| --- | --- | --- |
| `install-kirchenfeld-prod.sh` | `web4.kinet.ch` | ja |
| `install-kirchenfeld-test.sh` | `web4-test.kinet.ch` | ja |
| `install-hofwil.sh` | `pensen.gymhofwil.ch` | ja |
| `install-app-neufeld.sh` | Server und Pfad als Argumente | nein |

Am Gym Neufeld ist der Build vom Deployment getrennt, deshalb erwartet
`install-app-neufeld.sh` ein bereits gebautes `dist/` und wird mit Zielserver
und Zielpfad aufgerufen:

```sh
./install-app-neufeld.sh <server> <pfad>
```