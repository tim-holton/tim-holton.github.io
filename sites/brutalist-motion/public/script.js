const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    }
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  },
);

for (const node of document.querySelectorAll("[data-reveal]")) {
  revealObserver.observe(node);
}

const parallaxNodes = [...document.querySelectorAll("[data-parallax]")];
const liveStamp = document.querySelector(".stamp.is-live");

let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;

  for (const node of parallaxNodes) {
    const speed = Number(node.dataset.parallax || 0);
    const driftY = scrollY * speed;
    const driftX = scrollY * speed * -0.35;

    node.style.setProperty("--shift-x", `${driftX}px`);
    node.style.setProperty("--shift-y", `${driftY}px`);
  }

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
updateParallax();

if (liveStamp) {
  window.setInterval(() => {
    liveStamp.classList.toggle("is-live");
    window.setTimeout(() => liveStamp.classList.toggle("is-live"), 220);
  }, 1800);
}
