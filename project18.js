


const DEBUG = false;
// Performance optimizations
const useReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Adjust animation settings based on device and preferences
const ANIMATION_CONFIG = {
  enabled: !useReducedMotion && !isMobile,
  particleCount: useReducedMotion ? 10 : (isMobile ? 20 : 30),
  animationInterval: useReducedMotion ? 30000 : 15000,
  mouseThrottle: isMobile ? 32 : 16
};

// Conditional animation initialization
if (ANIMATION_CONFIG.enabled) {
  // Only run animations on capable devices
}

 
const CONFIG = {
  heroPetals: { count: 50 },
  heroGlows: { count: 70 },
  canvasParticles: { count: 120 },
  slider: {
    autoSlideInterval: 3200,
    transitionMs: 700,
    pauseOnHover: true,
    keyboardControl: true,
    touchSwipe: true,
  },
  perf: {
    throttleMs: 16, 
  },
};

function log(...args) {
  if (DEBUG) console.log(...args);
}


function $id(id) {
  return document.getElementById(id);
}
function $qs(sel) {
  return document.querySelector(sel);
}
function $qsa(sel) {
  return Array.from(document.querySelectorAll(sel));
}


(function ensureDOMReady(handler) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    window.setTimeout(handler, 0);
  } else {
    document.addEventListener("DOMContentLoaded", handler);
  }
})(initAll);


function initAll() {
  log("project18.js init");

  
  const navbar = $qs(".navbar");
  const searchInput = $id("searchInput");

  initNavbar(navbar, searchInput);
  initParallaxLayers();
  initCanvasParticles();
  initHeroEffects();
  initSplitTextAnimations();
  initHistorySectionEffects();
  initEventSlider();
  observeVisibility(); 
}


function initNavbar(navbar, searchInput) {
  if (!navbar) {
    log("navbar not found — skipping navbar init");
    return;
  }

  
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        alert("You searched: " + (searchInput.value || ""));
      }
    });
  }

  
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current > 20) {
      navbar.style.padding = "10px 40px";
      navbar.style.background = "rgba(59, 42, 26, 0.92)";
      navbar.style.backdropFilter = "blur(6px)";
      navbar.style.boxShadow = "0 6px 18px rgba(0,0,0,0.45)";
    } else {
      navbar.style.padding = "18px 50px";
      navbar.style.background = "#3b2a1a";
      navbar.style.boxShadow = "0 4px 18px rgba(0,0,0,0.4)";
    }

    if (current > lastScroll && current > 100) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScroll = current;
  });
}


function initParallaxLayers() {
  const layers = $qsa(".layer");
  if (!layers.length) {
    log("no .layer elements found — skipping parallax");
    return;
  }

  
  let last = 0;
  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - last < CONFIG.perf.throttleMs) return;
    last = now;

    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    layers.forEach((layer, idx) => {
      const depth = (idx + 1) * 12;
      const rotate = (x + y) / 45;
      layer.style.willChange = "transform"; style.transform = `translateX(${x / depth}px) translateY(${
        y / depth
      }px) rotate(${rotate}deg) scale(1.02)`;
      if (DEBUG) layer.style.outline = "1px dashed rgba(255,0,0,.08)";
    });
  });

  
  window.addEventListener("mouseleave", () => {
    layers.forEach((l) => (l.style.transform = ""));
  });
}


function initCanvasParticles() {
  const canvas = $id("chocoParticles");
  if (!canvas) {
    log("canvas #chocoParticles not found — skipping canvas particles");
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  
  const PCOUNT = CONFIG.canvasParticles.count;
  const particles = [];

  for (let i = 0; i < PCOUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 0.8,
      dx: (Math.random() - 0.5) * 0.6,
      dy: Math.random() * 0.6 + 0.1,
      life: Math.random() * 100 + 20,
    });
  }

  let rafId = null;
  let running = true;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      ctx.beginPath();
      
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, "rgba(220,140,70,0.95)");
      g.addColorStop(0.6, "rgba(210,120,50,0.55)");
      g.addColorStop(1, "rgba(210,120,50,0)");
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 1.2, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      
      if (p.y > height + 10) p.y = -10;
      if (p.x > width + 10) p.x = -10;
      if (p.x < -10) p.x = width + 10;
    });

    rafId = requestAnimationFrame(draw);
  }

  draw();

  
  function setRunning(val) {
    running = val;
    if (running) {
      if (!rafId) draw();
    } else {
      if (rafId) cancelAnimationFrame(rafId), (rafId = null);
    }
  }

  
  document.addEventListener("visibilitychange", () => {
    setRunning(!document.hidden);
  });

  
  const hero = $qs(".hero-ultra");
  if (hero) {
    hero.addEventListener("mouseenter", () => setRunning(false));
    hero.addEventListener("mouseleave", () => setRunning(true));
  }
}


