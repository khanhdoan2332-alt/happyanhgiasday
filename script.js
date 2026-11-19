/**
 * ============================================================================
 * ARCHIVE CONFIGURATION (Minimal, non-repetitive, caption-free Polaroids)
 * ============================================================================
 */
const ARCHIVE_CONFIG = {
  audioSrc: "assets/voice-record.m4a",
  fallbackDuration: 193, // 03:13

  // Subtle handwritten lines around the cassette (same quiet mood as Ref 1)
  lyrics: [
    {
      time: 0,
      top: "getting out of the gray city",
      highlight1: "light",
      bottom: "to that place in",
      highlight2: "our memories"
    },
    {
      time: 35,
      top: "walking through the quiet streets",
      highlight1: "night",
      bottom: "keeping this small",
      highlight2: "frequency"
    },
    {
      time: 75,
      top: "underneath the same blue sky",
      highlight1: "breeze",
      bottom: "holding on to",
      highlight2: "simple days"
    },
    {
      time: 120,
      top: "every frame inside the roll",
      highlight1: "stays",
      bottom: "right here where",
      highlight2: "we are"
    },
    {
      time: 160,
      top: "let the tape keep spinning slow",
      highlight1: "warmth",
      bottom: "back to that place in",
      highlight2: "our memories"
    }
  ],

  // All 11 visual assets (10 photos + 1 motion video) — clean Polaroids without text captions
  polaroidFrames: [
    {
      code: "01A",
      type: "image",
      src: "assets/1795028653876_2138247692867253050_9137791854930146137_a9e43b37c8088cf2ef7cc21ccde15a89.jpg"
    },
    {
      code: "02A",
      type: "image",
      src: "assets/1795028654172_2138247692867253050_9137791854930146137_76009fd1edf5197b21d3ebce669b47ad.jpg"
    },
    {
      code: "03A",
      type: "image",
      src: "assets/1795028656036_2138247692867253050_9137791854930146137_a01b19e1be15d19f46ff5207545cceca.jpg"
    },
    {
      code: "04A",
      type: "image",
      src: "assets/1795028656449_2138247692867253050_9137791854930146137_c4075ea4d3c9b4bf234e7e1df7fafc2c.jpg"
    },
    {
      code: "05A",
      type: "video",
      src: "assets/1795028657021_2138247692867253050_9137791854930146137.mp4"
    },
    {
      code: "06A",
      type: "image",
      src: "assets/1795028654876_2138247692867253050_9137791854930146137_de399891734ed09ed972512da52f3387.jpg"
    },
    {
      code: "07A",
      type: "image",
      src: "assets/1795028660740_2138247692867253050_9137791854930146137_f37c5c022573a26bed2ceb2704cc60ba.jpg"
    },
    {
      code: "08A",
      type: "image",
      src: "assets/1795028659606_2138247692867253050_9137791854930146137_b6d86a457322c33187686f916df33352.jpg"
    },
    {
      code: "09A",
      type: "image",
      src: "assets/1795028661646_2138247692867253050_9137791854930146137_aa9dfa1c1c1b4fbf7b940f44ab30ab61.jpg"
    },
    {
      code: "10A",
      type: "image",
      src: "assets/1795028662618_2138247692867253050_9137791854930146137_68dfb5055bc8d3be439a0dcc8c533ef9.jpg"
    }
  ]
};

/**
 * ============================================================================
 * DOM REFERENCES
 * ============================================================================
 */
const cassetteUnit = document.getElementById("cassette-unit");
const audio = document.getElementById("voice-audio");
const spoolLeft = document.getElementById("spool-left");
const spoolRight = document.getElementById("spool-right");
const tapPromptTextEl = document.getElementById("tap-prompt-text");

const lyricTopEl = document.getElementById("lyric-top");
const lyricHighlight1El = document.getElementById("lyric-highlight-1");
const lyricMainEl = document.getElementById("lyric-main");
const lyricHighlight2El = document.getElementById("lyric-highlight-2");

const canisterToggle = document.getElementById("canister-toggle");
const filmStrip = document.getElementById("film-strip");
const polaroidTrack = document.getElementById("polaroid-scroll-track");

