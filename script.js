const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteNavigation.classList.toggle("is-open", !isExpanded);
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNavigation.classList.remove("is-open");
  }
});

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
const pageLoader = document.querySelector(".page-loader");
const startedAt = performance.now();

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const particleContainer = document.querySelector(".hero-particles");

if (!prefersReducedMotion) {
  const particles = document.createDocumentFragment();

  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement("span");
    particle.className = "hero-particle";
    particle.style.setProperty("--particle-left", `${15 + Math.random() * 70}%`);
    particle.style.setProperty("--particle-bottom", `${Math.random() * 25}%`);
    particle.style.setProperty("--particle-size", `${2 + Math.random() * 3}px`);
    particle.style.setProperty("--particle-duration", `${12 + Math.random() * 10}s`);
    particle.style.setProperty("--particle-delay", `${-Math.random() * 18}s`);
    particles.append(particle);
  }

  particleContainer.append(particles);
}

let siteRevealed = false;

function revealSite() {
  if (siteRevealed) {
    return;
  }

  siteRevealed = true;
  const minimumDelay = prefersReducedMotion ? 100 : 1050;
  const remainingDelay = Math.max(0, minimumDelay - (performance.now() - startedAt));

  window.setTimeout(() => {
    pageLoader.classList.add("is-dismissed");
    hero.classList.add("is-ready");

    if (!prefersReducedMotion) {
      window.setTimeout(() => hero.querySelector("h1").classList.add("shimmer"), 2100);
    }
  }, remainingDelay);
}

window.addEventListener("load", revealSite, { once: true });
window.setTimeout(revealSite, 2300);

let scrollFrame = 0;

function updateHeroOnScroll() {
  scrollFrame = 0;
  const scrollY = Math.max(0, window.scrollY);
  const progress = Math.min(scrollY / hero.offsetHeight, 1);

  hero.style.setProperty("--background-parallax", `${scrollY * 0.16}px`);
  heroContent.style.setProperty("--content-parallax", `${-scrollY * 0.2}px`);
  heroContent.style.setProperty("--content-opacity", `${Math.max(0, 1 - progress * 1.45)}`);
  hero.style.setProperty("--scroll-cue-opacity", `${Math.max(0, 0.95 - progress * 4)}`);
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateHeroOnScroll);
    }
  },
  { passive: true },
);

updateHeroOnScroll();