function initHeroEffects() {
  const hero = $qs(".hero-ultra");
  if (!hero) {
    log("hero-ultra not found — skipping hero effects");
    return;
  }

  
  const petals = [];
  const glows = [];

  
  const petalCount = CONFIG.heroPetals.count;
  for (let i = 0; i < petalCount; i++) {
    const el = document.createElement("div");
    el.className = "choco-petal";
    el.setAttribute("aria-hidden", "true");
    
    el.style.position = "absolute";
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * -100}%`;
    el.style.willChange = "transform"; style.transform = `translate3d(0,0,0)`;
    hero.appendChild(el);

    petals.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      z: Math.random() * 200 - 100,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: 0.4 + Math.random() * 0.9,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    });
  }

  
  const glowCount = CONFIG.heroGlows.count;
  for (let i = 0; i < glowCount; i++) {
    const el = document.createElement("div");
    el.className = "particle-glow";
    el.setAttribute("aria-hidden", "true");
    el.style.position = "absolute";
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    hero.appendChild(el);

    glows.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      z: Math.random() * 80 - 40,
    });
  }

  
  let raf = null;
  function loop() {
    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight + 20) p.y = -40;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.x < -40) p.x = window.innerWidth + 20;

      p.el.style.willChange = "transform"; style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotate(${p.rotation}deg)`;
    });

    glows.forEach((g) => {
      g.x += g.dx;
      g.y += g.dy;
      if (g.x < -10) g.x = window.innerWidth + 10;
      if (g.x > window.innerWidth + 10) g.x = -10;
      if (g.y < -10) g.y = window.innerHeight + 10;
      if (g.y > window.innerHeight + 10) g.y = -10;

      g.el.style.willChange = "transform"; style.transform = `translate3d(${g.x}px, ${g.y}px, ${g.z}px)`;
    });

    raf = requestAnimationFrame(loop);
  }

  loop();

  
  window.addEventListener(
    "resize",
    throttle(() => {
      petals.forEach((p) => {
        p.x = Math.random() * window.innerWidth;
        p.y = Math.random() * -window.innerHeight;
      });
      glows.forEach((g) => {
        g.x = Math.random() * window.innerWidth;
        g.y = Math.random() * window.innerHeight;
      });
    }, 300)
  );
}


function initSplitTextAnimations() {
  
  const toSplit = [".hero-title", ".hero-subtitle", "#emosionalTitle"];
  toSplit.forEach((sel) => {
    const el = $qs(sel);
    if (!el) return;
    if (el.dataset._split === "done") return;
    splitText(el);
    el.dataset._split = "done";
  });

  
  setInterval(() => {
    const chars = $qsa(".hero-title span, .hero-subtitle span");
    chars.forEach((c) => {
      if (Math.random() > 0.93) {
        c.style.opacity = (Math.random() * 0.6 + 0.4).toFixed(2);
        c.style.willChange = "transform"; style.transform = `translate(${(Math.random() - 0.5) * 3}px, ${
          (Math.random() - 0.5) * 3
        }px)`;
      } else {
        c.style.opacity = "1";
        c.style.transform = "";
      }
    });
  }, 150);
}

function splitText(elOrSelector) {
  const el =
    typeof elOrSelector === "string" ? $qs(elOrSelector) : elOrSelector;
  if (!el) return;
  const text = el.textContent.trim();
  if (!text) return;
  el.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (let ch of text.split("")) {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    frag.appendChild(span);
  }
  el.appendChild(frag);
}


