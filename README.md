# KI-Deck Huttwil

Interne Plattform der Schule Huttwil zum Arbeiten mit Künstlicher Intelligenz (KI) im Schulalltag.

Das Projekt besteht aus:

- einer **statischen Landing Page** für alle Lehrpersonen  
- einem **Backend** (Docker + Node.js), das Inhalte auf der **Schul-Nextcloud** speichert  
- einer geplanten **Admin-Oberfläche**, mit der eine verantwortliche Person Inhalte pflegen kann

Ziel:  
Die Schule erhält einen klar strukturierten Einstieg in das Thema KI (z. B. fobizz, interne Leitplanken, Challenges, Fragen & Antworten), ohne dass Daten unkontrolliert in externe Cloud-Dienste abfliessen.

---

## 1. Projektüberblick

### 1.1 Frontend

- statische HTML/CSS/JS (keine Frameworks)
- Landing Page mit sechs Kacheln:
  - Sitzungs-Inputs
  - Fragen & Antworten
  - KI-News
  - Challenge
  - Support
  - Leitplanken & Grundlagen
- modernes Kartenlayout mit Farbverläufen
- Overlay-Panel in der Bildschirmmitte mit FLIP-Animation:
  - Karte wird angeklickt
  - Overlay öffnet sich aus der Kartenposition in die Bildschirmmitte
  - Overlay schliesst zurück in die Ausgangsposition
- kleiner „Nach oben“-Button (Floating Action Button) in der Ecke

Aktuell sind die Inhalte in `scripts/main.js` noch **statisch** hinterlegt, aber bereits so strukturiert, dass sie später aus dem Backend bezogen werden können.

Wichtiger Projektentscheid:  
Die Landing Page ist **eingefroren**.  
Layout und Verhalten (Animationen, Hover, Overlay) gelten als fix und sollen nur noch minimal ergänzt werden (z. B. API-Fetch), aber nicht mehr optisch umgebaut werden.

---

### 1.2 Backend