const modal = document.getElementById("polaroid-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalPhotoBox = document.getElementById("modal-photo-box");
const modalCloseBtn = document.getElementById("modal-close-btn");

/**
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 */
let isPlaying = false;
let activeLyricIndex = -1;

/**
 * ============================================================================
 * 1. RENDER ALL 11 CLEAN POLAROID FRAMES INTO THE 35MM FILM STRIP
 * ============================================================================
 */
function renderFilmRoll() {
  polaroidTrack.innerHTML = "";

  ARCHIVE_CONFIG.polaroidFrames.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "polaroid-frame";
    article.dataset.index = String(index);

    const mediaMarkup =
      item.type === "video"
        ? `<video src="${item.src}" muted loop playsinline autoplay preload="metadata"></video>`
        : `<img src="${item.src}" alt="Frame ${item.code}" loading="lazy" />`;

    article.innerHTML = `
      <div class="frame-meta">
        <span class="frame-index">${item.code}</span>
      </div>
      <div class="polaroid-card">
        <div class="polaroid-photo">
          ${mediaMarkup}
        </div>
      </div>
    `;

    article.addEventListener("click", () => {
      openPolaroidModal(item);
    });

    polaroidTrack.appendChild(article);
  });
}

/**
 * ============================================================================
 * 2. CASSETTE TAPE PLAYBACK & INTERACTION
 * ============================================================================
 */
function getTotalDuration() {
  if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
    return audio.duration;
  }
  return ARCHIVE_CONFIG.fallbackDuration;
}

function toggleCassettePlayback() {
  if (isPlaying) {
    pauseCassette();
  } else {
    playCassette();
  }
}

function playCassette() {
  audio
    .play()
    .then(() => {
      isPlaying = true;
      cassetteUnit.classList.add("is-playing");
      updateTapPrompt(audio.currentTime || 0, getTotalDuration());
    })
    .catch((err) => {
      console.error("Audio playback error:", err);
      tapPromptTextEl.textContent = "chạm vào băng để nghe";
    });
}

function pauseCassette() {
  audio.pause();
  isPlaying = false;
  cassetteUnit.classList.remove("is-playing");
  tapPromptTextEl.textContent = "tạm dừng — chạm vào băng để tiếp tục";
}

cassetteUnit.addEventListener("click", toggleCassettePlayback);
cassetteUnit.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleCassettePlayback();
  }
});

audio.addEventListener("timeupdate", () => {
  updateTapeUI(audio.currentTime, getTotalDuration());
});

audio.addEventListener("ended", () => {
  isPlaying = false;
  cassetteUnit.classList.remove("is-playing");
  tapPromptTextEl.textContent = "chạm vào băng để phát lại";
});

/**
 * ============================================================================
 * 3. TAPE SPOOL PHYSICS & LYRIC GLOW
 * ============================================================================
 */
function updateTapPrompt(current, total) {
  if (isPlaying) {
    tapPromptTextEl.textContent = `${formatClock(current)} / ${formatClock(total)}`;
  }
}

function updateTapeUI(current, total) {
  const ratio = total > 0 ? current / total : 0;
  updateTapPrompt(current, total);

  const leftSize = 26 - ratio * 14;
  const rightSize = 12 + ratio * 14;
  spoolLeft.style.width = `${leftSize}px`;
  spoolLeft.style.height = `${leftSize}px`;
  spoolRight.style.width = `${rightSize}px`;
  spoolRight.style.height = `${rightSize}px`;
}

