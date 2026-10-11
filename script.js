/**
 * TERMINAL NOIR — CINEMATIC MOTION SYSTEM & APPLICATION ENGINE
 * Portfolio of Harsh Gaikwad — Backend-Focused Full Stack Developer
 * Pinned Versions: GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.13
 */

"use strict";

/* ==========================================================================
   1. EMAILJS CONFIGURATION (Replace placeholders for production)
   ========================================================================== */
const EMAILJS_CONFIG = Object.freeze({
    PUBLIC_KEY: "bHrvyVJBTfA6e3JWa",        // e.g. "user_xxxxxxxxxxxx"
    SERVICE_ID: "service_yhk092r",        // e.g. "service_xxxxxxx"
    TEMPLATE_ID: "template_aamjglt",      // e.g. "template_xxxxxxx"
    DESTINATION_EMAIL: "harshgaikwad0517@gmail.com",
});

/* ==========================================================================
   2. GLOBAL STATE & FEATURE DETECTION
   ========================================================================== */
const STATE = {
    lenis: null,
    isReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    isFinePointer: window.matchMedia("(pointer: fine)").matches,
    isMobile: window.innerWidth <= 768,
    isLoaded: false,
    lastScrollY: 0,
};

/* ==========================================================================
   3. PRELOADER & HERO ENTRANCE ORCHESTRATION
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById("preloader");
    const preloaderBar = document.getElementById("preloaderBar");
    const preloaderPercent = document.getElementById("preloaderPercent");
    const preloaderCurtain = document.getElementById("preloaderCurtain");
    const lines = preloader ? preloader.querySelectorAll(".preloader-line") : [];

    function finishPreloader() {
        if (STATE.isLoaded) return;
        STATE.isLoaded = true;

        if (preloaderBar) preloaderBar.style.width = "100%";
        if (preloaderPercent) preloaderPercent.textContent = "100%";

        if (preloaderCurtain) {
            preloaderCurtain.style.transform = "scaleY(0)";
        }

        setTimeout(() => {
            if (preloader) {
                preloader.classList.add("loaded");
                preloader.style.display = "none";
            }
            triggerHeroReveal();
        }, 300);
    }

    // Immediately skip preloader if user opened with hash, query param, or reduced motion
    if (!preloader || STATE.isReducedMotion || window.location.hash || window.location.search) {
        if (preloader) {
            preloader.classList.add("loaded");
            preloader.style.display = "none";
        }
        document.body.classList.remove("no-js");
        STATE.isLoaded = true;
        triggerHeroReveal();
        return;
    }

    // Allow user to click or press any key to skip preloader immediately
    preloader.addEventListener("click", finishPreloader);
    document.addEventListener("keydown", finishPreloader, { once: true });

    // Stagger terminal lines reveal
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add("visible");
        }, index * 150 + 50);
    });

    let percent = 0;
    const progressInterval = setInterval(() => {
        if (STATE.isLoaded) {
            clearInterval(progressInterval);
            return;
        }
        percent += 4;
        if (percent >= 100) {
            percent = 100;
            clearInterval(progressInterval);
            finishPreloader();
        }
        if (preloaderBar) preloaderBar.style.width = `${percent}%`;
        if (preloaderPercent) preloaderPercent.textContent = `${percent}%`;
    }, 35);

    // Guaranteed fallback after 1.2s
    setTimeout(finishPreloader, 1200);
}

function triggerHeroReveal() {
    if (typeof gsap === "undefined" || STATE.isReducedMotion) return;

    const heroTimeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        }
    });

    heroTimeline
        .from(".hero-eyebrow-wrapper", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.1,
        })
        .from(".hero-role-tag", {
            opacity: 0,
            y: 15,
            duration: 0.6,
        }, "-=0.5")
        .from(".hero-line-inner", {
            y: "110%",
            duration: 1.1,
            stagger: 0.12,
        }, "-=0.4")
        .from(".hero-description", {
            opacity: 0,
            y: 20,
            duration: 0.9,
        }, "-=0.6")
        .from(".hero-cta-group .btn", {
            opacity: 0,
            y: 25,
            duration: 0.7,
            stagger: 0.1,
        }, "-=0.6")
        .from(".hero-quick-meta", {
            opacity: 0,
            y: 15,
            duration: 0.6,
        }, "-=0.4")
        .from(".profile-card-3d", {
            opacity: 0,
            scale: 0.94,
            rotationY: -15,
            duration: 1.2,
        }, "-=1.0")
        .from(".hero-terminal", {
            opacity: 0,
            y: 25,
            duration: 0.8,
        }, "-=0.6")
        .from(".floating-chip", {
            opacity: 0,
            y: 15,
            scale: 0.8,
            duration: 0.8,
            stagger: 0.15,
        }, "-=0.7")
        .from(".scroll-indicator", {
            opacity: 0,
            duration: 0.8,
        }, "-=0.4");
}

/* ==========================================================================
   4. LENIS SMOOTH SCROLLING & GSAP SCROLLTRIGGER SYNC
   ========================================================================== */