- `backend/`-Verzeichnis mit einer Node.js/Express-Applikation
- läuft im Schulnetz in einem Docker-Container
- spricht per WebDAV mit der Schul-Nextcloud
- speichert alle Daten als JSON-Dateien in einem klar definierten Ordner:

  ```text
  /KI-Deck/
    qa.json
    news.json
    challenge.json
    tickets/
      ticket_<id>.json
    logs/
      events.log (optional für spätere Erweiterungen)

bietet eine REST-API an:

öffentliche Endpunkte für die Landing Page (nur Lesezugriff)

geschützte Admin-Endpunkte (CRUD)

Die Authentifizierung ist minimalistisch und schultauglich:

kein Benutzername

einziges Admin-Passwort (in .env)

Login liefert einen JWT-Token

Admin-Endpunkte sind mit Middleware geschützt

1.3 Admin-UI (geplant)

wird unter /admin/ liegen (separater Ordner)

öffentlicher Zugang → Login → Admin-Passwort

nach Login Zugriff auf:

F&A (Fragen & Antworten) verwalten

News verwalten

Challenge bearbeiten (Titel, Text, Deadline)

Support-Tickets einsehen

Layout (Planung):

linke Spalte: Navigation (F&A, News, Challenge, Tickets, Logout)

rechte Seite: Liste + Editor

Fokus auf Klarheit, nicht auf Show-Effekte

Der Admin-Bereich ist bewusst von der öffentlichen Landing Page getrennt.

2. Verzeichnisstruktur des Repos

Ein mögliches Layout (Stand jetzt):

/
  index.html
  styles/
    main.css
  scripts/
    main.js
  assets/
    logo-huttwil.svg
    (weitere Grafiken bei Bedarf)

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

3. Frontend im Detail
3.1 Landing Page

Die Landing Page liegt im Projektroot als index.html mit:

Header mit Schullogo und Titel „KI an der Schule Huttwil“

Grid mit sechs Kacheln (Buttons)

Footer mit kleinem Status („Schule Huttwil · KI-Deck · Demo …“)

Overlay-Komponente (dialog-ähnlich)

„Zurück nach oben“-Button

Die eigentliche Logik zum Öffnen des Overlays und zur Animation liegt in scripts/main.js.

3.2 Overlay und Animation

main.js:

registriert Klicks auf .app-card

ermittelt die Position und Grösse der Karte (getBoundingClientRect)

berechnet daraus eine Starttransformation (Skalierung + Translation), damit das Overlay „aus der Karte heraus“ wächst

positioniert das Panel zentriert im Viewport

animiert von Kartenposition → Mitte

beim Schliessen: animiert zurück zur ursprünglichen Kartenposition

Diese FLIP-Animation ist bewusst so umgesetzt, dass sie:

flüssig wirkt

für eine Demonstration geeignet ist

keine Abhängigkeit zu externen Libraries hat

Inhaltlich rendert das Overlay je nach Karte:

statischen Text (z. B. Sitzungs-Inputs, News, Leitplanken)

strukturierte Anzeige (Fragen & Antworten, Challenge)

3.3 F&A (Fragen & Antworten)

Im Overlay:

Avatar mit Initialen (Name der fragenden Person)

Hintergrundfarbe des Avatars anhand eines Hashes des Namens (stabile Farbe)

Frage (fett)

Meta-Zeile: Name · Datum

elegant gesetzter Pfeil (›) rechts, der sich beim Öffnen dreht

Antwort in einem einklappbaren Bereich:

standardmässig geschlossen

öffnet beim Klick auf den Header

schliesst beim erneuten Klick

Antworttext kursiv

Links sind anklickbar (z. B. pointerpointer.com als Demo-Gag)

feine Trennlinien zwischen den Beiträgen

Ziel:

F&A wirkt wie ein internes, geordnetes „Fragenbrett“, nicht wie ein Chat.

3.4 Challenge

Im Overlay:

Titel: „Schulhaus-Prompt-Battle“

Lead-Text

horizontale Trennlinie

kleine Badge rechts oben: „Deadline: …“

Highlight-Box mit weichem Verlauf und Schatten:

kurze Beschreibung der Aufgabe

Beispiel-Prompt

Abschnitt „Was du einreichen sollst“

zwei Buttons:

„Einreichen“

„Letzte Gewinner“

Aktuell ist die Challenge noch statisch im JS hinterlegt. Später wird sie via Backend und Nextcloud gepflegt.

4. Backend im Detail

Das Backend liegt im Verzeichnis backend/.

4.1 Technologie-Stack

Node.js

Express

WebDAV-Client (webdav-Package)

JWT (jsonwebtoken)

Docker als Laufzeitumgebung

Konfiguration via .env

4.2 Wichtige Dateien

backend/package.json
– beschreibt Abhängigkeiten und Startskripte

backend/Dockerfile
– definiert das Container-Image

backend/docker-compose.yml
– steuert den Container (Port, env, Restart-Policy)

backend/src/server.js
– Einstiegspunkt, bindet Routen und Middleware ein

backend/src/routes/*.js
– einzelne Routen für Public, Auth und Admin-CRUD

backend/src/services/nextcloud.js
– WebDAV-Client für Nextcloud

backend/src/services/storage.js
– Wrapper zum Laden/Speichern von JSON-Dateien auf Nextcloud

backend/src/middleware/adminOnly.js
– prüft den JWT-Token und schützt Admin-Routen

4.3 .env-Konfiguration

Die Datei .env (lokal, nicht commiten) basiert auf .env.example:

PORT=8080

ADMIN_PASSWORD=einStarkesPasswort

NEXTCLOUD_BASE_URL=https://nextcloud.schule-huttwil.ch
NEXTCLOUD_USER=ki-deck-service
NEXTCLOUD_PASSWORD=geheimesPasswort
NEXTCLOUD_ROOT_PATH=/KI-Deck


ADMIN_PASSWORD wird für Login und Signatur des JWT verwendet

Nextcloud-Zugänge sind reine Service-Zugänge (keine Personalkonten)

4.4 API-Übersicht
Öffentliche Routen (für Landing Page)

GET /api/qa
liefert eine Liste von F&A-Einträgen

GET /api/news
liefert eine Liste von News

GET /api/challenge
liefert die aktuell aktive Challenge

POST /api/ticket
nimmt ein Support-Ticket entgegen und speichert es als Datei

Auth-Route

POST /api/auth/login
Body: { "password": "<ADMIN_PASSWORD>" }
Wenn korrekt → Antwort { token: "<JWT>" }

Dieser Token muss im Admin-UI bei Admin-Routen im Header mitgeschickt werden:

Authorization: Bearer <JWT>

Admin-Routen (CRUD, nur mit Token zugänglich)

GET /api/admin/qa

POST /api/admin/qa

PUT /api/admin/qa/:id

DELETE /api/admin/qa/:id

GET /api/admin/news

POST /api/admin/news

PUT /api/admin/news/:id

DELETE /api/admin/news/:id

GET /api/admin/challenge

PUT /api/admin/challenge

GET /api/admin/tickets

Diese Endpunkte greifen jeweils lesend/schreibend auf die entsprechenden JSON-Dateien auf Nextcloud zu.

5. Daten auf Nextcloud
5.1 Ordnerstruktur

Auf Nextcloud (Schul-Nextcloud) wird ein Ordner eingerichtet, z. B.:

/KI-Deck/
  qa.json
  news.json
  challenge.json
  tickets/
    ticket_20250212_093012.json
    ...
  logs/
    events.log          (optional, für spätere Erweiterungen)

5.2 Beispielstrukturen
qa.json
{
  "items": [
    {
      "id": "qa_001",
      "question": "Darf ich KI für Arbeitsblätter verwenden?",
      "answer": "Ja. Wenn du keine personenbezogenen Daten eingibst.",
      "link": "https://pointerpointer.com",
      "name": "Anna Keller",
      "date_display": "12. Februar 2025",
      "created_at": "2025-02-12T10:00:00Z"
    }
  ]
}

news.json
{
  "items": [
    {
      "id": "news_001",
      "title": "KI-Basis-Schulung",
      "body": "Am Pädagogischen Tag im März ...",
      "created_at": "2025-02-10T09:00:00Z",
      "visible_from": "2025-02-10T00:00:00Z",
      "visible_to": null
    }
  ]
}

challenge.json
{
  "id": "challenge_current",
  "title": "Schulhaus-Prompt-Battle",
  "lead": "Die aktuelle Challenge der Schule Huttwil.",
  "html": "<div class='challenge-divider'>...</div>",
  "deadline": "2025-02-22"
}

Tickets

/tickets/ticket_20250212_093012.json:

{
  "id": "ticket_20250212_093012",
  "created_at": "2025-02-12T09:30:12Z",
  "from": "lehrperson@schule.ch",
  "topic": "Fobizz-Zugang",
  "body": "Ich bekomme keine Mail ...",
  "status": "open"
}

6. Betriebsszenarien
6.1 Lokal bei dir zu Hause (Entwicklung)

Für dich persönlich, ohne Docker, ohne Schulnetz:

cd backend
cp .env.example .env   # Werte eintragen (für Tests evtl. Dummy)
npm install
npm run dev


Dann:

http://localhost:8080/api/qa

Für Entwicklung kann der Storage bei Bedarf auf „lokale Dateien“ umgestellt werden (z. B. eigener storage-local.js). Das lässt sich später wieder auf Nextcloud zurückdrehen.

6.2 Im Schulnetz (Produktivbetrieb, Docker)

Dieser Abschnitt ist für die Schul-ICT gedacht:

cd backend
cp .env.example .env     # Parameter setzen
docker-compose up -d --build


Der Dienst läuft dann z. B. auf:

http://<server-ip>:8080/api/qa

Firewall: Port 8080 nur im LAN verfügbar machen, kein Zugriff von aussen.

7. Frontend-Anbindung an das Backend

Aktuell ist das Frontend noch statisch.
Später kann man schrittweise umstellen:

Beispiel (Pseudo):

fetch("/api/qa")
  .then(r => r.json())
  .then(items => {
    // F&A-Overlay nicht mehr aus statischem Array aufbauen,
    // sondern aus items.
  });


Ziel:
Optik und Verhalten bleiben identisch, nur die Datenquelle wechselt von „hardcodiert in main.js“ auf „Backend-API / Nextcloud“.

8. Admin-UI (Planung und Erweiterung)

Der Admin-UI-Bereich soll:

in /admin/ liegen

Login mit Passwort machen (POST /api/auth/login)

Token im Speicher halten (z. B. localStorage oder in Memory)

CRUD-Operationen aufrufen (/api/admin/...)

Änderungen an F&A, News, Challenge, Tickets ermöglichen

Weitere Details werden in separaten Schritten im Projekt konkretisiert.

9. Sicherheit und Datenschutz

Alle Daten liegen auf Schul-Nextcloud (CH-Recht, interne Policies)

Backend läuft im Schulnetz (kein öffentlicher Port)

Ein einziges Admin-Passwort (für kleine Organisationen realistischer als komplexes Rollenmodell)

Kein Tracking, keine externen Services, keine Drittanbieter-Skripte im Frontend

Landing Page ist statisch (keine Formulare mit Personendaten)

10. Wartung und Weiterentwicklung

Mögliche nächste Schritte:

Admin-UI bauen (/admin/)

Logs in /KI-Deck/logs/events.log schreiben (z. B. „Challenge geändert“, „F&A ergänzt“)

Rollenmodell erweitern (z. B. zwei Admin-Passwörter für verschiedene Verantwortliche)

Export/Backup-Funktion (z. B. als Download aller JSON-Daten)

Überprüfung der Texte auf barrierearme Sprache und klare Hinweise zum Datenschutz

Stand:
Diese README beschreibt den Zustand, bei dem die Landing Page fertig designt ist und das Backend-Skelett mit Nextcloud-Bridge steht.
Weitere Anpassungen am Frontend erfolgen nur noch sehr gezielt (z. B. Umstellung auf Backend-Daten), nicht am Layout.
