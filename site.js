document.addEventListener("DOMContentLoaded", () => {

  // ACCESSIBILITY + PERFORMANCE POLISH
  const utilityStyles = document.createElement("style");
  utilityStyles.textContent = `
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline:2px solid #b49356;
      outline-offset:3px;
    }
    [hidden]{display:none !important}
    .footer-legal{margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:.05em}
    .footer-legal a{color:rgba(245,240,230,.7);text-decoration:underline;text-underline-offset:3px}
    .footer-legal a:hover,.footer-legal a:focus-visible{color:#b49356}
    .form-privacy-note{margin:18px 0 0;color:#69625b;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;text-align:center}
    .form-privacy-note a{text-underline-offset:3px}

    /* UNIVERSAL PAGE-HERO TYPOGRAPHY */
    .home-copy h1,
    .about-intro .serif-title,
    .draw-hero h1,
    .faq-copy .serif-title,
    .contact-hero h1,
    .gallery-hero .serif-title {
      font-size:clamp(36px,4.2vw,54px) !important;
      line-height:1.06 !important;
      letter-spacing:-.02em !important;
      font-weight:400 !important;
    }

    .home-copy .body-copy,
    .about-intro .body-copy,
    .draw-hero .lead,
    .faq-copy .body-copy,
    .contact-hero .body-copy,
    .gallery-hero .body-copy {
      font-size:clamp(15px,1.2vw,17px) !important;
      line-height:1.6 !important;
    }

    .home-copy .eyebrow,
    .about-intro .eyebrow,
    .draw-hero .eyebrow,
    .faq-copy .eyebrow,
    .contact-hero .eyebrow,
    .gallery-hero .eyebrow {
      font-size:10px !important;
      line-height:1.4 !important;
    }

    @media (max-width:620px){
      .home-copy h1,
      .about-intro .serif-title,
      .draw-hero h1,
      .faq-copy .serif-title,
      .contact-hero h1,
      .gallery-hero .serif-title {
        font-size:clamp(34px,10vw,42px) !important;
      }
    }

    @media (prefers-reduced-motion: reduce){
      html{scroll-behavior:auto !important}
      *,*::before,*::after{transition:none !important;animation:none !important}
    }
  `;
  document.head.appendChild(utilityStyles);

  document.querySelectorAll("img").forEach((img) => {
    img.decoding = "async";
  });

  // PRIVACY LINKS
  document.querySelectorAll(".site-footer").forEach((footer) => {
    if (!footer.querySelector(".footer-legal")) {
      const legal = document.createElement("p");
      legal.className = "footer-legal";
      legal.innerHTML = '<a href="privacy.html">Privacy Policy</a>';

      const copyright = footer.querySelector(".copyright");
      if (copyright) {
        footer.insertBefore(legal, copyright);
      } else {
        footer.appendChild(legal);
      }
    }
  });

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
        if (window.innerWidth <= 760) toggle.focus();
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

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenu(false);
    });
  }


  // FAQ DROPDOWNS
  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (!button || !answer || !icon) return;

    const answerId = `faq-answer-${index + 1}`;
    answer.id = answerId;
    answer.hidden = true;
    button.setAttribute("aria-controls", answerId);
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");

        const otherButton = other.querySelector(".faq-question");
        const otherAnswer = other.querySelector(".faq-answer");
        const otherIcon = other.querySelector(".faq-icon");

        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.hidden = true;
        if (otherIcon) otherIcon.textContent = "+";
      });

      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
        icon.textContent = "–";
      }
    });
  });


  // CONTACT FORM
  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");

  if (form) {
    const formActions = form.querySelector(".form-actions");
    if (formActions && !form.querySelector(".form-privacy-note")) {
      const privacyNote = document.createElement("p");
      privacyNote.className = "form-privacy-note";
      privacyNote.innerHTML = 'Information submitted through this form is used to respond to your inquiry. <a href="privacy.html">Privacy Policy</a>.';
      formActions.insertAdjacentElement("afterend", privacyNote);
    }
  }

  if (form && status) {
    status.setAttribute("tabindex", "-1");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submit = form.querySelector('button[type="submit"]');
      const oldText = submit.textContent;

      submit.disabled = true;
      submit.textContent = "Sending…";
      status.classList.remove("show");
      status.textContent = "";

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
        status.focus();

      } catch (error) {
        status.textContent =
          "Something went wrong. Please try again or reach out through Instagram.";
        status.classList.add("show");
        status.focus();

      } finally {
        submit.disabled = false;
        submit.textContent = oldText;
      }
    });
  }

});
