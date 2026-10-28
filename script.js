/*
 * AISHUUUUU VALENTINE WEBSITE
 * Easy personalisation lives in the CONFIG object below.
 * No frameworks, build step, or backend required.
 */
const CONFIG = {
  herName: "Aishwarya",
  petName: "Aishuuuuu",
  occasion: "Will you be my Valentine?",
  insideJokes: ["Anyyything", "Biryani Paglu", "Sleepy head", "Lambuuu"],
  noButtonMessages: [
    "No 🙄",
    "Pakka no? 🥺",
    "Think again, Aishuuuuu!",
    "Anyyything but NO 😭",
    "Biryani bribe? 🍛",
    "Lambuuu says pleaseee",
    "Wrong button, sleepy head!",
    "Okay now you're just teasing me 💗"
  ],
  yesButtonText: "YESSS, obviously! 💖",
  // Change this to false if you prefer not to create floating hearts.
  floatingHearts: true
};

const introScreen = document.getElementById("introScreen");
const revealScreen = document.getElementById("revealScreen");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonStage = document.getElementById("buttonStage");
const hintText = document.getElementById("hintText");
const restartButton = document.getElementById("restartButton");
const foreverButton = document.getElementById("foreverButton");
const foreverResponse = document.getElementById("foreverResponse");
const musicToggle = document.getElementById("musicToggle");
const floatingHearts = document.getElementById("floatingHearts");

let noCount = 0;
let audioContext = null;
let musicTimer = null;
let musicOn = false;
let noteIndex = 0;

// Apply core personalisation to text without requiring edits throughout the HTML.
document.title = `${CONFIG.petName}, one tiny question 💗`;
document.querySelector(".eyebrow").textContent = `ATTENTION, ${CONFIG.herName.toUpperCase()}!`;
document.getElementById("mainTitle").innerHTML = `${CONFIG.petName}…<br><span>${CONFIG.occasion.toLowerCase()}</span>`;
yesButton.textContent = CONFIG.yesButtonText;

function moveNoButton() {
  noCount++;
  const messages = CONFIG.noButtonMessages;
  noButton.textContent = messages[Math.min(noCount, messages.length - 1)];
  const hints = [
    "Psst… try the other button if you dare.",
    "Aishuuuuu, the YES button is looking very clickable 👀",
    "I even asked nicelyyy 🥹",
    "What if I say please with puppy eyes? 🥺",
    "I will remember this. (I will still love you.)",
    "Last chance to save this poor little website 😭"
  ];
  hintText.textContent = hints[Math.min(noCount, hints.length - 1)];

  // After several attempts the NO button playfully escapes its usual spot.
  if (noCount >= 2) {
    const stageRect = buttonStage.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const maxX = Math.max(0, Math.min(190, stageRect.width / 2 - buttonRect.width / 2 + 70));
    const maxY = 32;
    const dx = (Math.random() * 2 - 1) * maxX;
    const dy = (Math.random() * 2 - 1) * maxY;
    noButton.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() * 16 - 8).toFixed(1)}deg)`;
  }

  // On the fourth try it gives up and politely disappears; YES is the only option.
  if (noCount >= 7) {
    noButton.classList.add("hidden");
    hintText.textContent = "Hehe. Looks like there is only one answer now. 💖";
  }
}

noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse" && noCount >= 1 && noCount < 7) moveNoButton();
});
noButton.addEventListener("click", moveNoButton);
noButton.addEventListener("touchstart", (event) => {
  if (noCount >= 1 && noCount < 7) {
    event.preventDefault();
    moveNoButton();
  }
}, { passive: false });

yesButton.addEventListener("click", () => {
  introScreen.classList.add("hidden");
  revealScreen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  launchConfetti();
  if (navigator.vibrate) navigator.vibrate([35, 30, 70]);
});

foreverButton.addEventListener("click", () => {
  foreverResponse.classList.remove("hidden");
  foreverButton.textContent = "Best decision ever 💞";
  launchConfetti(65);
});

restartButton.addEventListener("click", () => {
  stopMusic();
  revealScreen.classList.add("hidden");
  introScreen.classList.remove("hidden");
  noCount = 0;
  noButton.classList.remove("hidden");
  noButton.style.transform = "";
  noButton.textContent = CONFIG.noButtonMessages[0];
  yesButton.textContent = CONFIG.yesButtonText;
  hintText.textContent = "Psst… try the other button if you dare.";
  foreverResponse.classList.add("hidden");
  foreverButton.textContent = "Obviously, Lambuuu 💞";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function launchConfetti(amount = 90) {
  const symbols = ["💗", "💕", "🌸", "♥", "✨", "💖", "♡"];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.fontSize = `${12 + Math.random() * 19}px`;
    piece.style.animationDuration = `${1.8 + Math.random() * 2.2}s`;
    piece.style.animationDelay = `${Math.random() * .65}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5000);
  }
}

function addFloatingHeart() {
  if (!CONFIG.floatingHearts || document.hidden) return;
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = ["♡", "♥", "✿"][Math.floor(Math.random() * 3)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 22}px`;
  heart.style.animationDuration = `${7 + Math.random() * 8}s`;
  floatingHearts.appendChild(heart);
  window.setTimeout(() => heart.remove(), 16000);
}
window.setInterval(addFloatingHeart, 900);

// A tiny original melody made with Web Audio. It only plays after a tap,
// since browsers block audio that starts automatically.
function playNextNote() {
  if (!musicOn || !audioContext) return;
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 1046.5];
  const freq = notes[noteIndex % notes.length];
  noteIndex++;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.45);
}
function stopMusic() {
  musicOn = false;
  if (musicTimer) window.clearInterval(musicTimer);
  musicTimer = null;
  if (audioContext && audioContext.state !== "closed") audioContext.suspend();
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.textContent = "♫ Turn on our tiny love song";
}
musicToggle.addEventListener("click", async () => {
  if (musicOn) {
    stopMusic();
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    musicToggle.textContent = "Audio isn't supported in this browser 💗";
    return;
  }
  try {
    audioContext = audioContext || new AudioCtx();
    await audioContext.resume();
    musicOn = true;
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.textContent = "♫ Pause our tiny love song";
    playNextNote();
    musicTimer = window.setInterval(playNextNote, 470);
  } catch (error) {
    musicToggle.textContent = "Tap again to try the music ♫";
  }
});