function initHistorySectionEffects() {
  const section = $qs(".history-emosional");
  const textEl = $id("emosionalText");
  if (!section || !textEl) {
    log("history-emosional or emosionalText not found");
    return;
  }

  
  const text = textEl.innerText.trim();
  textEl.innerHTML = "";
  let delay = 0;
  for (let ch of text.split("")) {
    const span = document.createElement("span");
    span.className = "wind-char";
    span.style.animationDelay = `${delay}s`;
    span.textContent = ch === " " ? "\u00A0" : ch;
    textEl.appendChild(span);
    delay += 0.03;
  }

  
  setInterval(() => {
    section.classList.add("flash-glitch", "shake-glitch");
    textEl.classList.add("big-glitch", "wave-glitch");
    setTimeout(() => {
      section.classList.remove("flash-glitch", "shake-glitch");
      textEl.classList.remove("big-glitch", "wave-glitch");
    }, 260);
  }, 9000);

  setInterval(() => {
    section.classList.add("signal-lost");
    setTimeout(() => section.classList.remove("signal-lost"), 1200);
  }, 30000);

  
  window.addEventListener(
    "scroll",
    throttle(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        section.style.transform = "scale(1)";
      } else {
        section.style.transform = "scale(1.03)";
      }
    }, 120)
  );
}


function initEventSlider() {
  
  const sliderRoot = $id("eventSlider") || $qs(".event-slider");
  const dotsContainer = $id("sliderDots") || $qs(".slider-dots");
  const captionTitle = $id("captionTitle");
  const captionText = $id("captionText");

  if (!sliderRoot) {
    log("eventSlider not found — skipping slider");
    return;
  }
  if (!dotsContainer) {
    log("sliderDots not found — will create local dots");
  }

  
  const slides = Array.from(sliderRoot.querySelectorAll(".slide"));
  if (!slides.length) {
    log("no .slide inside slider — skipping");
    return;
  }

  
  let captionBox = null;
  if (!captionTitle || !captionText) {
    captionBox = document.createElement("div");
    captionBox.className = "event-caption fallback-caption";
    const h = document.createElement("h2");
    const p = document.createElement("p");
    h.id = "captionTitle_fallback";
    p.id = "captionText_fallback";
    captionBox.appendChild(h);
    captionBox.appendChild(p);
    sliderRoot.insertAdjacentElement("afterend", captionBox);
  }

  const captionTitleEl = captionTitle || $id("captionTitle_fallback");
  const captionTextEl = captionText || $id("captionText_fallback");
  const dotsRoot = dotsContainer || createLocalDotsArea(sliderRoot);

  
  slides.forEach((s, i) => {
    s.setAttribute("role", "group");
    s.setAttribute("aria-roledescription", "slide");
    s.setAttribute("aria-label", `Slide ${i + 1} of ${slides.length}`);
    
    s.tabIndex = -1;
  });

  
  dotsRoot.innerHTML = ""; 
  const dots = slides.map((_, i) => {
    const btn = document.createElement("button");
    btn.className = "dot";
    btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
    btn.dataset.index = i;
    btn.type = "button";
    
    btn.addEventListener("click", () => {
      goTo(i);
      resetAuto();
    });
    dotsRoot.appendChild(btn);
    return btn;
  });

  
  let current = 0;
  let autoTimer = null;
  let isHovering = false;

  
  slides.forEach((s) => s.classList.remove("active"));
  slides[0].classList.add("active");
  dots[0].classList.add("active");
  updateCaption(0);

  
  if (CONFIG.slider.touchSwipe) {
    setupTouchSwipe(sliderRoot, {
      onSwipeLeft: () => {
        next();
        resetAuto();
      },
      onSwipeRight: () => {
        prev();
        resetAuto();
      },
    });
  }

  
  if (CONFIG.slider.keyboardControl) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prev();
        resetAuto();
      }
      if (e.key === "ArrowRight") {
        next();
        resetAuto();
      }
    });
  }

  
  if (CONFIG.slider.pauseOnHover) {
    sliderRoot.addEventListener("mouseenter", () => {
      isHovering = true;
      stopAuto();
    });
    sliderRoot.addEventListener("mouseleave", () => {
      isHovering = false;
      startAuto();
    });

    
    dots.forEach((d) => {
      d.addEventListener("focus", stopAuto);
      d.addEventListener("blur", startAuto);
    });
  }

  
  function show(i) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    const idx = (i + slides.length) % slides.length;
    slides[idx].classList.add("active");
    dots[idx].classList.add("active");
    updateCaption(idx);
    current = idx;
  }

  function updateCaption(idx) {
    const c = idx % captions.length;

    if (captionTitleEl) captionTitleEl.textContent = captions[c].title;
    if (captionTextEl) captionTextEl.textContent = captions[c].text;

    
    animateCaption(captionTitleEl, captionTextEl);
  }

  function goTo(i) {
    show(i);
  }
  function next() {
    show((current + 1) % slides.length);
  }
  function prev() {
    show((current - 1 + slides.length) % slides.length);
  }

  
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!document.hidden && !isHovering) next();
    }, CONFIG.slider.autoSlideInterval);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer), (autoTimer = null);
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  
  startAuto();

  
  if (DEBUG) {
    window._sliderDebug = {
      goTo,
      next,
      prev,
      stopAuto,
      startAuto,
      slides,
      dots,
    };
  }
}


