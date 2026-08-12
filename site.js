document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");
    if (!button || !icon) return;
    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        const b = other.querySelector(".faq-question");
        const i = other.querySelector(".faq-icon");
        if (b) b.setAttribute("aria-expanded","false");
        if (i) i.textContent = "+";
      });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded","true");
        icon.textContent = "–";
      }
    });
  });

  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");
  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      const oldText = submit.textContent;
      submit.disabled = true;
      submit.textContent = "Sending…";
      status.classList.remove("show");
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (response.ok) {
          form.reset();
          status.textContent = "Thank you. Your inquiry has been sent. I’ll be in touch soon.";
          status.classList.add("show");
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        status.textContent = "Something went wrong. Please try again or reach out through Instagram.";
        status.classList.add("show");
      } finally {
        submit.disabled = false;
        submit.textContent = oldText;
      }
    });
  }
});
