/* main.js – Deck: FLIP-Overlay, F&A mit Avatar, Challenge-Highlight */

document.addEventListener("DOMContentLoaded", () => {
  initUpButton();
  initOverlay();
});

function initUpButton() {
  const btn = document.querySelector(".fab-up");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ------------------------------------------------------------------
   Inhalt pro Karte
------------------------------------------------------------------ */

const SECTION_CONTENT = {

  sessions: {
    title: "Sitzungs-Inputs",
    lead: "Kurzinputs und Materialien aus Oberstufe, MR und Primarschulen.",
    body: [
      "Hier landen später Inputs aus Teamsitzungen, MR-Sitzungen und Weiterbildungen.",
      "In dieser Demo dient die Karte nur als Platzhalter."
    ],
    actions: []
  },

  qa: {
    title: "Fragen & Antworten",
    lead: "Digitales Flipchart zu KI, fobizz und Datenschutz.",
    qa: [
      {
        q: "Darf ich KI für Arbeitsblätter verwenden?",
        a: "Ja. Wenn du keine personenbezogenen Daten eingibst. Siehe Link.",
        link: "https://pointerpointer.com",
        name: "Anna Keller",
        date: "12. Februar 2025"
      },
      {
        q: "Kann KI Fehler machen?",
        a: "Ja. Jede Antwort muss kritisch geprüft werden.",
        link: null,
        name: "Thomas Roth",
        date: "10. Februar 2025"
      }
    ],
    actions: [
      { label: "Frage einreichen", variant: "primary" }
    ]
  },

  news: {
    title: "KI-News",
    lead: "Kurze Hinweise und Meldungen.",
    body: [
      "In der Vollversion erscheinen hier Kurzhinweise zu KI-Entwicklungen, die im Schulalltag relevant werden.",
      "Für das Demo-Deck ist dies ein statischer Platzhalter."
    ],
    actions: []
  },

  challenge: {
    title: "Schulhaus-Prompt-Battle",
    lead: "Die aktuelle Challenge der Schule Huttwil.",
    html: `
      <div class="challenge-divider"></div>

      <span class="challenge-badge">Deadline: 22. Februar 2025</span>

      <div class="challenge-highlight">
        <p><strong>Erstelle einen Prompt, der dir im Unterricht echten Mehrwert bringt.</strong></p>
        <p>Zum Beispiel: „Erstelle 5 Verständnisfragen zu diesem Text (A2–B1) und 2 Transferfragen.“</p>
      </div>

      <div class="challenge-section-title">Was du einreichen sollst</div>
      <p>Schreibe deinen Prompt auf, erkläre kurz den Zweck und notiere, was gut funktioniert hat.</p>
      <p>Optional: Notiere, wo die KI Mühe hatte oder Missverständnisse entstanden.</p>
    `,
    actions: [
      { label: "Einreichen", variant: "primary" },
      { label: "Letzte Gewinner", variant: "secondary" }
    ]
  },

  support: {
    title: "Support",
    lead: "Anlaufstelle für Zugänge, Technik und Unterrichtsideen.",
    body: [
      "Hier entsteht ein einfaches Ticketformular für technische Fragen, Zugänge und Unterrichtsideen.",
      "In dieser Demo ist nur der Button sichtbar."
    ],
    actions: [
      { label: "Ticket erstellen", variant: "primary" }
    ]
  },

  guidelines: {
    title: "Leitplanken & Grundlagen",
    lead: "Rahmen, Datenschutz und Orientierungshilfen.",
    body: [
      "In der Vollversion liegen hier interne Merkblätter, DVK-Antworten und Beispiele für KI-Leitplanken.",
      "Das Demo zeigt nur die Struktur, nicht die echten Dokumente."
    ],
    actions: []
  }
};

/* ------------------------------------------------------------------
   Overlay mit FLIP-Animation
------------------------------------------------------------------ */

function initOverlay() {
  const overlay = document.querySelector(".overlay");
  const backdrop = overlay.querySelector(".overlay__backdrop");
  const panel = overlay.querySelector(".overlay__panel");
  const titleEl = overlay.querySelector("#overlay-title");
  const leadEl = overlay.querySelector(".overlay__lead");
  const bodyEl = overlay.querySelector(".overlay__body");
  const actionsEl = overlay.querySelector(".overlay__actions");
  const closeBtn = overlay.querySelector(".overlay__close");

  let lastRect = null;

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".app-card");
    if (!card) return;

    const key = card.dataset.section;
    const content = SECTION_CONTENT[key];
    if (!content) return;

    lastRect = card.getBoundingClientRect();
    fillOverlay(content, bodyEl, actionsEl, titleEl, leadEl);
    openOverlay(overlay, panel, lastRect);
  });

  closeBtn.addEventListener("click", () => {
    closeOverlay(overlay, panel, lastRect);
  });

  backdrop.addEventListener("click", () => {
    closeOverlay(overlay, panel, lastRect);
  });
}

