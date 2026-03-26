// scroll-video.js
// Drives a frame-sequence video using GSAP ScrollTrigger.
// Drop your exported frames into /video/frames/ as frame0001.jpg, frame0002.jpg, ...

const TOTAL_FRAMES = 450; // update after running FFmpeg (fps * duration)
const FRAME_PATH   = "video/frames/frame";
const FRAME_EXT    = ".jpg";

const canvas  = document.getElementById("scroll-canvas");
const ctx     = canvas.getContext("2d");

// Preload all frames into an array
const frames  = [];
let   loaded  = 0;

function preloadFrames(onComplete) {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num  = String(i).padStart(4, "0");       // e.g. 0001
    img.src    = `${FRAME_PATH}${num}${FRAME_EXT}`;
    img.onload = () => { if (++loaded === TOTAL_FRAMES) onComplete(); };
    img.onerror = () => { loaded++; if (loaded === TOTAL_FRAMES) onComplete(); };
    frames[i - 1] = img;
  }
}

function renderFrame(index) {
  const img = frames[Math.max(0, Math.min(index, TOTAL_FRAMES - 1))];
  if (!img || !img.complete) return;
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
}

// Wire up GSAP ScrollTrigger once frames are ready
preloadFrames(() => {
  renderFrame(0); // show first frame immediately

  gsap.registerPlugin(ScrollTrigger);

  const obj = { frame: 0 };

  gsap.to(obj, {
    frame: TOTAL_FRAMES - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#scroll-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,           // smoothness; lower = snappier
    },
    onUpdate: () => renderFrame(Math.round(obj.frame)),
  });
});
