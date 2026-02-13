// ✅ endpoint Formspree kamu
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaleqal";

// ====== SLIDES (bisa kamu edit kata-katanya) ======
const slides = [
  {
    title: `happy valentine's dayy <span class="accent">kezia</span>!! 💘`,
    body: `eits jangan skip 😤\naku ada sesuatu dikit wkwk`
  },
  {
    title: `sebenernya…`,
    body: `aku tuh tiap liat kamu tuh\nkayak: “lah kok bisa ya orang se-oke ini ada” 😭💗`
  },
  {
    title: `serius deh`,
    body: `hari ini aku cuma mau bilang:\nmakasih ya… beneran.`
  },
  {
    title: `bentar lagi last`,
    body: `tap lagi...\nabis itu ada pertanyaan 😛`
  },
  {
    title: `oke terakhir`,
    body: `habis ini jawab ya\nbiar aku tau wkwk`
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
    const drift = (Math.random
