
document.addEventListener("DOMContentLoaded", () => {
    // Load icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Mobile navigation
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';

        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });

    // Highlight the section currently on screen
    const sections = document.querySelectorAll("main section[id]");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navItems.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    }, {
        rootMargin: "-25% 0px -60% 0px"
    });

    sections.forEach((section) => observer.observe(section));

    // Current year in footer
    document.getElementById("year").textContent =
        new Date().getFullYear();

    // Contact form -> Flask backend
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.classList.remove("error");

        const formData = new FormData(contactForm);

        const payload = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            subject: formData.get("subject").trim(),
            message: formData.get("message").trim()
        };

        if (!payload.name || !payload.email ||
            !payload.subject || !payload.message) {
            formStatus.textContent = "Please fill in all fields.";
            formStatus.classList.add("error");
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = "Sending message...";

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Unable to send message.");
            }

            formStatus.textContent = result.message;
            contactForm.reset();
        } catch (error) {
            formStatus.textContent =
                error.message === "Failed to fetch"
                    ? "Server unavailable. Start the Flask application and try again."
                    : error.message;

            formStatus.classList.add("error");
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML =
                'Send Message <i data-lucide="arrow-up-right"></i>';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    });
});
