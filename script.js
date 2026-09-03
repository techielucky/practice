// ==========================================
// NEXUS.AI PORTFOLIO - CYBERPUNK EDITION
// Advanced JavaScript Module
// ==========================================

/**
 * Portfolio Application - Main Controller
 * Handles animations, interactions, and user engagement
 *Handle tasks
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const CONFIG = {
    animationDuration: 600,
    scrollThreshold: 0.1,
    scrollDelay: 300,
    glowDuration: 2000,
    particleCount: 50,
    debugMode: false
};

const COLORS = {
    neonGreen: '#00ff9f',
    neonPink: '#ff006e',
    darkBg: '#0a0e27',
    lightPurple: '#8338ec'
};

const SELECTORS = {
    header: 'header',
    nav: 'nav a',
    scrollBtn: '#scrollToTop',
    contactForm: '#contactForm',
    sections: 'section',
    projectCards: '.project-card',
    skillCategories: '.skill-category',
    timelineItems: '.timeline-item',
    observeElements: 'section h2, .project-card, .skill-category, .timeline-item'
};

// ==========================================
// 2. INTERSECTION OBSERVER - SCROLL ANIMATIONS
// ==========================================

class ScrollAnimationController {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.scrollThreshold,
            rootMargin: '0px 0px -100px 0px'
        };
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
    }

    init() {
        document.querySelectorAll(SELECTORS.observeElements).forEach(el => {
            this.observer.observe(el);
        });
        this.logDebug('ScrollAnimationController initialized');
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                this.observer.unobserve(entry.target);
            }
        });
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[ScrollAnimation] ${message}`);
        }
    }

    destroy() {
        this.observer.disconnect();
    }
}

// ==========================================
// 3. HEADER SCROLL MANAGER
// ==========================================

class HeaderScrollManager {
    constructor() {
        this.header = document.querySelector(SELECTORS.header);
        this.scrollThreshold = 50;
        this.isScrolled = false;
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.logDebug('HeaderScrollManager initialized');
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        const shouldBeScrolled = currentScroll > this.scrollThreshold;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.header.classList.toggle('scrolled', shouldBeScrolled);
        }
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[HeaderScroll] ${message}`);
        }
    }
}

// ==========================================
// 4. SCROLL TO TOP BUTTON CONTROLLER
// ==========================================

class ScrollToTopController {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.showThreshold = 300;
        this.isVisible = false;
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.button.addEventListener('click', this.scrollToTop.bind(this));
        this.logDebug('ScrollToTopController initialized');
    }

    handleScroll() {
        const shouldShow = window.pageYOffset > this.showThreshold;

        if (shouldShow !== this.isVisible) {
            this.isVisible = shouldShow;
            this.button.classList.toggle('show', shouldShow);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.addClickEffect();
    }

    addClickEffect() {
        this.button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 200);
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[ScrollToTop] ${message}`);
        }
    }
}

// ==========================================
// 5. FORM VALIDATION & SUBMISSION
// ==========================================

class FormController {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMsg = document.getElementById('successMessage');
        this.errorMsg = document.getElementById('errorMessage');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            message: document.getElementById('message')
        };
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.attachFieldListeners();
            this.logDebug('FormController initialized');
        }
    }

    attachFieldListeners() {
        Object.values(this.fields).forEach(field => {
            field.addEventListener('focus', this.handleFocus.bind(this));
            field.addEventListener('blur', this.handleBlur.bind(this));
            field.addEventListener('input', this.handleInput.bind(this));
        });
    }

    handleFocus(e) {
        e.target.style.boxShadow = `0 0 20px ${COLORS.neonGreen}, 0 0 40px ${COLORS.neonPink}`;
        this.logDebug(`Field focused: ${e.target.id}`);
    }

    handleBlur(e) {
        e.target.style.boxShadow = '';
    }

    handleInput(e) {
        // Real-time validation
        this.validateField(e.target);
    }

    validateField(field) {
        if (field.id === 'email') {
            const isValid = this.isValidEmail(field.value);
            field.style.borderColor = isValid || !field.value 
                ? COLORS.neonGreen 
                : COLORS.neonPink;
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.clearMessages();

        const validation = this.validate();
        if (!validation.isValid) {
            this.showError(validation.message);
            return;
        }

        this.showSuccess();
        this.form.reset();
        this.logDebug('Form submitted successfully');
    }

    validate() {
        const { name, email, message } = this.fields;

        if (!name.value.trim()) {
            return { isValid: false, message: '// ERROR: OPERATIVE IDENTIFIER REQUIRED //' };
        }

        if (!email.value.trim()) {
            return { isValid: false, message: '// ERROR: NEURAL ADDRESS REQUIRED //' };
        }

        if (!this.isValidEmail(email.value)) {
            return { isValid: false, message: '// ERROR: INVALID NEURAL ADDRESS //' };
        }

        if (!message.value.trim()) {
            return { isValid: false, message: '// ERROR: MESSAGE REQUIRED //' };
        }

        return { isValid: true };
    }

    showSuccess() {
        this.successMsg.textContent = '// TRANSMISSION SUCCESSFUL // Signal locked. Response incoming...';
        this.successMsg.style.display = 'block';
        this.successMsg.style.animation = 'fadeInUp 0.3s ease-out';

        setTimeout(() => {
            this.successMsg.style.display = 'none';
        }, 5000);
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.style.display = 'block';
        this.errorMsg.style.animation = 'fadeInUp 0.3s ease-out';
    }

    clearMessages() {
        this.successMsg.style.display = 'none';
        this.errorMsg.style.display = 'none';
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[Form] ${message}`);
        }
    }
}

// ==========================================
// 6. NAVIGATION CONTROLLER
// ==========================================

class NavigationController {
    constructor() {
        this.navLinks = document.querySelectorAll(SELECTORS.nav);
        this.activeLink = null;
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        window.addEventListener('scroll', this.updateActiveLink.bind(this));
        this.logDebug('NavigationController initialized');
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                this.setActiveLink(e.target);
            }
        }
    }

    setActiveLink(link) {
        if (this.activeLink) {
            this.activeLink.style.opacity = '1';
        }
        this.activeLink = link;
        this.activeLink.style.opacity = '0.7';
    }

    updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        this.navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                const target = document.querySelector(targetId);
                if (target) {
                    const { offsetTop, offsetHeight } = target;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        this.setActiveLink(link);
                    }
                }
            }
        });
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[Navigation] ${message}`);
        }
    }
}

// ==========================================
// 7. INTERACTIVE CARD EFFECTS
// ==========================================

class CardEffectsController {
    constructor() {
        this.cards = document.querySelectorAll(
            `${SELECTORS.projectCards}, ${SELECTORS.skillCategories}, ${SELECTORS.timelineItems}`
        );
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardEnter.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            card.addEventListener('mousemove', this.handleCardMove.bind(this));
        });
        this.logDebug('CardEffectsController initialized');
    }

    handleCardEnter(e) {
        const card = e.currentTarget;
        card.style.transition = 'all 0.3s ease';
        card.style.animation = 'cyberpulse 1s ease-in-out';
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.animation = 'none';
    }

    handleCardMove(e) {
        if (!e.currentTarget.classList.contains('project-card')) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[CardEffects] ${message}`);
        }
    }
}

// ==========================================
// 8. TEXT ANIMATION CONTROLLER
// ==========================================

class TextAnimationController {
    constructor() {
        this.titleWords = document.querySelectorAll('.title-word');
    }

    init() {
        window.addEventListener('load', this.animateTitleWords.bind(this));
        this.attachHoverEffects();
        this.logDebug('TextAnimationController initialized');
    }

    animateTitleWords() {
        this.titleWords.forEach((word, index) => {
            word.style.animationDelay = `${index * 0.1}s`;
        });
    }

    attachHoverEffects() {
        document.querySelectorAll('h1, h2, h3').forEach(heading => {
            heading.addEventListener('mouseenter', this.addGlowEffect.bind(this));
            heading.addEventListener('mouseleave', this.removeGlowEffect.bind(this));
        });
    }

    addGlowEffect(e) {
        e.target.style.textShadow = `0 0 20px ${COLORS.neonGreen}, 0 0 40px ${COLORS.neonPink}`;
    }

    removeGlowEffect(e) {
        e.target.style.textShadow = '';
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[TextAnimation] ${message}`);
        }
    }
}

// ==========================================
// 9. PARTICLE SYSTEM (BONUS EFFECT)
// ==========================================

class ParticleSystem {
    constructor(container) {
        this.container = container || document.body;
        this.particles = [];
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = COLORS.neonGreen;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 10px ${COLORS.neonGreen}`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';

        const velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };

        this.container.appendChild(particle);

        const animate = () => {
            x += velocity.x;
            y += velocity.y;
            velocity.y += 0.1; // gravity

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = particle.style.opacity - 0.02;

            if (parseFloat(particle.style.opacity) > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        particle.style.opacity = '1';
        animate();
    }

    burst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y);
        }
    }
}

// ==========================================
// 10. KEYBOARD SHORTCUTS
// ==========================================

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'KeyH': () => this.goToSection('#about'),
            'KeyP': () => this.goToSection('#projects'),
            'KeyS': () => this.goToSection('#skills'),
            'KeyC': () => this.goToSection('#contact'),
            'KeyT': () => this.toggleDebugMode()
        };
    }

    init() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.logDebug('KeyboardShortcuts initialized');
    }

    handleKeyDown(e) {
        if (e.ctrlKey && this.shortcuts[e.code]) {
            e.preventDefault();
            this.shortcuts[e.code]();
        }
    }

    goToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleDebugMode() {
        CONFIG.debugMode = !CONFIG.debugMode;
        console.log(`Debug mode: ${CONFIG.debugMode ? 'ON' : 'OFF'}`);
    }

    logDebug(message) {
        if (CONFIG.debugMode) {
            console.log(`[Keyboard] ${message}`);
        }
    }
}

// ==========================================
// 11. UTILS & HELPERS
// ==========================================

class Utilities {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    static getRandomColor() {
        const colors = [COLORS.neonGreen, COLORS.neonPink, COLORS.lightPurple];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static logInfo(message) {
        console.log(
            `%c[NEXUS.AI] ${message}`,
            'color: #00ff9f; font-weight: bold; text-shadow: 0 0 10px #ff006e;'
        );
    }
}

// ==========================================
// 12. MAIN APPLICATION CONTROLLER
// ==========================================

class PortfolioApp {
    constructor() {
        this.controllers = [];
        this.particleSystem = new ParticleSystem();
    }

    init() {
        Utilities.logInfo('Initializing NEXUS.AI Portfolio Application...');

        // Initialize all controllers
        this.setupControllers();
        this.attachEventListeners();
        this.setupAnalytics();

        Utilities.logInfo('Application initialized successfully');
    }

    setupControllers() {
        const scrollAnimation = new ScrollAnimationController();
        const headerScroll = new HeaderScrollManager();
        const scrollToTop = new ScrollToTopController();
        const form = new FormController();
        const navigation = new NavigationController();
        const cardEffects = new CardEffectsController();
        const textAnimation = new TextAnimationController();
        const keyboard = new KeyboardShortcuts();

        this.controllers = [
            scrollAnimation,
            headerScroll,
            scrollToTop,
            form,
            navigation,
            cardEffects,
            textAnimation,
            keyboard
        ];

        this.controllers.forEach(controller => controller.init());
    }

    attachEventListeners() {
        // Global click particle effect (optional - disable if too much)
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .cta-button, .contact-link')) {
                this.particleSystem.burst(e.clientX, e.clientY, 8);
            }
        });

        // Prevent accidental text selection
        document.addEventListener('selectstart', (e) => {
            if (e.target.closest('button, .cta-button')) {
                e.preventDefault();
            }
        });
    }

    setupAnalytics() {
        // Track page interactions
        const analyticsData = {
            sessionStart: new Date(),
            interactions: 0,
            scrollDepth: 0
        };

        document.addEventListener('click', () => {
            analyticsData.interactions++;
        });

    

        window.addEventListener('scroll', () => {
            analyticsData.scrollDepth = Math.max(
                analyticsData.scrollDepth,
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
        });

        // Log session info on page unload
        window.addEventListener('beforeunload', () => {
            if (CONFIG.debugMode) {
                console.log('Session Analytics:', analyticsData);
            }
        });
    }

    destroy() {
        this.controllers.forEach(controller => {
            if (controller.destroy) controller.destroy();
        });
        Utilities.logInfo('Application destroyed');
    }
}

// ==========================================
// 13. INITIALIZATION ROUTINE
// ==========================================

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();

    // Make app globally accessible for debugging
    window.portfolioApp = app;
});

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.destroy();
    }
});

// ==========================================
// 14. CONSOLE WELCOME MESSAGE
// ==========================================

console.log(
    `%c
╔═══════════════════════════════════════╗
║      NEXUS.AI PORTFOLIO SYSTEM        ║
║       Cyberpunk Edition v1.0          ║
║                                       ║
║  🤖 Neural Systems: ONLINE            ║
║  ⚡ Power Levels: MAXIMUM             ║
║  💾 Memory: SYNCHRONIZED              ║
║  🔐 Security: ENCRYPTED               ║
║                                       ║
║  Type: portfolioApp.destroy()         ║
║  to safely shutdown the system        ║
╚═══════════════════════════════════════╝
    `,
    'color: #00ff9f; font-weight: bold; text-shadow: 0 0 10px #ff006e;'
);
