document.documentElement.classList.add("js");

const form = document.getElementById("inquiry-form");
const status = document.getElementById("form-status");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");
const filterChips = document.querySelectorAll(".filter-chip");
const generalGalleryItems = document.querySelectorAll("#gallery .gallery-item");
const lightboxItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const nextStepButton = document.querySelector(".next-step");
const backStepButton = document.querySelector(".back-step");
const formPanels = document.querySelectorAll(".form-panel");
const formStepDots = document.querySelectorAll(".step-dot");

function setFormStep(step) {
  formPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.step !== String(step));
  });
  formStepDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index + 1 === step);
  });
}

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
  setFormStep(1);

  if (nextStepButton) {
    nextStepButton.addEventListener("click", () => {
      const requiredStepOneFields = Array.from(
        form.querySelectorAll('[data-step="1"] [required]')
      );
      const isValid = requiredStepOneFields.every((field) => field.reportValidity());
      if (isValid) {
        setFormStep(2);
      }
    });
  }

  if (backStepButton) {
    backStepButton.addEventListener("click", () => setFormStep(1));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "there").trim();
    status.textContent = `Thanks, ${name}. Your inquiry was captured. Connect this form to email next.`;
    form.reset();
    setFormStep(1);
  });
}

if (filterChips.length && generalGalleryItems.length) {
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selected = chip.dataset.filter || "all";

      filterChips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");

      generalGalleryItems.forEach((card) => {
        const style = card.dataset.style || "";
        const isVisible = selected === "all" || style === selected;
        card.classList.toggle("is-hidden", !isVisible);
      });
    });
  });
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  if (lightboxCaption) {
    lightboxCaption.textContent = "";
  }
}

if (lightboxItems.length && lightbox && lightboxImage) {
  lightboxItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest(".artist-jump")) {
        return;
      }

      const image = item.querySelector("img");
      const caption = item.querySelector("figcaption span");
      if (!image) {
        return;
      }

      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || "Tattoo gallery preview";
      if (lightboxCaption) {
        lightboxCaption.textContent = caption ? caption.textContent : "";
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
