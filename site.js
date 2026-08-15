document.addEventListener("DOMContentLoaded", () => {

  // MOBILE MENU
  const headerInner = document.querySelector(".header-inner");
  const nav = document.querySelector(".main-nav");

  if (headerInner && nav) {
    let toggle = document.querySelector(".menu-toggle");

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "menu-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Open menu");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "main-navigation");

      nav.id = "main-navigation";
      headerInner.insertBefore(toggle, nav);
    }

    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setMenu(!nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMenu(false);
      }
    });
  }


  // FAQ DROPDOWNS
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    if (!button || !icon) return;

    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");

        const otherButton = other.querySelector(".faq-question");
        const otherIcon = other.querySelector(".faq-icon");

        if (otherButton) {
          otherButton.setAttribute("aria-expanded", "false");
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        icon.textContent = "–";
      }
    });
  });


  // CONTACT FORM
  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");

  if (form && status) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submit = form.querySelector('button[type="submit"]');
      const oldText = submit.textContent;

      submit.disabled = true;
      submit.textContent = "Sending…";
      status.classList.remove("show");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Submission failed");
        }

        form.reset();
        status.textContent =
          "Thank you. Your inquiry has been sent. I’ll be in touch soon.";
        status.classList.add("show");

      } catch (error) {
        status.textContent =
          "Something went wrong. Please try again or reach out through Instagram.";
        status.classList.add("show");

      } finally {
        submit.disabled = false;
        submit.textContent = oldText;
      }
    });
  }

});