function createLocalDotsArea(root) {
  const cont = document.createElement("div");
  cont.className = "slider-dots slider-dots-local";
  root.insertAdjacentElement("afterend", cont);
  return cont;
}


function setupTouchSwipe(el, opts = {}) {
  let startX = 0,
    startY = 0,
    distX = 0,
    distY = 0,
    startTime = 0;
  const threshold = 30; 
  const restraint = 75; 
  el.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      startX = t.pageX;
      startY = t.pageY;
      startTime = Date.now();
      distX = 0;
      distY = 0;
    },
    { passive: true }
  );
  el.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      distX = t.pageX - startX;
      distY = t.pageY - startY;
      const elapsed = Date.now() - startTime;
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX < 0) opts.onSwipeLeft && opts.onSwipeLeft();
        else opts.onSwipeRight && opts.onSwipeRight();
      }
    },
    { passive: true }
  );
}


function spawnDOMParticles() {
  const container = $id("particles");
  if (!container) {
    log("DOM particles container not found");
    return;
  }
  container.innerHTML = "";
  for (let i = 0; i < 35; i++) {
    const s = document.createElement("span");
    s.className = "dom-particle";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + 20 + "px";
    s.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
    s.style.width = s.style.height = 6 + Math.random() * 10 + "px";
    s.style.animationDuration = 3 + Math.random() * 5 + "s";
    container.appendChild(s);
  }
}
spawnDOMParticles();


function throttle(fn, wait = 50) {
  let last = 0,
    timer = null;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}


function observeVisibility() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      
      log("tab hidden — you may pause heavy animations");
    } else {
      log("tab visible — resume animations");
    }
  });
}





if (DEBUG) {
  
  ["hero-ultra", "eventSlider", "sliderDots", "chocoParticles"].forEach(
    (id) => {
      const el = $id(id);
      if (el) el.style.outline = "1px dashed rgba(255,255,0,0.5)";
    }
  );
}


const captions = [
  {
    title: "Valentine Chocolate Festival",
    text: "Perayaan spesial penuh cokelat premium dan hadiah romantis.",
  },
  {
    title: "Merry Christmas Choco Parade",
    text: "Nikmati cokelat klasik dan edisi terbatas bertema natal.",
  },
  {
    title: "Happy Halloween Dark Choco Night",
    text: "Kemasan Halloween dengan rasa dark-choco khas dan aroma rempah.",
  },
  {
    title: "Golden Gift Box Edition",
    text: "Kotak hadiah cokelat emas premium — cocok untuk orang spesial.",
  },
  {
    title: "Spooky Gift Halloween Edition",
    text: "Koleksi cokelat Halloween paling eksklusif dan misterius.",
  },
];


function animateCaption(titleEl, textEl) {
  if (!titleEl || !textEl) return;

  titleEl.classList.remove("caption-animate");
  textEl.classList.remove("caption-animate");

  
  void titleEl.offsetWidth;
  void textEl.offsetWidth;

  titleEl.classList.add("caption-animate");
  textEl.classList.add("caption-animate");
}



const cards = document.querySelectorAll(".menu-card");
const cartPanel = document.getElementById("cartPanel");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const notif = document.getElementById("cartNotif");

