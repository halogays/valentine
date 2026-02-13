// ✅ endpoint Formspree kamu
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaleqal";

// ====== SLIDES (bisa kamu edit kata-katanya) ======
const slides = [
  {
    title: `happy valentine's dayy yaaa <span class="accent">kezia</span>!! 💘`,
    body: `eii sebentarr\naku ada sesuatu dikit wkwk`
  },
  {
    title: `jujur ni`,
    body: `aku liat kamu ko\nkayak: “ko dia makin hari makin cakep yh” `
  },
  {
    title: `samting samting`,
    body: `hei makasi ya km uda mewarnai hari-hari aku wkwkw:\nkalo gaada kamu ma lentera rating 3/10 aja inii, karna ada kamu langsung naik jadi 7/10. makasi banyak yaah.`
  },
  {
    title: `bentar dikit lagi`,
    body: `dipencet terus yh.awas aja malas.\nabis itu ada pertanyaan 😛`
  },
  {
    title: `adaa pertanyaan nii`,
    body: `jangan ngga dijawab yh\nbiar aku tau ni wkwk`
  }
];

const stage = document.getElementById("stage");
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
    <div class="big"></div>
    <div class="mid"></div>
  `;
  slideEl.querySelector(".big").innerHTML = s.title;
  slideEl.querySelector(".mid").textContent = s.body;

  prevBtn.disabled = idx === 0;
  nextBtn.textContent = (idx === slides.length - 1) ? "lanjut →" : "tap <3";
  renderDots();
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
    // ✅ setelah tap terakhir: buka form + buka scroll + auto scroll
    stage.classList.add("hidden");
    formCard.classList.remove("hidden");
    document.body.classList.remove("lock");

    setTimeout(() => {
      formCard.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("from").focus();
    }, 120);

    pop(1.3);
    confettiBurst();
  }
});

backToSlides.addEventListener("click", () => {
  // balik ke slide: kunci scroll lagi
  formCard.classList.add("hidden");
  stage.classList.remove("hidden");
  document.body.classList.add("lock");
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

// ====== pop anim ======
function pop(mult=1){
  slideEl.animate([
    { transform:"scale(1)" },
    { transform:`scale(${1.02*mult})` },
    { transform:"scale(1)" }
  ], { duration: 220, easing:"ease-out" });
}

// ====== confetti ======
function confettiBurst(){
  for(let i=0;i<24;i++){
    const d = document.createElement("div");
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

// ====== falling hearts/petals canvas ======
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const items = Array.from({length: 48}, () => ({
  x: Math.random()*canvas.width,
  y: -Math.random()*canvas.height,
  s: 10 + Math.random()*18,
  sp: 0.6 + Math.random()*1.4,
  wob: Math.random()*Math.PI*2,
  kind: Math.random() > 0.55 ? "heart" : "petal",
  rot: Math.random()*Math.PI*2
}));

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
      p.y = -40;
      p.x = Math.random()*canvas.width;
    }
  }
  requestAnimationFrame(tick);
}
tick();

// init slide
renderSlide();
