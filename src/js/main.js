import '../css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Lenis from 'lenis';
import { initNetworkCanvas } from './network-canvas.js';
import { initFormWizard } from './form-wizard.js';

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
    // Defer heavy canvas to prioritize rendering user interface
    setTimeout(() => {
        initNetworkCanvas();
    }, 1000);

    initFormWizard();
    initNavbarScroll();
    initCounters();
    initWhatsAppFade();
    initMobileMenu();
});

// Mobile Menu Logic
function initMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-open');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');

    if (openBtn && closeBtn && menu) {
        openBtn.addEventListener('click', () => {
            menu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeBtn.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
}

// Global function to close menu (used by links)
window.closeMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    }
};

// Toggle Submenu logic
window.toggleMobileSubmenu = function () {
    const submenu = document.getElementById('nosotros-submenu');
    const arrow = document.getElementById('submenu-arrow');
    if (submenu) {
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            submenu.classList.add('flex');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
            submenu.classList.add('hidden');
            submenu.classList.remove('flex');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    }
};

// WhatsApp Fade on Collision Logic
function initWhatsAppFade() {
    const wa = document.getElementById('whatsapp-float');
    if (!wa) return;

    // Add transition style for smooth fade
    wa.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    const checkCollision = () => {
        // Only trigger on mobile/tablet (below md breakpoint usually 768px, but let's be safe up to 1024px or just checks overlap)
        if (window.innerWidth >= 1024) {
            wa.style.opacity = '1';
            wa.style.pointerEvents = 'auto';
            return;
        }

        const waRect = wa.getBoundingClientRect();
        // Select buttons, submit inputs, and elements looking like buttons
        const buttons = document.querySelectorAll('button, input[type="submit"], a[class*="btn"], a[class*="button"], [role="button"]');
        let collision = false;

        for (const btn of buttons) {
            // Ignore self, children, or hidden elements
            if (btn === wa || wa.contains(btn) || btn.offsetParent === null) continue;

            const btnRect = btn.getBoundingClientRect();

            // Check overlap
            const overlap = !(waRect.right < btnRect.left ||
                waRect.left > btnRect.right ||
                waRect.bottom < btnRect.top ||
                waRect.top > btnRect.bottom);

            if (overlap) {
                collision = true;
                break; // Found one collision, enough to fade
            }
        }

        if (collision) {
            wa.style.opacity = '0.15'; // Ghosted
            wa.style.pointerEvents = 'none'; // Passthrough click
        } else {
            wa.style.opacity = '1';
            wa.style.pointerEvents = 'auto';
        }
    };

    window.addEventListener('scroll', checkCollision, { passive: true });
    window.addEventListener('resize', checkCollision, { passive: true });
    // Initial check
    checkCollision();
}

// Preloader Dismissal
// Preloader Dismissal handled inline in HTML for performance

// Ticker Logic
function initTicker() {
    const clients = [
        "PASAREX", "MERCADO LIBRE", "DHL SUPPLY CHAIN", "COORDINADORA", "SERVIENTREGA",
        "AMAZON LOGISTICS", "ALKOSTO", "EXITO", "FALABELLA", "LINIO", "RAPPY CARGO"
    ];

    const tickerContainer = document.getElementById('ticker-content');
    if (!tickerContainer) return;

    // Duplicate content for seamless loop
    const clientString = clients.map(c => `<span class="mx-12 text-3xl font-bold text-white/30 hover:text-brand-primary transition-colors cursor-default">${c}</span>`).join('');
    tickerContainer.innerHTML = clientString + clientString + clientString + clientString;
}

// Navbar Scroll Logic
function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-brand-black/90', 'backdrop-blur-md', 'shadow-lg');
            nav.classList.remove('py-6', 'bg-transparent');
            nav.classList.add('py-4');
        } else {
            nav.classList.remove('bg-brand-black/90', 'backdrop-blur-md', 'shadow-lg', 'py-4');
            nav.classList.add('py-6', 'bg-transparent');
        }
    });
}

// Counters (Intersection Observer)
function initCounters() {
    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetAttrs = counter.getAttribute('data-target');
                if (!targetAttrs) return;

                const target = +targetAttrs;
                const duration = 2000;
                const increment = target / (duration / 16);

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (target === 98 ? '%' : '+');
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}
// Companies Form Logic
window.submitForm = function () {
    const terms = document.getElementById('terms-company');
    if (terms && !terms.checked) {
        alert('Por favor, acepta los Términos y Condiciones para continuar.');
        return;
    }

    const step2 = document.getElementById('step-2');
    const success = document.getElementById('step-success');

    if (step2 && success) {
        step2.classList.add('hidden', 'opacity-0');
        success.classList.remove('hidden');
        // Simple animation
        setTimeout(() => success.classList.add('animate-in'), 100);
    }
};

window.nextStep = function () {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');

    if (step1 && step2) {
        step1.classList.add('hidden', 'opacity-0');
        step1.classList.remove('block');

        step2.classList.remove('hidden', 'translate-x-10', 'opacity-0');

        // Update indicators
        step1Indicator.innerHTML = '<i class="fa-solid fa-check"></i>';
        step2Indicator.classList.remove('bg-white/10', 'text-gray-400');
        step2Indicator.classList.add('bg-brand-primary', 'text-black');
    }
};

window.prevStep = function () {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');

    if (step1 && step2) {
        step2.classList.add('hidden', 'translate-x-10', 'opacity-0');

        step1.classList.remove('hidden', 'opacity-0');
        step1.classList.add('block');

        // Update indicators
        step1Indicator.innerHTML = '1';
        step2Indicator.classList.add('bg-white/10', 'text-gray-400');
        step2Indicator.classList.remove('bg-brand-primary', 'text-black');
    }
};