let total = 0;


cards.forEach((card) => {
  const btn = card.querySelector(".add-btn");
  const inner = card.querySelector(".card-inner");
  const img = card.querySelector(".layer img");
  const title = card.querySelector(".title");
  const desc = card.querySelector(".float-desc");
  const pricePill = card.querySelector(".card-hover-info");

  if (!btn) return;

  
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `<span>${name}</span><strong>Rp ${price.toLocaleString()}</strong>`;
    cartList.appendChild(item);

    total += price;
    cartTotal.textContent = "Rp " + total.toLocaleString();

    cartPanel.classList.add("open");

    notif.classList.add("show");
    setTimeout(() => notif.classList.remove("show"), 1100);
  });

  
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = (x - cx) / cx; 
    const dy = (y - cy) / cy; 

    
    inner.style.willChange = "transform"; style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.05)`;

    
    const moveX = dx * 16;
    const moveY = dy * 16;
    img.style.willChange = "transform"; style.transform = `translate(${moveX}px, ${moveY}px) scale(1.15)`;

    
    inner.style.setProperty("--mx", `${x}px`);
    inner.style.setProperty("--my", `${y}px`);

    
    if (title) {
      title.style.opacity = 1;
      title.style.transform = "translateY(0)";
    }
    if (desc) {
      desc.style.opacity = 1;
      desc.style.transform = "translateY(0)";
    }

    
    if (pricePill) {
      pricePill.style.opacity = 1;
      pricePill.style.transform = "translateY(0) scale(1.05)";
    }
  });

  card.addEventListener("mouseleave", () => {
    
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    img.style.transform = "translate(0,0) scale(1)";

    
    if (title) {
      title.style.opacity = 0;
      title.style.transform = "translateY(15px)";
    }
    if (desc) {
      desc.style.opacity = 0;
      desc.style.transform = "translateY(15px)";
    }

    
    if (pricePill) {
      pricePill.style.opacity = 0;
      pricePill.style.transform = "translateY(15px) scale(1)";
    }
  });
});


document.addEventListener("click", (e) => {
  if (!cartPanel.contains(e.target) && !e.target.closest(".add-btn")) {
    cartPanel.classList.remove("open");
  }
});

const wrap = document.querySelector('.wrap');

for(let i=0; i<50; i++){
  const particle = document.createElement('div');
  particle.classList.add('choco-particle');
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  const size = 4 + Math.random()*10;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.animationDuration = `${3 + Math.random()*5}s`;
  particle.style.animationDelay = `${Math.random()*5}s`;
  wrap.appendChild(particle);
}


const container = document.getElementById("chocoVanta");

let scene, camera, renderer, particles = [];
const PARTICLE_COUNT = 45; 

init();
animate();

function init() {
  scene = new THREE.Scene();

  
  camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 80;

  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x1c0f07, 1); 
  container.appendChild(renderer.domElement);

  
  const light = new THREE.PointLight(0xffd9a3, 2, 200);
  light.position.set(0, 20, 40);
  scene.add(light);

  
  const geometry = new THREE.SphereGeometry(0.8, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4a2d15,               
    emissive: 0x120903,
    metalness: 0.55,               
    roughness: 0.35,
  });

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 50
    );

    sphere.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.25,
      (Math.random() - 0.5) * 0.25,
      (Math.random() - 0.5) * 0.25
    );

    scene.add(sphere);
    particles.push(sphere);
  }

  
  container.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * -2;
    camera.position.x += (x * 2 - camera.position.x) * 0.05;
    camera.position.y += (y * 2 - camera.position.y) * 0.05;
  });

  
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  
  particles.forEach((p) => {
    p.position.add(p.velocity);

    
    ["x", "y", "z"].forEach((axis) => {
      if (p.position[axis] > 30 || p.position[axis] < -30) {
        p.velocity[axis] *= -1;
      }
    });

    p.rotation.x += 0.01;
    p.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}






const locationCards = document.querySelectorAll('.js-location-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show'); 
      observer.unobserve(entry.target);    
    }
  });
}, {
  threshold: 0.2
});


locationCards.forEach(card => observer.observe(card));
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause all animations
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

