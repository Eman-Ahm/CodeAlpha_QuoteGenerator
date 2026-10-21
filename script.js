// Gradient themes: [color 1, color 2]. All are dark enough for white text.
const themes = [
  ["#1e3a8a", "#7c3aed"],
  ["#0f766e", "#2563eb"],
  ["#be185d", "#6d28d9"],
  ["#c2410c", "#be123c"],
  ["#047857", "#0e7490"],
  ["#4338ca", "#0284c7"]
];

const textEl = document.getElementById("quote-text");
const authorEl = document.getElementById("quote-author");
const newBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-quote");
const shareBtn = document.getElementById("share-quote");
const favBtn = document.getElementById("fav-quote");
const openFavsBtn = document.getElementById("open-favs");
const closeFavsBtn = document.getElementById("close-favs");
const favCountEl = document.getElementById("fav-count");
const panel = document.getElementById("fav-panel");
const favList = document.getElementById("fav-list");
const toastEl = document.getElementById("toast");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const chips = document.querySelectorAll(".chip");

let currentIndex = -1;
let currentTheme = -1;
let activeCategory = "All";
let toastTimer;

// ---------- Small helpers ----------
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

// Pick a random index that is different from the previous one
function randomIndex(length, previous) {
  let i;
  do {
    i = Math.floor(Math.random() * length);
  } while (i === previous && length > 1);
  return i;
}

// Indexes of the quotes that match the selected category
function filteredIds() {
  return quotes
    .map((q, i) => i)
    .filter((i) => activeCategory === "All" || quotes[i].category === activeCategory);
}

// ---------- Favorites (saved in the browser's localStorage) ----------
const FAV_KEY = "quoteFavorites";

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (err) {
    return [];
  }
}
function saveFavorites() {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  } catch (err) {
    /* storage unavailable: favorites just won't persist */
  }
}
let favorites = loadFavorites();

function isFavorite(q) {
  return favorites.some((f) => f.text === q.text);
}

function updateFavoriteUI() {
  if (currentIndex >= 0) {
    const fav = isFavorite(quotes[currentIndex]);
    favBtn.setAttribute("aria-pressed", String(fav));
    favBtn.setAttribute("aria-label", fav ? "Remove from favorites" : "Add to favorites");
    favBtn.dataset.tip = fav ? "Unfavorite" : "Favorite";
  }
  favCountEl.textContent = favorites.length;
  favCountEl.hidden = favorites.length === 0;
}

function toggleFavorite() {
  const q = quotes[currentIndex];
  if (isFavorite(q)) {
    favorites = favorites.filter((f) => f.text !== q.text);
    showToast("Removed from favorites");
  } else {
    favorites.push(q);
    showToast("Added to favorites");
  }
  saveFavorites();
  updateFavoriteUI();
  renderFavorites();
}

function renderFavorites() {
  favList.textContent = "";
  if (favorites.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No saved quotes yet. Select the heart on a quote you like.";
    favList.appendChild(empty);
    return;
  }
  favorites.forEach((q) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = q.text;
    const a = document.createElement("span");
    a.textContent = "— " + q.author;
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "remove";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      favorites = favorites.filter((f) => f.text !== q.text);
      saveFavorites();
      updateFavoriteUI();
      renderFavorites();
    });
    li.append(p, a, rm);
    favList.appendChild(li);
  });
}

// ---------- Showing quotes ----------
function showQuote() {
  textEl.classList.add("fade");
  authorEl.classList.add("fade");

  setTimeout(() => {
    const ids = filteredIds();
    currentIndex = ids[randomIndex(ids.length, ids.indexOf(currentIndex))];
    currentTheme = randomIndex(themes.length, currentTheme);

    textEl.textContent = quotes[currentIndex].text;
    authorEl.textContent = quotes[currentIndex].author;

    const [c1, c2] = themes[currentTheme];
    document.documentElement.style.setProperty("--c1", c1);
    document.documentElement.style.setProperty("--c2", c2);
    themeMeta.setAttribute("content", c1);

    updateFavoriteUI();
    textEl.classList.remove("fade");
    authorEl.classList.remove("fade");
  }, 300);
}

// ---------- Copy and share ----------
function formatQuote() {
  const q = quotes[currentIndex];
  return "“" + q.text + "” — " + q.author;
}

// Older copy method: works even when the page is opened as a local file
function fallbackCopy(text) {
  const previous = document.activeElement;
  const box = document.createElement("textarea");
  box.value = text;
  box.setAttribute("readonly", "");
  box.style.position = "fixed";
  box.style.top = "-1000px";
  document.body.appendChild(box);
  box.select();
  box.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (err) {
    ok = false;
  }
  document.body.removeChild(box);
  if (previous && previous.focus) previous.focus();
  return ok;
}

async function copyQuote() {
  const text = formatQuote();
  let ok = false;

  // 1) Modern way (needs a secure page, such as https or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (err) {
      ok = false;
    }
  }
  // 2) Backup way
  if (!ok) ok = fallbackCopy(text);

  showToast(ok ? "Copied to clipboard" : "Copy failed. Please select the text manually.");
}

async function shareQuote() {
  const text = formatQuote();
  if (navigator.share) {
    try {
      await navigator.share({ title: "Quote", text: text });
    } catch (err) {
      /* user closed the share sheet */
    }
  } else {
    window.open(
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
  }
}

// ---------- Events ----------
newBtn.addEventListener("click", showQuote);
copyBtn.addEventListener("click", copyQuote);
shareBtn.addEventListener("click", shareQuote);
favBtn.addEventListener("click", toggleFavorite);
openFavsBtn.addEventListener("click", () => {
  renderFavorites();
  panel.hidden = false;
});
closeFavsBtn.addEventListener("click", () => (panel.hidden = true));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") panel.hidden = true;
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeCategory = chip.dataset.cat;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    showQuote();
  });
});

showQuote();