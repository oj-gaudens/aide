const textarea = document.getElementById("markdown-input");
const preview = document.getElementById("preview");
const template = document.getElementById("template-selector");
const theme = document.getElementById("theme-selector");

let currentSlide = 0;

function render() {
  const md = textarea.value;

  if (template.value === "slides") {
    const slides = md.split("---").map(s => s.trim()).filter(Boolean);
    preview.innerHTML = "";
    slides.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "slide" + (i === currentSlide ? " current" : "");
      div.innerHTML = marked.parse(s);
      preview.appendChild(div);
    });
  } else {
    preview.innerHTML = marked.parse(md);
  }
}

textarea.addEventListener("input", render);
template.addEventListener("change", () => {
  currentSlide = 0;
  render();
});

theme.addEventListener("change", e => {
  document.body.className = e.target.value;
});

document.getElementById("copy-html").onclick = () =>
  navigator.clipboard.writeText(preview.innerHTML);

document.getElementById("copy-text").onclick = () =>
  navigator.clipboard.writeText(textarea.value);

document.getElementById("download-html").onclick = () => {
  const blob = new Blob([preview.innerHTML], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.html";
  a.click();
};

document.getElementById("export-pdf").onclick = () => window.print();
document.getElementById("clear-all").onclick = () => { textarea.value=""; render(); };
document.getElementById("fullscreen").onclick = () => document.body.requestFullscreen();

document.addEventListener("keydown", e => {
  if (template.value !== "slides") return;
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  slides[currentSlide].classList.remove("current");
  if (e.key === "ArrowRight") currentSlide = (currentSlide + 1) % slides.length;
  if (e.key === "ArrowLeft") currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].classList.add("current");
});

render();
