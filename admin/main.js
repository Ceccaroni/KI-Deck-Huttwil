// ============================================
// Grundvariablen
// ============================================
let adminToken = null;
let currentView = null;

const loginOverlay = document.getElementById("login-overlay");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const adminPasswordInput = document.getElementById("admin-password");

const adminApp = document.getElementById("admin-app");
const viewContainer = document.getElementById("view-container");

const logoutBtn = document.getElementById("logout-btn");

const navItems = document.querySelectorAll(".nav-item");

// ============================================
// LOGIN
// ============================================
loginBtn.addEventListener("click", async () => {
  const password = adminPasswordInput.value.trim();
  if (!password) {
    loginError.textContent = "Passwort fehlt.";
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!res.ok) {
      loginError.textContent = "Falsches Passwort.";
      return;
    }

    const data = await res.json();
    adminToken = data.token;

    // Login OK → Overlay ausblenden, App anzeigen
    loginOverlay.classList.add("hidden");
    loginOverlay.classList.remove("visible");

    adminApp.classList.remove("hidden");

  } catch (err) {
    loginError.textContent = "Serverfehler.";
    console.error(err);
  }
});

// Login per Enter
adminPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});


// ============================================
// LOGOUT
// ============================================
logoutBtn.addEventListener("click", () => {
  adminToken = null;
  adminApp.classList.add("hidden");
  loginOverlay.classList.remove("hidden");
  loginOverlay.classList.add("visible");
  adminPasswordInput.value = "";
  loginError.textContent = "";
  viewContainer.innerHTML = `<p class="placeholder">Bereich wählen...</p>`;
  navItems.forEach(i => i.classList.remove("active"));
});


// ============================================
// HELFER: Auth-Header
// ============================================
function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${adminToken}`
  };
}

// ============================================
// VIEW-WECHSEL
// ============================================
navItems.forEach(item => {
  item.addEventListener("click", () => {
    const view = item.dataset.view;
    switchView(view);
  });
});

function switchView(view) {
  currentView = view;

  navItems.forEach(i => i.classList.remove("active"));
  document.querySelector(`.nav-item[data-view="${view}"]`).classList.add("active");

  if (view === "qa") renderQA();
  if (view === "news") renderNews();
  if (view === "challenge") renderChallenge();
  if (view === "tickets") renderTickets();
}

// ============================================
// VIEWS (Rohfassung – nur Daten laden / anzeigen)
// ============================================

// ------------------
// F&A
// ------------------
async function renderQA() {
  viewContainer.innerHTML = `<p class="placeholder">Lade F&A…</p>`;

  try {
    const res = await fetch("/api/admin/qa", {
      headers: getAuthHeaders()
    });
    const items = await res.json();

    viewContainer.innerHTML = `
      <h1>Fragen & Antworten</h1>
      <p>Total: ${items.length}</p>
      <pre>${escapeHtml(JSON.stringify(items, null, 2))}</pre>
    `;
  } catch (err) {
    viewContainer.innerHTML = `<p class="error-msg">Fehler beim Laden.</p>`;
  }
}

// ------------------
// NEWS
// ------------------
async function renderNews() {
  viewContainer.innerHTML = `<p class="placeholder">Lade News…</p>`;

  try {
    const res = await fetch("/api/admin/news", {
      headers: getAuthHeaders()
    });
    const items = await res.json();

    viewContainer.innerHTML = `
      <h1>News</h1>
      <p>Total: ${items.length}</p>
      <pre>${escapeHtml(JSON.stringify(items, null, 2))}</pre>
    `;
  } catch (err) {
    viewContainer.innerHTML = `<p class="error-msg">Fehler beim Laden.</p>`;
  }
}

// ------------------
// CHALLENGE
// ------------------
async function renderChallenge() {
  viewContainer.innerHTML = `<p class="placeholder">Lade Challenge…</p>`;

  try {
    const res = await fetch("/api/admin/challenge", {
      headers: getAuthHeaders()
    });
    const data = await res.json();

    viewContainer.innerHTML = `
      <h1>Challenge</h1>
      <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    `;
  } catch (err) {
    viewContainer.innerHTML = `<p class="error-msg">Fehler beim Laden.</p>`;
  }
}

// ------------------
// TICKETS
// ------------------
async function renderTickets() {
  viewContainer.innerHTML = `<p class="placeholder">Lade Tickets…</p>`;

  try {
    const res = await fetch("/api/admin/tickets", {
      headers: getAuthHeaders()
    });
    const items = await res.json();

    viewContainer.innerHTML = `
      <h1>Support-Tickets</h1>
      <p>Total: ${items.length}</p>
      <pre>${escapeHtml(JSON.stringify(items, null, 2))}</pre>
    `;
  } catch (err) {
    viewContainer.innerHTML = `<p class="error-msg">Fehler beim Laden.</p>`;
  }
}

// ============================================
// HELFER: HTML escapen für <pre>
// ============================================
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
