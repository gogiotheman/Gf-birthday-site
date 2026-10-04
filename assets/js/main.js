/* =======================================================================
   SHARED BEHAVIOUR — loaded on every page
   ======================================================================= */

const NAV_ITEMS = [
  {
    page: "home", href: "index.html", label: "home",
    icon: '<path d="M3 10l7-6 7 6M5 9v8h10V9" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    page: "main", href: "main.html", label: "together",
    icon: '<circle cx="10" cy="10" r="6.5"/><path d="M10 6.5v4l3 2" stroke-linecap="round"/>',
  },
  {
    page: "timeline", href: "timeline.html", label: "timeline",
    icon: '<path d="M3 10h14M7 5l-4 5 4 5M13 5l4 5-4 5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    page: "poetry", href: "poetry.html", label: "verse",
    icon: '<path d="M5 17V5l10 0M5 9h7M5 13h5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    page: "activities", href: "activities.html", label: "tonight",
    icon: '<path d="M14 3a7 7 0 1 0 3 13.2A7.5 7.5 0 0 1 14 3z"/>',
  },
];

function injectNav(activePage) {
  const mount = document.getElementById("nav-placeholder");
  if (!mount) return;
  const links = NAV_ITEMS.map((item) => {
    const active = item.page === activePage ? " is-active" : "";
    return `<a class="${active.trim()}" href="${item.href}">
      <svg viewBox="0 0 20 20">${item.icon}</svg>
      <span>${item.label}</span>
    </a>`;
  }).join("");
  mount.outerHTML = `<nav class="site-nav">${links}</nav>`;
}

function ensureSiteAccess() {
  const password = SITE_CONFIG?.sitePassword;
  if (!password || !password.trim()) return;

  const storageKey = "gift-site-access";
  const saved = sessionStorage.getItem(storageKey);
  if (saved === password) return;

  const entered = window.prompt("Enter the password to continue:");
  if (entered === password) {
    sessionStorage.setItem(storageKey, password);
    return;
  }

  document.body.innerHTML = `
    <main class="page access-denied">
      <div class="access-card">
        <h1>Access denied</h1>
        <p>This page is for the birthday guest only.</p>
      </div>
    </main>
  `;
  throw new Error("Access denied");
}

function buildStarfield(containerId, count = 60) {
  const el = document.getElementById(containerId);
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 1.6 + 0.6;
    star.className = "star";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    el.appendChild(star);
  }

  // a few faint constellation threads, drawn once, purely decorative
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  const points = Array.from({ length: 5 }, () => [
    Math.random() * 90 + 5,
    Math.random() * 60 + 5,
  ]);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const line = document.createElementNS(svgNS, "path");
  line.setAttribute("d", path);
  line.setAttribute("class", "thread");
  svg.appendChild(line);
  el.appendChild(svg);
}

