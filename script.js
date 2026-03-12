const body = document.body;
const stageWindow = document.querySelector("#stage-window");
const fireflyField = document.querySelector("#firefly-field");
const pineBack = document.querySelector("#pine-back");
const pineFront = document.querySelector("#pine-front");
const noteDrift = document.querySelector("#note-drift");
const turnDial = document.querySelector("#turn-dial");
const sceneLabel = document.querySelector("#scene-label");
const sceneTitle = document.querySelector("#scene-title");
const sceneCopy = document.querySelector("#scene-copy");
const toneBars = [...document.querySelectorAll("#tone-bars span")];
const depthLayers = [...document.querySelectorAll("[data-depth]")];
const readoutScene = document.querySelector("#readout-scene");
const readoutPines = document.querySelector("#readout-pines");
const readoutFireflies = document.querySelector("#readout-fireflies");
const readoutSprites = document.querySelector("#readout-sprites");
const readoutDrift = document.querySelector("#readout-drift");

const scenes = [
  {
    id: "delta",
    label: "Porch Pickin at Sundown",
    title: "The porch is humming and the mountain keeps time.",
    copy: "Holler Arcade is an art project with one boot on the porch boards and the other on a render pass.",
  },
  {
    id: "creek",
    label: "Creekbank After the Rain",
    title: "The water runs cool and the code runs crooked on purpose.",
    copy: "This version leans into the softer side of the machine, where bluegrass memory and little visual tricks are carrying the same tune.",
  },
  {
    id: "truck",
    label: "Truck Bed Full of Racket",
    title: "There is dirt on the floorboards and light in all the wrong places.",
    copy: "The humor comes from treating an old truck, a banjo, and a sprite stack like they all belong in the same sacred mess.",
  },
  {
    id: "moon",
    label: "Moonrise Over the Log Cabin",
    title: "By midnight the whole holler starts acting like a game engine.",
    copy: "This is the fever-dream cut, where the critters get bold, the shadows get dramatic, and the technology shows its teeth a little.",
  },
];

let activeSceneIndex = 0;

function buildPines(container, count, minHeight, maxHeight) {
  if (!container || container.children.length > 0) {
    return;
  }

  for (let index = 0; index < count; index += 1) {
    const pine = document.createElement("span");
    pine.style.setProperty("--x", `${(index / (count - 1)) * 100}%`);
    pine.style.setProperty("--height", `${Math.random() * (maxHeight - minHeight) + minHeight}%`);
    pine.style.setProperty("--width", `${Math.random() * 2 + 2.6}rem`);
    pine.style.setProperty("--squash", `${Math.random() * 0.22 + 0.92}`);
    container.appendChild(pine);
  }
}

function buildFireflies() {
  if (!fireflyField || fireflyField.children.length > 0) {
    return;
  }

  for (let index = 0; index < 24; index += 1) {
    const spark = document.createElement("span");
    spark.style.setProperty("--x", `${Math.random() * 100}%`);
    spark.style.setProperty("--y", `${Math.random() * 68 + 6}%`);
    spark.style.setProperty("--size", `${Math.random() * 0.32 + 0.12}rem`);
    spark.style.setProperty("--delay", `${Math.random() * 3}s`);
    spark.style.setProperty("--speed", `${Math.random() * 2 + 1.8}s`);
    fireflyField.appendChild(spark);
  }
}

function buildNotes() {
  if (!noteDrift || noteDrift.children.length > 0) {
    return;
  }

  const glyphs = ["*", "+", "~", "o", "^"];
  for (let index = 0; index < 12; index += 1) {
    const note = document.createElement("span");
    note.textContent = glyphs[index % glyphs.length];
    note.style.setProperty("--x", `${Math.random() * 56 + 28}%`);
    note.style.setProperty("--y", `${Math.random() * 28 + 34}%`);
    note.style.setProperty("--size", `${Math.random() * 0.8 + 0.8}rem`);
    note.style.setProperty("--delay", `${Math.random() * 2.4}s`);
    note.style.setProperty("--speed", `${Math.random() * 4 + 4}s`);
    noteDrift.appendChild(note);
  }
}

function pulseBars() {
  for (const bar of toneBars) {
    bar.style.setProperty("--level", `${Math.floor(Math.random() * 7) + 1}`);
  }
}

function renderScene(scene) {
  body.dataset.scene = scene.id;
  sceneLabel.textContent = scene.label;
  sceneTitle.textContent = scene.title;
  sceneCopy.textContent = scene.copy;
  if (readoutScene) {
    readoutScene.textContent = scene.id;
  }
}

function cycleScene() {
  activeSceneIndex = (activeSceneIndex + 1) % scenes.length;
  renderScene(scenes[activeSceneIndex]);
}

function handlePointerMove(event) {
  if (!stageWindow) {
    return;
  }

  const bounds = stageWindow.getBoundingClientRect();
  const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
  const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

  for (const layer of depthLayers) {
    const depth = Number(layer.dataset.depth || 0);
    const moveX = offsetX * depth * 90;
    const moveY = offsetY * depth * 70;
    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  }

  if (readoutDrift) {
    const driftX = Math.round(offsetX * 100);
    const driftY = Math.round(offsetY * 100);
    readoutDrift.textContent = `x:${driftX >= 0 ? "+" : ""}${driftX} y:${driftY >= 0 ? "+" : ""}${driftY}`;
  }
}

function resetParallax() {
  for (const layer of depthLayers) {
    layer.style.transform = "translate3d(0, 0, 0)";
  }

  if (readoutDrift) {
    readoutDrift.textContent = "idle";
  }
}

buildPines(pineBack, 18, 28, 56);
buildPines(pineFront, 22, 34, 72);
buildFireflies();
buildNotes();
renderScene(scenes[activeSceneIndex]);
pulseBars();

if (readoutPines) {
  readoutPines.textContent = String((pineBack?.children.length || 0) + (pineFront?.children.length || 0));
}

if (readoutFireflies) {
  readoutFireflies.textContent = String(fireflyField?.children.length || 0);
}

if (readoutSprites) {
  readoutSprites.textContent = String(document.querySelectorAll(".sprite").length);
}

window.setInterval(pulseBars, 1200);

if (turnDial) {
  turnDial.addEventListener("click", cycleScene);
}

if (stageWindow) {
  stageWindow.addEventListener("pointermove", handlePointerMove);
  stageWindow.addEventListener("pointerleave", resetParallax);
}
