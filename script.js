// endpoint Formspree kamu ✅
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaleqal";

// ====== SLIDES (edit kata-kata di sini, santai aja) ======
const slides = [
  {
    title: `happy valentine's dayy\n<span class="accent">kezia</span>!! 💘`,
    body: `eits jangan skip 😤\naku ada sesuatu dikit wkwk`
  },
  {
    title: `sebenernya…`,
    body: `aku tuh tiap liat kamu tuh\nkayak: “lah kok bisa ya orang se-oke ini ada” 😭💗`
  },
  {
    title: `makasih ya`,
    body: `makasih udah jadi orang yang bikin hari tuh lebih enak\n(serius ini bukan gombal doang)`
  },
  {
    title: `udah siap?`,
    body: `tap lagi…\nbentar lagi ada pertanyaan 😛`
  },
  {
    title: `oke last`,
    body: `habis ini jawab ya\nbiar aku tau wkwk`
  }
];

// ====== Render slide ======
const slideEl = document.getElementById("slide");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const formCard = document.getElementById("formCard");
const backToSlides = document.getElementById("backToSlides");
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");

let idx = 0;

function renderDots(){
  dotsEl.innerHTML = "";
  for(let i=0;i<slides.length;i++){
    const d = document.createElement("div");
    d.className = "dot" + (i===idx ? " on" : "");
    dotsEl.appendChild(d);
  }
}

function renderSlide(){
  const s = slides[idx];
  slideEl.innerHTML = `
    <div class="big">${s.title}</div>
    <div class="mid">${escapeHTML(s.body)}</div>
  `;
  slideEl.querySelector(".big").innerHTML = s.title;

  prevBtn.disabled = idx === 0;
  prevBtn.style.opacity = idx === 0 ? .6 : 1;

  nextBtn.textContent = (idx === slides.length - 1) ? "lanjut →" : "tap <3";
  renderDots();
}

function escapeHTML(t){
  return (t ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

prevBtn.addEventListener("click", () => {
  idx = Math.max(0, idx - 1);
  pop();
  renderSlide();
});

nextBtn.addEventListener("click", () => {
  if(idx < slides.length - 1){
    idx++;
    pop();
    renderSlide();
  } else {
    document.querySelector(".stage").classList.add("hidden");
    formCard.classList.remove("hidden");
    pop(1.3);
    confettiBurst();
    document.getElementById("from").focus();
  }
});

backToSlides.addEventListener("click", () => {
  formCard.classList.add("hidden");
  document.querySelector(".stage").classList.remove("hidden");
  pop();
});

// ====== audio on/off (opsional) ======
let musicOn = false;
musicBtn.addEventListener("click", async () => {
  try{
    if(!musicOn){
      await bgm.play();
      musicOn = true;
      musicBtn.textContent = "🔊 on";
    } else {
      bgm.pause();
      musicOn = false;
      musicBtn.textContent = "🔇 off";
    }
  }catch(e){
    musicBtn.textContent = "gaada musik 😭";
    setTimeout(()=> musicBtn.textContent="🔊 on/off", 1200);
  }
});

// ====== submit Formspree ======
const form = document.getElementById("valForm");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? "#167a2f" : "#b00020";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  sendBtn.disabled = true;
  sendBtn.textContent = "ngirim dulu...";

  try{
    const fd = new FormData(form);
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: fd,
      headers: { "Accept":"application/json" }
    });
    if(!res.ok) throw new Error("gagal ngirim 😭 coba lagi");

    setStatus("udah kekirim! makasih ya 💖", true);
    confettiBurst();
    form.reset();
  }catch(err){
    setStatus(err.message, false);
  }finally{
    sendBtn.disabled = false;
    sendBtn.textContent = "kirim 💌";
  }
});

// ====== little pop animation ======
function pop(mult=1){
  slideEl.animate([
    { transform:"scale(1)", filter:"brightness(1)" },
    { transform:`scale(${1.02*mult})`, filter:"brightness(1.03)" },
    { transform:"scale(1)", filter:"brightness(1)" }
  ], { duration: 220, easing:"ease-out" });
}

// init
renderSlide();

// ====== Confetti ======
function confettiBurst(){
  for(let i=0;i<24;i++){
    const d = document.createElement("div");
    d.className = "confetti";
    d.style.left = (Math.random()*100) + "vw";
    d.style.top = "-10px";
    d.style.background = Math.random()>0.5 ? "#ff3b7a" : "#ff7aa8";
    d.style.width = (6 + Math.random()*7) + "px";
    d.style.height = (10 + Math.random()*16) + "px";
    d.style.borderRadius = "3px";
    d.style.position = "fixed";
    d.style.zIndex = 9;
    d.style.pointerEvents = "none";
    document.body.appendChild(d);

    const dur = 1200 + Math.random()*900;
    const drift = (Math.random()*2 - 1) * 140;

    d.animate([
      { transform:"translate(0,0) rotate(0deg)", opacity: 1 },
      { transform:`translate(${drift}px, 105vh) rotate(${420+Math.random()*360}deg)`, opacity: 0.05 }
    ], { duration: dur, easing:"cubic-bezier(.2,.8,.2,1)" });

    setTimeout(()=> d.remove(), dur+50);
  }
}

// ====== Falling hearts/petals canvas ======
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const items = Array.from({length: 48}, () => makeItem());
function makeItem(){
  return {
    x: Math.random()*canvas.width,
    y: -Math.random()*canvas.height,
    s: 10 + Math.random()*18,
    sp: 0.6 + Math.random()*1.4,
    wob: Math.random()*Math.PI*2,
    kind: Math.random() > 0.55 ? "heart" : "petal",
    rot: Math.random()*Math.PI*2
  };
}

function drawHeart(x,y,size){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(Math.sin(size)*0.2);
  ctx.scale(size/24, size/24);
  ctx.fillStyle = Math.random()>0.5 ? "rgba(255,59,122,.75)" : "rgba(255,122,168,.75)";
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(0, 0, -12, 0, -12, 8);
  ctx.bezierCurveTo(-12, 16, 0, 20, 0, 26);
  ctx.bezierCurveTo(0, 20, 12, 16, 12, 8);
  ctx.bezierCurveTo(12, 0, 0, 0, 0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPetal(x,y,size,rot){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.fillStyle = "rgba(255,170,200,.75)";
  ctx.beginPath();
  ctx.ellipse(0,0, size*0.55, size*0.9, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(const p of items){
    p.y += p.sp*2.2;
    p.x += Math.sin(p.wob) * 0.6;
    p.wob += 0.02;
    p.rot += 0.02;

    if(p.kind === "heart") drawHeart(p.x, p.y, p.s);
    else drawPetal(p.x, p.y, p.s, p.rot);

    if(p.y > canvas.height + 40){
      Object.assign(p, makeItem(), { y: -40 });
    }
  }
  requestAnimationFrame(tick);
}
tick();