function formatClock(seconds) {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * ============================================================================
 * 4. 35MM FILM CANISTER UNROLL & POLAROID DRAG-SCROLL + LIGHTBOX
 * ============================================================================
 */
canisterToggle.addEventListener("click", () => {
  const isUnrolled = filmStrip.classList.toggle("unrolled");
  canisterToggle.setAttribute("aria-expanded", String(isUnrolled));
});

let isDraggingFilm = false;
let dragMoved = false;
let startY = 0;
let startScrollTop = 0;

polaroidTrack.addEventListener("mousedown", (e) => {
  isDraggingFilm = true;
  dragMoved = false;
  startY = e.pageY - polaroidTrack.offsetTop;
  startScrollTop = polaroidTrack.scrollTop;
});

window.addEventListener("mouseup", () => {
  isDraggingFilm = false;
});

polaroidTrack.addEventListener("mousemove", (e) => {
  if (!isDraggingFilm) return;
  const y = e.pageY - polaroidTrack.offsetTop;
  const delta = y - startY;
  if (Math.abs(delta) > 5) {
    dragMoved = true;
  }
  e.preventDefault();
  polaroidTrack.scrollTop = startScrollTop - delta * 1.35;
});

function openPolaroidModal(item) {
  if (dragMoved) return;

  if (item.type === "video") {
    modalPhotoBox.innerHTML = `<video src="${item.src}" controls autoplay loop playsinline></video>`;
  } else {
    modalPhotoBox.innerHTML = `<img src="${item.src}" alt="Frame ${item.code}" />`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closePolaroidModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalPhotoBox.innerHTML = "";
}

modalCloseBtn.addEventListener("click", closePolaroidModal);
modalBackdrop.addEventListener("click", closePolaroidModal);

/**
 * ============================================================================
 * 0. GENERATE TWINKLING STARFIELD PATTERN ON BACKGROUND
 * ============================================================================
 */
function initStarfield() {
  const starfield = document.getElementById("starfield-bg");
  if (!starfield) return;

  const totalStars = 52;
  const colors = ["#fff282", "#f2f5fa", "#7abce6", "#fff282"];

  for (let i = 0; i < totalStars; i++) {
    const isSparkle = i % 3 === 0;
    const color = colors[i % colors.length];
    const left = (Math.sin(i * 78.233) * 0.5 + 0.5) * 96 + 2;
    const top = (Math.cos(i * 45.164) * 0.5 + 0.5) * 96 + 2;
    const duration = (2.2 + (i % 7) * 0.45).toFixed(2);
    const delay = ((i % 11) * 0.35).toFixed(2);

    if (isSparkle) {
      const size = 9 + (i % 4) * 4;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("class", "bg-star bg-star-sparkle");
      svg.style.width = `${size}px`;
      svg.style.height = `${size}px`;
      svg.style.left = `${left}%`;
      svg.style.top = `${top}%`;
      svg.style.setProperty("--star-color", color);
      svg.style.setProperty("--twinkle-duration", `${duration}s`);
      svg.style.setProperty("--twinkle-delay", `-${delay}s`);

      // 4-point and 8-point celestial star shapes
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      if (i % 6 === 0) {
        path.setAttribute(
          "d",
          "M12 0 L13.6 9.2 L21 3 L14.8 10.4 L24 12 L14.8 13.6 L21 21 L13.6 14.8 L12 24 L10.4 14.8 L3 21 L9.2 13.6 L0 12 L9.2 10.4 L3 3 L10.4 9.2 Z"
        );
      } else {
        path.setAttribute(
          "d",
          "M12 1 C12.5 8.5, 15.5 11.5, 23 12 C15.5 12.5, 12.5 15.5, 12 23 C11.5 15.5, 8.5 12.5, 1 12 C8.5 11.5, 11.5 8.5, 12 1 Z"
        );
      }
      svg.appendChild(path);
      starfield.appendChild(svg);
    } else {
      const size = 2.5 + (i % 3) * 1.5;
      const dot = document.createElement("span");
      dot.className = "bg-star bg-star-dot";
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      dot.style.setProperty("--star-color", color);
      dot.style.setProperty("--twinkle-duration", `${duration}s`);
      dot.style.setProperty("--twinkle-delay", `-${delay}s`);
      starfield.appendChild(dot);
    }
  }
}

/**
 * ============================================================================
 * 0A. PRELOADER & INTRO GATE FLOW
 * ============================================================================
 */
function initPreloaderAndIntro() {
  const preloaderScreen = document.getElementById("preloader-screen");
  const preloaderCounter = document.getElementById("preloader-counter");
  const preloaderBarFill = document.getElementById("preloader-bar-fill");
  const introGate = document.getElementById("intro-gate");
  const introEnterBtn = document.getElementById("intro-enter-btn");
  const mainArchive = document.getElementById("main-archive");

  if (!preloaderScreen || !introGate || !mainArchive) return;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);

      setTimeout(() => {
        preloaderScreen.classList.add("is-hidden");
        introGate.classList.add("is-visible");
      }, 320);
    }

    const formatted = progress < 10 ? `0${progress}%` : `${progress}%`;
    preloaderCounter.textContent = formatted;
    preloaderBarFill.style.width = `${progress}%`;
  }, 95);

  introEnterBtn.addEventListener("click", () => {
    introGate.classList.remove("is-visible");
    introGate.classList.add("is-leaving");

    mainArchive.style.display = "flex";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainArchive.classList.remove("main-hidden");
      });
    });
  });
}

// Initialize on load
initStarfield();
initPreloaderAndIntro();
renderFilmRoll();
updateTapeUI(0, ARCHIVE_CONFIG.fallbackDuration);
