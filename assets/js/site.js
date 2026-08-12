document.addEventListener("DOMContentLoaded", function () {

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    if (!button) return;

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");

      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove("open");

        const otherButton = otherItem.querySelector(".faq-question");
        const otherIcon = otherItem.querySelector(".faq-icon");

        if (otherButton) {
          otherButton.setAttribute("aria-expanded", "false");
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });

  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();

          if (status) {
            status.textContent =
              "Thank you. Your inquiry has been sent. I’ll be in touch soon.";
            status.classList.add("show");
          }
        } else {
          if (status) {
            status.textContent =
              "Something went wrong. Please try again.";
            status.classList.add("show");
          }
        }
      } catch (error) {
        if (status) {
          status.textContent =
            "Something went wrong. Please try again.";
          status.classList.add("show");
        }
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Inquiry";
      }
    });
  }

});