function initSmoothScroll() {
    if (typeof Lenis !== "undefined" && !STATE.isReducedMotion) {
        STATE.lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
        });

        // Sync with GSAP ScrollTrigger if loaded
        if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
            STATE.lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => {
                STATE.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                STATE.lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Handle initial hash navigation
        if (window.location.hash) {
            const initialTarget = document.querySelector(window.location.hash);
            if (initialTarget) {
                setTimeout(() => {
                    STATE.lenis.scrollTo(initialTarget, { offset: -70, immediate: true });
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.refresh();
                    }
                }, 100);
            }
        }
    }

    // Anchor Navigation with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                closeMobileMenu();

                if (STATE.lenis) {
                    STATE.lenis.scrollTo(target, { offset: -70 });
                } else {
                    target.scrollIntoView({ behavior: "smooth" });
                }

                // Update URL hash without browser jump
                if (history.pushState) {
                    history.pushState(null, "", href);
                } else {
                    window.location.hash = href;
                }
            }
        });
    });
}

/* ==========================================================================
   5. NAVBAR SCROLL PROGRESS & HIDE/SHOW ON SCROLL
   ========================================================================== */
function initNavbar() {
    const navbarWrapper = document.getElementById("navbarWrapper");
    const navbar = document.getElementById("navbar");
    const progressBar = document.getElementById("scrollProgressBar");
    const navLinks = document.querySelectorAll(".nav-links .nav-link");
    const sections = document.querySelectorAll("main > section, footer");
    const threshold = 15;

    function handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Add scrolled background blur class
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add("navbar-scrolled");
            } else {
                navbar.classList.remove("navbar-scrolled");
            }
        }

        // Hide on scroll down, show on scroll up
        if (navbarWrapper) {
            if (scrollY > 120 && scrollY > STATE.lastScrollY + threshold) {
                navbarWrapper.classList.add("nav-hidden");
            } else if (scrollY < STATE.lastScrollY - threshold || scrollY <= 120) {
                navbarWrapper.classList.remove("nav-hidden");
            }
        }

        STATE.lastScrollY = scrollY;

        // Active Section Spy via class toggling (No inline styles!)
        let currentSectionId = "";
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                currentSectionId = section.id;
            }
        });

        if (currentSectionId) {
            navLinks.forEach((link) => {
                const targetId = link.getAttribute("href")?.replace("#", "");
                if (targetId === currentSectionId) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("mobileMenuBackdrop");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    if (!hamburgerBtn || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.add("open");
        hamburgerBtn.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (STATE.lenis) STATE.lenis.stop();
    }

    window.closeMobileMenu = function () {
        mobileMenu.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (STATE.lenis) STATE.lenis.start();
    };

    hamburgerBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("open");
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMenu();
        }
    });

    if (backdrop) {
        backdrop.addEventListener("click", closeMobileMenu);
    }

    // Close on link click
    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
            closeMobileMenu();
            hamburgerBtn.focus();
        }
    });
}

/* ==========================================================================
   7. CUSTOM CURSOR (FINE POINTERS ONLY)
   ========================================================================== */
function initCustomCursor() {
    if (!STATE.isFinePointer || STATE.isReducedMotion) return;

    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const label = document.getElementById("cursorLabel");
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth lerp loop for the trailing ring
    function renderCursor() {
        const ease = 0.18;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;

        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, [data-spotlight]");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            ring.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            ring.classList.remove("cursor-hover");
        });
    });

    // Project Cards "VIEW" Hover State
    const projectCards = document.querySelectorAll(".project-card-noir, .project-view-trigger");
    projectCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            ring.classList.add("cursor-view");
            if (label) label.textContent = "VIEW";
        });
        card.addEventListener("mouseleave", () => {
            ring.classList.remove("cursor-view");
            if (label) label.textContent = "";
        });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
    });
}

/* ==========================================================================
   8. SPOTLIGHT BORDER EFFECT ON CARDS
   ========================================================================== */
function initSpotlightBorders() {
    const cards = document.querySelectorAll("[data-spotlight]");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }, { passive: true });
    });
}

/* ==========================================================================
   9. 3D TILT EFFECT ON CARDS & PROFILE
   ========================================================================== */
function init3DTilt() {
    if (STATE.isReducedMotion || !STATE.isFinePointer) return;

    const tiltElements = document.querySelectorAll("#profileCard3D, [data-tilt]");

    tiltElements.forEach((el) => {
        const inner = el.querySelector(".profile-card-inner") || el;

        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const rotateX = ((mouseY - height / 2) / height) * -12;
            const rotateY = ((mouseX - width / 2) / width) * 12;

            inner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        }, { passive: true });

        el.addEventListener("mouseleave", () => {
            inner.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });
}

