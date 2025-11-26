# KI-Deck Huttwil

Interne Plattform der Schule Huttwil zum Arbeiten mit Künstlicher Intelligenz (KI) im Schulalltag.

Das Projekt besteht aus:

- einer statischen Landing Page für alle Lehrpersonen  
- einem Backend (Docker + Node.js), das Inhalte auf der Schul-Nextcloud speichert  
- einer Admin-Oberfläche, mit der eine verantwortliche Person Inhalte pflegen kann  

Ziel ist es, der Schule einen klar strukturierten Zugang zum Umgang mit KI zu geben, ohne dass Daten in externe Cloud-Dienste abfliessen. Die Landing Page bleibt ein reiner Informations- und Demonstrationsbereich. Die Inhalte werden später dynamisch aus dem Backend geladen.

---

## 1. Projektüberblick

### 1.1 Frontend

Das Frontend besteht aus einer statischen Landing Page, die aus reinem HTML, CSS und JavaScript besteht. Sie bietet folgende Elemente:

- Header mit Schullogo und Titel
- Sechs interaktive Kacheln (Sitzungs-Inputs, Fragen & Antworten, KI-News, Challenge, Support, Leitplanken)
- Animation beim Öffnen eines Overlays: FLIP-Animation von der Kartenposition ins Zentrum des Bildschirms
- „Nach oben“-Button (Floating Action Button)
- Fokus auf moderne, klare Optik
- Keine externen Abhängigkeiten, keine externen Skripte

Inhalte wie Fragen & Antworten und die Challenge sind aktuell noch statisch in `scripts/main.js` hinterlegt. Später werden diese Inhalte aus dem Backend geladen. Die Landing Page ist funktional und visuell eingefroren und darf nicht mehr verändert werden.

### 1.2 Backend

Das Backend liegt im Verzeichnis `backend/`. Es handelt sich um eine Node.js-Applikation, die in einem Docker-Container läuft. Das Backend kommuniziert über WebDAV mit der Schul-Nextcloud und speichert dort alle Daten als JSON-Dateien. Die Landing Page greift nur lesend auf das Backend zu.

Das Backend bietet:

- öffentliche Lese-Endpunkte für die Landing Page  
- geschützte Admin-Endpunkte (CRUD)  
- Speicherung aller Inhalte ausschliesslich auf Schul-Nextcloud  
- eine einzige Passwort-Authentifizierung für Admin-Zugriff  
- JWT-basierte Session nach Login  
- saubere Trennung zwischen Public- und Admin-Endpunkten

---

## 2. Verzeichnisstruktur des Projekts

```text
/
  index.html
  styles/
    main.css
  scripts/
    main.js
  assets/
    logo-huttwil.svg

  admin/
    index.html        (geplant)
    main.css          (geplant)
    main.js           (geplant)

  backend/
    Dockerfile
    docker-compose.yml
    package.json
    .env.example
    src/
      server.js
      routes/
        public.js
        auth.js
        admin-qa.js
        admin-news.js
        admin-challenge.js
        admin-tickets.js
      middleware/
        adminOnly.js
        errorHandler.js
      services/
        nextcloud.js
        storage.js
````

---

## 3. Frontend im Detail

### 3.1 Landing Page

Die Landing Page besteht aus einem Grid von sechs Kacheln. Jede Kachel löst beim Anklicken ein Overlay aus, das sich mittels FLIP-Animation aus der Kartenposition vergrössert und zentriert. Die Inhalte der Overlays sind demonstrativ und werden später aus dem Backend geladen.

### 3.2 Overlay und Animation

Das Overlay verwendet eine FLIP-Animation:

* Ermittlung der originalen Position und Grösse der Karte
* Overlay startet exakt an dieser Position
* Animation führt das Overlay ins Zentrum und auf Zielgrösse
* Schliessen animiert zurück an den Ausgangspunkt

Dies erzeugt eine ruhige, hochwertige Interaktionsform ohne Fremdbibliotheken.

### 3.3 Fragen & Antworten

Die F&A-Ansicht im Overlay hat folgende Elemente:

* Avatar mit Initialen (Farbe aus Hash des Namens)
* Frage als fett gesetzter Titel
* Name und Datum der Frage
* kleiner Pfeil rechts (dreht beim Öffnen)
* Antwort in einem einklappbaren Bereich (standardmässig geschlossen)
* Antworttext kursiv
* Links sind klickbar
* feine Trennlinien zwischen Einträgen

Die Darstellung ist klar, übersichtlich und angelehnt an interne FAQs.

### 3.4 Challenge

Die Challenge wird im Overlay mit modernen Designelementen dargestellt:

* Titel der Challenge
* Lead-Text
* horizontale Trennlinie
* Badge mit Deadline
* Highlight-Box mit Verlauf und Schatten
* Beispiel-Prompt
* Abschnitt „Was du einreichen sollst“
* Buttons „Einreichen“ und „Letzte Gewinner“

Auch dieser Bereich ist aktuell noch statisch und wird später durch das Backend befüllt.

---

## 4. Backend im Detail

Das Backend ist als Docker-Service vorgesehen, der im Schulnetz läuft. Es bietet API-Endpunkte, speichert Inhalte auf Nextcloud und verwaltet Admin-Zugriff über ein einziges Passwort.

### 4.1 Technologie-Stack

* Node.js
* Express
* WebDAV-Client
* JWT
* Docker
* Umgebungsvariablen via `.env`

### 4.2 .env-Konfiguration

Die Datei `.env` basiert auf `.env.example` und enthält z. B.:

```env
PORT=8080

