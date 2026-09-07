const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("#year, .year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

document.querySelectorAll(".contact-form").forEach((form) => {
  if (form.action.startsWith("mailto:")) form.action = "/api/intake";
  const status = document.createElement("p");
  status.className = "form-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.insertBefore(status, form.querySelector("button[type=submit]"));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.textContent = "Sending securely…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error(`Intake request failed with ${response.status}`);
      form.reset();
      status.textContent = "Thank you. Your request was sent securely.";
    } catch (error) {
      console.error(error);
      status.textContent = "We could not send your request. Please try again later.";
    } finally {
      button.disabled = false;
    }
  });
});

// Set this after consent management and the production GA4 property are configured.
const GA_MEASUREMENT_ID = "";

if (GA_MEASUREMENT_ID) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}