function fillOverlay(content, bodyEl, actionsEl, titleEl, leadEl) {
  titleEl.textContent = content.title;
  leadEl.textContent = content.lead || "";
  bodyEl.innerHTML = "";
  actionsEl.innerHTML = "";

  // F&A
  if (content.qa && content.qa.length > 0) {
    content.qa.forEach((item, index) => {
      const block = document.createElement("div");
      block.classList.add("qa-block");

      const header = document.createElement("div");
      header.classList.add("qa-header");

      const avatar = document.createElement("div");
      avatar.classList.add("qa-avatar");
      avatar.textContent = initials(item.name);
      avatar.style.background = avatarColor(item.name);
      header.appendChild(avatar);

      const textWrap = document.createElement("div");
      textWrap.classList.add("qa-text-wrap");

      const q = document.createElement("p");
      q.className = "qa-question";
      q.textContent = item.q;
      textWrap.appendChild(q);

      const meta = document.createElement("p");
      meta.className = "qa-meta";
      meta.textContent = `${item.name} · ${item.date}`;
      textWrap.appendChild(meta);

      header.appendChild(textWrap);

      const arrow = document.createElement("div");
      arrow.classList.add("qa-arrow");
      arrow.textContent = "›";
      header.appendChild(arrow);

      block.appendChild(header);

      const answerWrap = document.createElement("div");
      answerWrap.classList.add("qa-answer-wrap");

      const answer = document.createElement("p");
      answer.classList.add("qa-answer");

      if (item.link) {
        answer.innerHTML =
          `${item.a} <a href="${item.link}" target="_blank" rel="noopener noreferrer">Link</a>`;
      } else {
        answer.textContent = item.a;
      }

      answerWrap.appendChild(answer);
      block.appendChild(answerWrap);

      header.addEventListener("click", () => {
        block.classList.toggle("open");
      });

      bodyEl.appendChild(block);

      if (index < content.qa.length - 1) {
        const divider = document.createElement("div");
        divider.classList.add("qa-divider");
        bodyEl.appendChild(divider);
      }
    });

  // Challenge mit HTML-Template
  } else if (content.html) {
    bodyEl.innerHTML = content.html;

  // Standard-Text
  } else if (content.body && Array.isArray(content.body)) {
    content.body.forEach(line => {
      const p = document.createElement("p");
      p.textContent = line;
      bodyEl.appendChild(p);
    });
  }

  (content.actions || []).forEach(action => {
    const btn = document.createElement("button");
    btn.textContent = action.label;
    btn.className = action.variant === "primary"
      ? "btn-primary"
      : "btn-secondary";
    actionsEl.appendChild(btn);
  });
}

function openOverlay(overlay, panel, lastRect) {
  overlay.classList.add("overlay--visible");
  document.body.classList.add("no-scroll");

  positionPanel(panel);

  let startTransform = "translate(0,0) scale(1)";
  if (lastRect) {
    startTransform = computeStartTransform(panel, lastRect);
  }

  panel.style.opacity = "0";
  panel.style.transform = startTransform;

  requestAnimationFrame(() => {
    panel.style.transition =
      "transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 240ms ease-out";
    panel.style.transform = "translate(0,0) scale(1)";
    panel.style.opacity = "1";
  });
}

function closeOverlay(overlay, panel, lastRect) {
  let endTransform = "translate(0,0) scale(0.96)";
  if (lastRect) {
    endTransform = computeStartTransform(panel, lastRect);
  }

  panel.style.transition =
    "transform 260ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease-out";
  panel.style.transform = endTransform;
  panel.style.opacity = "0";

  panel.addEventListener("transitionend", () => {
    overlay.classList.remove("overlay--visible");
    document.body.classList.remove("no-scroll");
    panel.style.transform = "";
    panel.style.opacity = "";
    panel.style.transition = "";
  }, { once: true });
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */

function positionPanel(panel) {
  const w = panel.offsetWidth;
  const h = panel.offsetHeight;
  const left = (window.innerWidth - w) / 2;
  const top = (window.innerHeight - h) / 2;
  panel.style.left = `${Math.max(left, 12)}px`;
  panel.style.top  = `${Math.max(top, 12)}px`;
}

function computeStartTransform(panel, rect) {
  const pr = panel.getBoundingClientRect();
  const cx1 = rect.left + rect.width / 2;
  const cy1 = rect.top + rect.height / 2;
  const cx2 = pr.left + pr.width / 2;
  const cy2 = pr.top + pr.height / 2;
  const sx = rect.width / pr.width;
  const sy = rect.height / pr.height;
  const tx = cx1 - cx2;
  const ty = cy1 - cy2;
  return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 55%)`;
}
