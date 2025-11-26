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
