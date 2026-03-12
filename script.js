const body = document.body;
const signalLabel = document.querySelector("#signal-label");
const latencyLabel = document.querySelector("#latency-label");
const sceneKicker = document.querySelector("#scene-kicker");
const sceneTitle = document.querySelector("#scene-title");
const sceneCopy = document.querySelector("#scene-copy");
const shuffleButton = document.querySelector("#shuffle-scene");
const routeChips = [...document.querySelectorAll(".route-chip")];
const equalizerBars = [...document.querySelectorAll("#equalizer span")];
const starfield = document.querySelector("#starfield");
const pixelMarsh = document.querySelector("#pixel-marsh");

const scenes = [
  {
    id: "delta",
    signal: "Delta Glow",
    latency: "12ms twang",
    kicker: "Mode 01 / Delta Glow",
    title: "TRUCKSTOP DREAM ENGINE",
    copy: "A truckstop sign, a pedal steel, and a game board that thinks it can summon weather.",
    route: 0,
  },
  {
    id: "motel",
    signal: "Motel Violet",
    latency: "9ms shimmer",
    kicker: "Mode 02 / Motel Violet",
    title: "CHECK-IN FOR THE GHOST BAND",
    copy: "Vacancy bulbs blink in triplets while the bass line rolls behind the ice machine.",
    route: 1,
  },
  {
    id: "haywire",
    signal: "Haywire Gold",
    latency: "16ms sparks",
    kicker: "Mode 03 / Haywire Gold",
    title: "TRACTOR PULL AFTER MIDNIGHT",
    copy: "Everything smells like ozone, dirt, and a speaker cabinet that survived one too many county fairs.",
    route: 2,
  },
  {
    id: "gravel",
    signal: "Gravel Mint",
    latency: "11ms drift",
    kicker: "Mode 04 / Gravel Mint",
    title: "FIRELINE ON THE SERVICE ROAD",
    copy: "Cool neon bleeds into the fence line while the cabinet hums like it knows where the backroads go.",
    route: 3,
  },
];

let activeSceneIndex = 0;

function buildStarfield() {
  if (!starfield || starfield.children.length > 0) {
    return;
  }

  for (let index = 0; index < 44; index += 1) {
    const star = document.createElement("span");
    star.style.setProperty("--x", `${Math.random() * 100}%`);
    star.style.setProperty("--y", `${Math.random() * 72}%`);
    star.style.setProperty("--size", `${Math.random() * 0.22 + 0.08}rem`);
    star.style.setProperty("--delay", `${Math.random() * 3}s`);
    star.style.setProperty("--speed", `${Math.random() * 2 + 1.8}s`);
    starfield.appendChild(star);
  }
}

function buildPixelMarsh() {
  if (!pixelMarsh || pixelMarsh.children.length > 0) {
    return;
  }

  for (let index = 0; index < 70; index += 1) {
    pixelMarsh.appendChild(document.createElement("span"));
  }
}

function pulseEqualizer() {
  for (const bar of equalizerBars) {
    bar.style.setProperty("--level", `${Math.floor(Math.random() * 8) + 1}`);
  }
}

function pulsePixelMarsh() {
  const cells = [...pixelMarsh.querySelectorAll("span")];
  for (const cell of cells) {
    cell.classList.remove("is-lit", "is-cool");
    const roll = Math.random();
    if (roll > 0.86) {
      cell.classList.add("is-lit");
    } else if (roll > 0.72) {
      cell.classList.add("is-cool");
    }
  }
}

function renderScene(scene) {
  body.dataset.scene = scene.id;
  signalLabel.textContent = scene.signal;
  latencyLabel.textContent = scene.latency;
  sceneKicker.textContent = scene.kicker;
  sceneTitle.textContent = scene.title;
  sceneCopy.textContent = scene.copy;

  for (const [index, chip] of routeChips.entries()) {
    chip.classList.toggle("is-active", index === scene.route);
  }
}

function shuffleScene() {
  let nextIndex = activeSceneIndex;
  while (nextIndex === activeSceneIndex && scenes.length > 1) {
    nextIndex = Math.floor(Math.random() * scenes.length);
  }

  activeSceneIndex = nextIndex;
  renderScene(scenes[activeSceneIndex]);
}

buildStarfield();
buildPixelMarsh();
renderScene(scenes[activeSceneIndex]);
pulseEqualizer();
pulsePixelMarsh();

window.setInterval(pulseEqualizer, 1200);
window.setInterval(pulsePixelMarsh, 850);

if (shuffleButton) {
  shuffleButton.addEventListener("click", shuffleScene);
}