/* ---- greeting page only ---- */
function initGreetingPage() {
  const stage = document.getElementById("sealStage");
  const openBtn = document.getElementById("openBtn");
  const panel = document.getElementById("messagePanel");
  if (!stage || !openBtn || !panel) return;

  document.getElementById("herNameDisplay").textContent = SITE_CONFIG.herName;
  document.getElementById("eyebrowDisplay").textContent = SITE_CONFIG.greeting.eyebrow;
  document.getElementById("taglineDisplay").textContent = SITE_CONFIG.greeting.tagline;
  document.getElementById("openLabelDisplay").textContent = SITE_CONFIG.greeting.openLabel;
  document.getElementById("greetingMessage").textContent = SITE_CONFIG.greeting.message;
  document.getElementById("enterLabelDisplay").textContent = SITE_CONFIG.greeting.enterLabel;
  document.getElementById("yourNameDisplay").textContent = SITE_CONFIG.yourName;
  document.title = `for ${SITE_CONFIG.herName}`;

  openBtn.addEventListener("click", () => {
    stage.classList.add("is-open");
    panel.classList.add("is-visible");
    openBtn.setAttribute("aria-expanded", "true");
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---- timeline storage (saved in this browser only) ---- */
function timelineKey(year, month) {
  return `tl:${year}:${month}`;
}

function getTimelineEntry(year, month) {
  try {
    const raw = localStorage.getItem(timelineKey(year, month));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setTimelineEntry(year, month, entry) {
  try {
    localStorage.setItem(timelineKey(year, month), JSON.stringify(entry));
    return true;
  } catch (e) {
    return false; // most likely storage quota exceeded
  }
}

function removeTimelineEntry(year, month) {
  try {
    localStorage.removeItem(timelineKey(year, month));
  } catch (e) {
    /* ignore */
  }
}

/* shrinks a picked photo to a reasonable size before it's stored */
function resizeImageFile(file, maxDim = 640, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width >= height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > width && height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---- timeline page only ---- */
function initTimelinePage() {
  const grid = document.getElementById("monthGrid");
  if (!grid) return;

  const yearDisplay = document.getElementById("yearDisplay");
  const prevYearBtn = document.getElementById("prevYearBtn");
  const nextYearBtn = document.getElementById("nextYearBtn");
  const photoInput = document.getElementById("photoInput");
  const overlay = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalNote = document.getElementById("modalNote");
  const modalMonthLabel = document.getElementById("modalMonthLabel");
  const modalClose = document.getElementById("modalClose");
  const modalReplace = document.getElementById("modalReplace");
  const modalRemove = document.getElementById("modalRemove");

  document.getElementById("timelineEyebrow").textContent = SITE_CONFIG.timeline.eyebrow;
  document.getElementById("timelineTitle").textContent = SITE_CONFIG.timeline.title;
  document.title = SITE_CONFIG.timeline.title;

  const { startYear, endYear } = SITE_CONFIG.timeline;
  let year = startYear + 1;
  let pendingTarget = null;
  let modalState = null;
  let noteSaveTimer = null;

  function renderYear() {
    yearDisplay.textContent = year;
    prevYearBtn.disabled = year <= startYear;
    nextYearBtn.disabled = year >= endYear;
    grid.innerHTML = "";

    MONTH_NAMES.forEach((name, idx) => {
      const month = idx + 1;
      const entry = getTimelineEntry(year, month);
      const cell = document.createElement("button");
      cell.className = "month-cell" + (entry ? " is-filled" : "");
      cell.setAttribute(
        "aria-label",
        `${name} ${year}${entry ? ", tap to view" : ", tap to add a photo"}`
      );
      if (entry && entry.photo) cell.style.backgroundImage = `url('${entry.photo}')`;
      cell.innerHTML =
        `<span class="month-label">${name}</span>` +
        (entry ? "" : `<span class="month-plus">+</span>`);
      cell.addEventListener("click", () => {
        if (entry) openModal(year, month, entry);
        else pickAndSavePhoto(year, month);
      });
      grid.appendChild(cell);
    });
  }

  function openModal(y, m, entry) {
    modalState = { year: y, month: m };
    modalMonthLabel.textContent = `${MONTH_NAMES[m - 1]} ${y}`;
    modalImage.src = entry.photo;
    modalImage.alt = `Photo from ${MONTH_NAMES[m - 1]} ${y}`;
    modalNote.value = entry.note || "";
    overlay.classList.add("is-visible");
    document.body.classList.add("modal-open");
    setTimeout(() => modalNote.focus(), 80);
  }

  function saveCurrentNote() {
    if (!modalState) return;
    const entry = getTimelineEntry(modalState.year, modalState.month);
    if (entry) {
      entry.note = modalNote.value.trim();
      setTimelineEntry(modalState.year, modalState.month, entry);
    }
  }

  function closeModal() {
    saveCurrentNote();
    overlay.classList.remove("is-visible");
    document.body.classList.remove("modal-open");
    modalState = null;
    renderYear();
  }

  function pickAndSavePhoto(y, m) {
    pendingTarget = { year: y, month: m };
    photoInput.value = "";
    photoInput.click();
  }

  photoInput.addEventListener("change", async () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file || !pendingTarget) return;
    const { year: py, month: pm } = pendingTarget;
    try {
      const dataUrl = await resizeImageFile(file);
      const existing = getTimelineEntry(py, pm) || {};
      const entry = { photo: dataUrl, note: existing.note || "" };
      const ok = setTimelineEntry(py, pm, entry);
      if (!ok) {
        alert("Couldn't save that photo — storage in this browser might be full. Try removing an older photo first.");
        return;
      }
      renderYear();
      openModal(py, pm, entry);
    } catch (err) {
      alert("That photo couldn't be read — try a different file.");
    }
  });

  modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) closeModal();
  });
  modalNote.addEventListener("input", () => {
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(saveCurrentNote, 600);
  });
  modalReplace.addEventListener("click", () => {
    if (modalState) pickAndSavePhoto(modalState.year, modalState.month);
  });
  modalRemove.addEventListener("click", () => {
    if (!modalState) return;
    removeTimelineEntry(modalState.year, modalState.month);
    overlay.classList.remove("is-visible");
    document.body.classList.remove("modal-open");
    modalState = null;
    renderYear();
  });

  prevYearBtn.addEventListener("click", () => {
    if (year > startYear) { year--; renderYear(); }
  });
  nextYearBtn.addEventListener("click", () => {
    if (year < endYear) { year++; renderYear(); }
  });

  renderYear();
}

/* ---- activities page only ---- */
function initActivitiesPage() {
  const chipList = document.getElementById("chipList");
  if (!chipList) return;

  const cfg = SITE_CONFIG.activities;
  document.getElementById("actEyebrow").textContent = cfg.eyebrow;
  document.getElementById("actTitle").textContent = cfg.title;
  document.getElementById("actHint").textContent = cfg.hint;
  document.title = cfg.title;

  const preview = document.getElementById("messagePreview");
  const sendWhatsapp = document.getElementById("sendWhatsapp");
  const sendSms = document.getElementById("sendSms");
  const sendRow = document.getElementById("sendRow");
  const noPhoneHint = document.getElementById("noPhoneHint");
  const customOption = document.getElementById("customOption");
  const customInput = document.getElementById("customIdeaInput");
  const selected = new Set();
  const customLabel = cfg.customOptionLabel || "something else";
  const customPlaceholder = cfg.customOptionPlaceholder || "tell me what you had in mind...";
  let customActive = false;

  if (customInput) customInput.placeholder = customPlaceholder;

  const hasPhone = !!(cfg.phoneNumber && cfg.phoneNumber.trim());
  if (!hasPhone) {
    sendRow.classList.add("hidden");
    noPhoneHint.classList.remove("hidden");
  }

  function getSelectedItems() {
    const items = Array.from(selected);
    if (customActive) {
      const value = customInput.value.trim() || customLabel;
      if (value) items.push(value);
    }
    return items;
  }

  function buildMessage() {
    return `${cfg.messageIntro} ${getSelectedItems().join(", ")}`;
  }

  function updatePreview() {
    const items = getSelectedItems();
    if (items.length === 0) {
      preview.textContent = "";
      preview.classList.remove("is-visible");
      sendWhatsapp.classList.add("is-disabled");
      sendSms.disabled = true;
      return;
    }
    preview.textContent = `“${buildMessage()}”`;
    preview.classList.add("is-visible");
    if (hasPhone) {
      const digits = cfg.phoneNumber.replace(/[^\d]/g, "");
      const msg = encodeURIComponent(buildMessage());
      sendWhatsapp.href = `https://wa.me/${digits}?text=${msg}`;
      sendWhatsapp.classList.remove("is-disabled");
      sendSms.disabled = false;
    }
  }

  cfg.items.forEach((label) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = label;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      if (selected.has(label)) {
        selected.delete(label);
        chip.classList.remove("is-selected");
        chip.setAttribute("aria-pressed", "false");
      } else {
        selected.add(label);
        chip.classList.add("is-selected");
        chip.setAttribute("aria-pressed", "true");
      }
      updatePreview();
    });
    chipList.appendChild(chip);
  });

  const customChip = document.createElement("button");
  customChip.type = "button";
  customChip.className = "chip";
  customChip.textContent = customLabel;
  customChip.setAttribute("aria-pressed", "false");
  customChip.addEventListener("click", () => {
    customActive = !customActive;
    customChip.classList.toggle("is-selected", customActive);
    customChip.setAttribute("aria-pressed", String(customActive));
    customOption.classList.toggle("hidden", !customActive);
    if (customActive) {
      customInput.focus();
      customInput.value = customInput.value || "";
    }
    updatePreview();
  });
  chipList.appendChild(customChip);

  if (customInput) {
    customInput.addEventListener("input", () => {
      updatePreview();
    });
  }

  sendWhatsapp.addEventListener("click", (e) => {
    if (sendWhatsapp.classList.contains("is-disabled")) e.preventDefault();
  });

  if (hasPhone) {
    sendSms.addEventListener("click", () => {
      const digits = cfg.phoneNumber.replace(/[^\d+]/g, "");
      const msg = encodeURIComponent(buildMessage());
      window.location.href = `sms:${digits}?&body=${msg}`;
    });
  }

  updatePreview();
}

