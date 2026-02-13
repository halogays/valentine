// ✅ GANTI endpoint Formspree kamu di sini (contoh: https://formspree.io/f/xxxxabcd)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaleqal";

// ====== Modal (surat) ======
const modal = document.getElementById("letterModal");
const openBtn = document.getElementById("openBtn");
const skipBtn = document.getElementById("skipBtn");
const reopenLetter = document.getElementById("reopenLetter");

function showModal(){
  modal.classList.remove("hidden");
  // reset animasi
  modal.classList.remove("opened");
  setTimeout(() => modal.classList.add("opened"), 50);
}
function hideModal(){
  modal.classList.add("hidden");
}

openBtn.addEventListener("click", () => hideModal());
skipBtn.addEventListener("click", () => hideModal());
reopenLetter.addEventListener("click", () => showModal());

// Tampil surat pas pertama kali buka
showModal();

// ====== Submit form ke Formspree (tanpa reload) ======
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
  sendBtn.textContent = "Mengirim...";

  try{
    const formData = new FormData(form);

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) throw new Error("Gagal mengirim. Coba lagi.");

    setStatus("Terkirim! Makasih ya 💖", true);
    form.reset();
  }catch(err){
    setStatus("Error: " + err.message, false);
  }finally{
    sendBtn.disabled = false;
    sendBtn.textContent = "Kirim 💌";
  }
});