/* ==========================================================================
   10. MAGNETIC BUTTON EFFECT
   ========================================================================== */
function initMagneticButtons() {
    if (STATE.isReducedMotion || !STATE.isFinePointer) return;

    const magneticBtns = document.querySelectorAll(".magnetic-btn");

    magneticBtns.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate3d(${x * 0.24}px, ${y * 0.24}px, 0)`;
        }, { passive: true });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate3d(0px, 0px, 0px)";
        });
    });
}

/* ==========================================================================
   11. STATS COUNT-UP WITH SCROLLTRIGGER
   ========================================================================== */
function initStatsCounter() {
    const statsRow = document.getElementById("statsRow");
    if (!statsRow) return;

    const statNumbers = statsRow.querySelectorAll(".stat-number");

    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined" && !STATE.isReducedMotion) {
        ScrollTrigger.create({
            trigger: statsRow,
            start: "top 85%",
            once: true,
            onEnter: () => {
                statNumbers.forEach((item) => {
                    const target = parseInt(item.getAttribute("data-target"), 10);
                    const suffix = item.getAttribute("data-suffix") || "";
                    const counterObj = { count: 0 };

                    gsap.to(counterObj, {
                        count: target,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            item.textContent = `${Math.floor(counterObj.count)}${suffix}`;
                        },
                    });
                });
            },
        });
    } else {
        // Fallback immediate reveal
        statNumbers.forEach((item) => {
            const target = item.getAttribute("data-target");
            const suffix = item.getAttribute("data-suffix") || "";
            item.textContent = `${target}${suffix}`;
        });
    }
}

/* ==========================================================================
   12. TIMELINE SCROLL PROGRESSION
   ========================================================================== */
function initTimelineProgress() {
    const timeline = document.querySelector(".timeline-wrapper");
    const progressLine = document.getElementById("timelineProgress");

    if (!timeline || !progressLine) return;

    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined" && !STATE.isReducedMotion) {
        gsap.to(progressLine, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: timeline,
                start: "top 70%",
                end: "bottom 80%",
                scrub: 0.5,
            },
        });

        // Stagger in timeline nodes
        gsap.from(".timeline-item", {
            opacity: 0,
            x: -25,
            duration: 0.8,
            stagger: 0.25,
            ease: "power3.out",
            scrollTrigger: {
                trigger: timeline,
                start: "top 75%",
            },
        });
    } else {
        progressLine.style.height = "100%";
    }
}

/* ==========================================================================
   13. TECH STACK BENTO ANIMATION & PINNED PROJECTS
   ========================================================================== */
function initScrollAnimations() {
    if (typeof ScrollTrigger === "undefined" || typeof gsap === "undefined" || STATE.isReducedMotion) {
        if (typeof gsap !== "undefined") {
            gsap.set(".section-header, .bento-block, .project-card-noir, .about-card, .timeline-item", {
                opacity: 1,
                y: 0,
                clearProps: "all"
            });
        }
        return;
    }

    ScrollTrigger.config({ limitCallbacks: true });

    // Section headers
    gsap.utils.toArray(".section-header").forEach((header) => {
        gsap.fromTo(header, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                    trigger: header,
                    start: "top 92%",
                    once: true,
                },
            }
        );
    });

    // Tech Stack Bento blocks stagger in sequence
    gsap.utils.toArray(".bento-block").forEach((block, index) => {
        gsap.fromTo(block,
            { opacity: 0, y: 35 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: (index % 3) * 0.08,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                    trigger: block,
                    start: "top 92%",
                    once: true,
                },
            }
        );
    });

    // Project Cards reveal
    gsap.utils.toArray(".project-card-noir").forEach((card) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    });

    // About cards reveal
    gsap.utils.toArray(".about-card").forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.75,
                delay: index * 0.1,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: "top 92%",
                    once: true,
                },
            }
        );
    });

    ScrollTrigger.refresh();
}

/* ==========================================================================
   14. LIVE TERMINAL TYPEWRITER
   ========================================================================== */
function initTypewriter() {
    const target = document.getElementById("typewriterTarget");
    if (!target) return;

    const commands = [
        "git status // working tree clean",
        "cat /skills/backend | grep -E 'python|node|api'",
        "pytest --verbose // 100% tests passed",
        "curl -i -X POST /api/v1/auth/login",
        "npm run build // 0 errors, ready to deploy",
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTime = 1800;

    function typeLoop() {
        const currentCmd = commands[cmdIndex];

        if (isDeleting) {
            target.textContent = currentCmd.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = currentCmd.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 65;

        if (!isDeleting && charIndex === currentCmd.length) {
            typeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            typeSpeed = 400;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 1200);
}

/* ==========================================================================
   15. DIRECT MESSAGE FORM WITH EMAILJS INTEGRATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("directMessageForm");
    const statusEl = document.getElementById("contactFormStatus");
    const submitBtn = document.getElementById("contactSubmitBtn");

    if (!form || !statusEl || !submitBtn) return;

    // Verify EmailJS configuration
    const emailJsConfigured = Object.values(EMAILJS_CONFIG)
        .slice(0, 3)
        .every((val) => val && !val.startsWith("YOUR_EMAILJS_"));

    if (emailJsConfigured && window.emailjs) {
        window.emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    }

    // Inline field validation helpers
    const fields = {
        name: {
            el: document.getElementById("contact-name"),
            error: document.getElementById("nameError"),
            validate: (val) => val.trim().length >= 2 || "Name must be at least 2 characters.",
        },
        email: {
            el: document.getElementById("contact-email"),
            error: document.getElementById("emailError"),
            validate: (val) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(val.trim()) || "Please enter a valid email address.";
            },
        },
        subject: {
            el: document.getElementById("contact-subject"),
            error: document.getElementById("subjectError"),
            validate: (val) => val.trim().length >= 3 || "Subject must be at least 3 characters.",
        },
        message: {
            el: document.getElementById("contact-message"),
            error: document.getElementById("messageError"),
            validate: (val) => val.trim().length >= 10 || "Message must be at least 10 characters.",
        },
    };

    // Live validation on blur
    Object.values(fields).forEach(({ el, error, validate }) => {
        if (!el || !error) return;

        el.addEventListener("blur", () => {
            const result = validate(el.value);
            if (result !== true && el.value.length > 0) {
                el.classList.add("is-invalid");
                error.textContent = result;
            } else {
                el.classList.remove("is-invalid");
                error.textContent = "";
            }
        });

        el.addEventListener("input", () => {
            if (el.classList.contains("is-invalid")) {
                const result = validate(el.value);
                if (result === true) {
                    el.classList.remove("is-invalid");
                    error.textContent = "";
                }
            }
        });
    });

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        Object.values(fields).forEach(({ el, error, validate }) => {
            if (!el || !error) return;
            const result = validate(el.value);
            if (result !== true) {
                el.classList.add("is-invalid");
                error.textContent = result;
                isValid = false;
            } else {
                el.classList.remove("is-invalid");
                error.textContent = "";
            }
        });

        if (!isValid) return;

        // Check EmailJS Credentials
        if (!emailJsConfigured || !window.emailjs) {
            statusEl.className = "form-status-alert error visible";
            statusEl.textContent = "EmailJS is not configured yet. Add your Public Key, Service ID, and Template ID in script.js.";
            return;
        }

        const formData = new FormData(form);
        const templateParams = {
            name: formData.get("name"),
            email: formData.get("email"),
            reply_to: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            to_email: EMAILJS_CONFIG.DESTINATION_EMAIL,
        };

        // UI Loading State
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.querySelector(".btn-text").textContent;
        submitBtn.querySelector(".btn-text").textContent = "Transmitting...";

        statusEl.className = "form-status-alert visible";
        statusEl.textContent = "Sending your message to server...";

        try {
            await window.emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            );

            form.reset();
            statusEl.className = "form-status-alert success visible";
            statusEl.textContent = "Message transmitted successfully! I will respond promptly.";
        } catch (error) {
            statusEl.className = "form-status-alert error visible";
            statusEl.textContent = "Transmission failed. Please reach out directly to harshgaikwad0517@gmail.com.";
        } finally {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
            submitBtn.querySelector(".btn-text").textContent = originalBtnText;
        }
    });
}

/* ==========================================================================
   16. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener("click", () => {
        if (STATE.lenis) {
            STATE.lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
}

/* ==========================================================================
   17. TAB VISIBILITY PERFORMANCE OPTIMIZATION
   ========================================================================== */
function initTabVisibility() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (STATE.lenis) STATE.lenis.stop();
        } else {
            if (STATE.lenis) STATE.lenis.start();
        }
    });
}

/* ==========================================================================
   18. APPLICATION INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initCustomCursor();
    initSpotlightBorders();
    init3DTilt();
    initMagneticButtons();
    initStatsCounter();
    initTimelineProgress();
    initScrollAnimations();
    initTypewriter();
    initContactForm();
    initBackToTop();
    initTabVisibility();

    // Support direct query param navigation: ?scroll=projects etc.
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTargetId = urlParams.get("scroll");
    if (scrollTargetId) {
        const targetEl = document.getElementById(scrollTargetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: "instant", block: "start" });
            if (typeof gsap !== "undefined") {
                gsap.set(targetEl.querySelectorAll(".bento-block, .project-card-noir, .section-header, .spotlight-card, .timeline-item"), {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    clearProps: "transform,opacity"
                });
            }
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        }
    }
});