/* ---- parses a pasted YouTube or Google Drive link ---- */
function parseVideoUrl(url) {
  if (!url) return null;
  url = url.trim();

  let m =
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/) ||
    url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/) ||
    url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/) ||
    url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (m) return { provider: "youtube", id: m[1] };

  m =
    url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (m) return { provider: "drive", id: m[1] };

  return null;
}

/* ---- together page only ---- */
function initMainPage() {
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  if (!track || !dotsWrap) return;

  document.getElementById("mainEyebrow").textContent = SITE_CONFIG.main.eyebrow;
  document.getElementById("mainTitle").textContent = SITE_CONFIG.main.title;
  document.title = SITE_CONFIG.main.title;

  const videos = SITE_CONFIG.videos || [];

  videos.forEach((video, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    if (video.id) {
      const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
      slide.innerHTML = `
        <div class="video-frame">
          <button class="video-facade" style="background-image:url('${thumb}')" aria-label="Play video">
            <span class="video-play">
              <svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"></path></svg>
            </span>
          </button>
        </div>
        <p class="video-caption">${video.title || ""}</p>`;

      slide.querySelector(".video-facade").addEventListener("click", (e) => {
        const frame = e.currentTarget.closest(".video-frame");
        frame.innerHTML = `<iframe
          src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0"
          title="${video.title || "video"}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
      });
    } else {
      slide.innerHTML = `
        <div class="video-frame">
          <div class="video-empty">
            <svg viewBox="0 0 24 24"><path d="M4 3l10 6-10 6z"></path></svg>
            <span>add a video in config.js</span>
          </div>
        </div>
        <p class="video-caption">${video.title || ""}</p>`;
    }

    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to video ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goToSlide(i) {
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  document.getElementById("prevBtn").addEventListener("click", () => {
    const i = Math.max(0, Math.round(track.scrollLeft / track.clientWidth) - 1);
    goToSlide(i);
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    const i = Math.min(videos.length - 1, Math.round(track.scrollLeft / track.clientWidth) + 1);
    goToSlide(i);
  });

  let scrollTimer;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    }, 80);
  });
}
