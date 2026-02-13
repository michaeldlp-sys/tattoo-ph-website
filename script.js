const form = document.getElementById("inquiry-form");
const status = document.getElementById("form-status");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "there").trim();
    status.textContent = `Thanks, ${name}. Your inquiry was captured. Connect this form to email next.`;
    form.reset();
  });
}
