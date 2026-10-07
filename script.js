// ================= SCROLL STATE =================

const scrollProgress = document.querySelector(".scroll-progress");
const sections = [...document.querySelectorAll("main > section, footer")];
const navLinks = [...document.querySelectorAll(".nav-links a")];
let scrollUpdatePending = false;

function updateScrollState() {
    if (scrollUpdatePending) {
        return;
    }

    scrollUpdatePending = true;
    requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        let currentSection = "";
        sections.forEach((section) => {
            const activationOffset = section.tagName === "FOOTER"
                ? window.innerHeight
                : 200;

            if (window.scrollY >= section.offsetTop - activationOffset) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.style.color = link.getAttribute("href") === `#${currentSection}`
                ? "#b11226"
                : "#f5f5f5";
        });

        scrollUpdatePending = false;
    });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

// ================= SMOOTH SCROLL ANIMATIONS =================

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add animation delay based on element index
            entry.target.style.animationDelay = `${index * 0.1}s`;
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document
    .querySelectorAll(".about-card, .skill-pill, .project-card")
    .forEach((el) => {
        el.classList.add("fade-up");
        observer.observe(el);
    });

// ================= SMOOTH NAVIGATION SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// ================= HERO SECTION ANIMATIONS =================

const heroLeft = document.querySelector(".hero-left");
const heroRight = document.querySelector(".hero-right");

if (heroLeft && heroRight) {
    heroLeft.style.animation = "slideInLeft 0.8s ease-out";
    heroRight.style.animation = "slideInRight 0.8s ease-out";
}

// ================= STAGGERED ANIMATIONS FOR SKILL PILLS =================

const skillPills = document.querySelectorAll(".skill-pill");
skillPills.forEach((pill, index) => {
    pill.style.opacity = "0";
    pill.style.animation = `fadeUp 0.6s ease-out ${index * 0.08}s forwards`;
});

// ================= STAGGERED ANIMATIONS FOR ABOUT CARDS =================

const aboutCards = document.querySelectorAll(".about-card");
aboutCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.animation = `fadeUp 0.6s ease-out ${0.2 + index * 0.15}s forwards`;
});

// ================= STAGGERED ANIMATIONS FOR PROJECT CARDS =================

const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.animation = `fadeUp 0.6s ease-out ${0.2 + index * 0.15}s forwards`;
});

const EMAILJS_CONFIG = Object.freeze({
    // Replace these placeholders with values from your EmailJS dashboard.
    PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",
    SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",
    TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID",
    DESTINATION_EMAIL: "harshgaikwad0517@gmail.com",
});

const directMessageForm = document.getElementById("directMessageForm");
const contactFormStatus = document.getElementById("contactFormStatus");
const emailJsIsConfigured = Object.values(EMAILJS_CONFIG)
    .slice(0, 3)
    .every((value) => value && !value.startsWith("YOUR_EMAILJS_"));

if (emailJsIsConfigured && window.emailjs) {
    window.emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
}

if (directMessageForm && contactFormStatus) {
    directMessageForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!directMessageForm.checkValidity()) {
            directMessageForm.reportValidity();
            return;
        }

        const submitButton = directMessageForm.querySelector(".direct-message-submit");

        if (!emailJsIsConfigured || !window.emailjs) {
            contactFormStatus.className = "form-status error";
            contactFormStatus.textContent = "EmailJS is not configured yet. Add your Public Key, Service ID, and Template ID in script.js.";
            return;
        }

        const formData = new FormData(directMessageForm);
        const templateParams = {
            name: formData.get("name"),
            email: formData.get("email"),
            reply_to: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            to_email: EMAILJS_CONFIG.DESTINATION_EMAIL,
        };

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        contactFormStatus.className = "form-status";
        contactFormStatus.textContent = "Sending your message...";

        try {
            await window.emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
            );

            directMessageForm.reset();
            contactFormStatus.className = "form-status success";
            contactFormStatus.textContent = "Message sent successfully! I'll get back to you soon.";
        } catch (error) {
            contactFormStatus.className = "form-status error";
            contactFormStatus.textContent = "Something went wrong. Please try again or contact me directly by email.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }
    });
}

// ================= PARALLAX EFFECT ON MOUSE MOVE =================
// Disabled - user preference

// ================= ADD CSS CLASSES FOR ANIMATIONS =================

const style = document.createElement("style");
style.textContent = `
    .fade-up {
        opacity: 0;
        transform: translateY(40px);
    }
    
    .animate-in {
        animation: fadeUp 0.6s ease-out forwards;
    }
    
    .project-card h3 {
        position: relative;
        z-index: 2;
    }
    
    .project-card p {
        position: relative;
        z-index: 2;
    }
`;
document.head.appendChild(style);

// ================= PAGE LOAD ANIMATION =================

window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});