ADMIN_PASSWORD=<passwort>

NEXTCLOUD_BASE_URL=https://nextcloud.schule-huttwil.ch
NEXTCLOUD_USER=<service-user>
NEXTCLOUD_PASSWORD=<service-passwort>
NEXTCLOUD_ROOT_PATH=/KI-Deck
```

### 4.3 Daten auf Nextcloud

Auf Nextcloud wird ein Ordner `/KI-Deck/` verwendet:

```text
/KI-Deck/
  qa.json
  news.json
  challenge.json
  tickets/
    ticket_<id>.json
  logs/
    events.log (optional)
```

Diese Dateien werden vollständig über WebDAV gelesen und geschrieben.

### 4.4 API-Endpunkte

Öffentliche Routen für die Landing Page:

```
GET    /api/qa
GET    /api/news
GET    /api/challenge
POST   /api/ticket
```

Admin-Login:

```
POST   /api/auth/login
```

Admin-CRUD:

```
GET    /api/admin/qa
POST   /api/admin/qa
PUT    /api/admin/qa/:id
DELETE /api/admin/qa/:id

GET    /api/admin/news
POST   /api/admin/news
PUT    /api/admin/news/:id
DELETE /api/admin/news/:id

GET    /api/admin/challenge
PUT    /api/admin/challenge

GET    /api/admin/tickets
```

---

## 5. Betriebsszenarien

### 5.1 Entwicklung auf eigenem Rechner

Für lokales Testen ohne Docker:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Die API läuft dann unter:

`http://localhost:8080/api/qa`

### 5.2 Produktivbetrieb im Schulnetz (Docker)

Für die Schul-ICT:

```bash
cd backend
cp .env.example .env
docker-compose up -d --build
```

Prüfen:

`http://<server-ip>:8080/api/qa`

---

## 6. Admin-UI (geplant)

Die Admin-Oberfläche wird unter `/admin/` liegen und bietet:

* Login mit Admin-Passwort
* Navigation in der linken Spalte:

  * F&A
  * News
  * Challenge
  * Tickets
  * Logout
* rechte Seite:

  * Listenansicht
  * Editor zum Bearbeiten und Erstellen

Die Admin-UI wird später implementiert und greift vollständig auf die Admin-API des Backends zu.

---

## 7. Sicherheit und Datenschutz

* alle Daten werden ausschliesslich auf Schul-Nextcloud gespeichert
* Backend läuft im Schulnetz (LAN)
* nur ein Admin-Passwort (keine Personenzuordnung nötig)
* kein Tracking, kein Logging von Personendaten
* keine externen Dienste
* Landing Page ist statisch und enthält keine Formulare mit sensiblen Daten
* WebDAV-Zugang erfolgt über einen dedizierten Service-Account

---

## 8. Weiterentwicklung

Mögliche nächste Schritte:

* Admin-UI implementieren
* Logs ergänzen (Änderungsprotokoll)
* lokale Speicheroption für Offline-Demos
* sanfte Integration der Backend-Daten in die Landing Page

---

Status:
Die Landing Page ist vollständig. Das Backend-Skelett steht. Die Admin-UI folgt im nächsten Schritt.
