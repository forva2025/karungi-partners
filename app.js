// Premium Law Firm Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initStatCounters();
    initTestimonialSlider();
    initContactForm();
    initHeaderScroll();
    initTypingEffect();
});

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-ctas a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const nav = document.getElementById('nav');
                    nav.classList.remove('nav-open');
                }
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('nav-open');
                mobileMenuBtn.classList.remove('active');
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('nav-open');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(`
        .about-content,
        .practice-card,
        .team-member,
        .testimonial,
        .contact-content,
        .cert-section
    `);
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Stagger animation for practice cards
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Stagger animation for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.animationDelay = `${index * 0.15}s`;
    });
}

// Statistics Counter Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (statNumbers.length > 0) {
        observer.observe(statNumbers[0].closest('.stats-grid'));
    }
    
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Handle percentage for client satisfaction
                if (stat.textContent.includes('%') || target === 95) {
                    stat.textContent = Math.ceil(current) + '%';
                } else if (target >= 100) {
                    stat.textContent = Math.ceil(current) + '+';
                } else {
                    stat.textContent = Math.ceil(current) + '+';
                }
            }, 20);
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    let currentSlide = 0;
    let slideInterval;
    
    if (testimonials.length === 0) return;
    
    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        testimonialBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % testimonials.length;
        showSlide(next);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Button click handlers
    testimonialBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        testimonialContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    const prev = currentSlide === 0 ? testimonials.length - 1 : currentSlide - 1;
                    showSlide(prev);
                }
                stopAutoSlide();
                startAutoSlide();
            }
        }
    }
    
    // Start auto-sliding
    startAutoSlide();
    
    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSection.addEventListener('mouseleave', startAutoSlide);
    }
}

// Contact Form Handling - Completely removed to prevent interference
function initContactForm() {
    // No JavaScript interference - let form submit naturally to FormSubmit
    // Form will redirect to thank-you.html after successful submission
}


// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Ensure the header remains visible and static (no hide on scroll)
    header.style.transform = 'none';

    // Remove any previously attached scroll behavior by setting a no-op listener
    window.addEventListener('scroll', () => {
        // Intentionally left blank to keep header static during scroll
    });
}

// Typing Effect for Hero
function initTypingEffect() {
    const heroTagline = document.querySelector('.hero-tagline');
    if (!heroTagline) return;
    
    const originalText = heroTagline.textContent;
    heroTagline.textContent = '';
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < originalText.length) {
            heroTagline.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 50);
        }
    }
    
    // Start typing effect after hero title animation
    setTimeout(typeChar, 1500);
}

// Utility Functions
function debounce(func, wait) {
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

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(function() {
    // Handle any scroll-based operations here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Intersection Observer for performance
function createObserver(callback, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Add CSS for additional animations
const additionalStyles = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }
    
    .form-group.focused .form-label {
        color: var(--law-gold);
    }
    
    .nav-open {
        display: block !important;
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 999;
        padding: 2rem;
    }
    
    .nav-open .nav-list {
        flex-direction: column;
        gap: 1rem;
    }
    
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize smooth scrolling for the entire page
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// Handle resize events with comprehensive responsive behavior
window.addEventListener('resize', debounce(function() {
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        if (nav) nav.classList.remove('nav-open');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
    
    // Recalculate hero height for mobile devices
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth <= 768) {
        hero.style.height = window.innerHeight + 'px';
    }
    
    // Adjust testimonial container for mobile
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer && window.innerWidth <= 480) {
        testimonialContainer.style.maxWidth = '100%';
    }
    
    // Recalculate grid layouts
    recalculateGridLayouts();
}, 250));

// Function to recalculate grid layouts based on screen size
function recalculateGridLayouts() {
    const practiceGrid = document.querySelector('.practice-grid');
    const teamGrid = document.querySelector('.team-grid');
    const statsGrid = document.querySelector('.stats-grid');
    
    if (window.innerWidth <= 480) {
        // Single column for very small screens
        if (practiceGrid) practiceGrid.style.gridTemplateColumns = '1fr';
        if (teamGrid) teamGrid.style.gridTemplateColumns = '1fr';
        if (statsGrid) statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (window.innerWidth <= 768) {
        // Single column for mobile
        if (practiceGrid) practiceGrid.style.gridTemplateColumns = '1fr';
        if (teamGrid) teamGrid.style.gridTemplateColumns = '1fr';
        if (statsGrid) statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (window.innerWidth <= 1024) {
        // Two columns for tablet
        if (practiceGrid) practiceGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        if (teamGrid) teamGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        if (statsGrid) statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        // Three or more columns for desktop
        if (practiceGrid) practiceGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        if (teamGrid) teamGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        if (statsGrid) statsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
}

// Add accessibility improvements
function initAccessibility() {
    // Add keyboard navigation for testimonial slider
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    testimonialBtns.forEach((btn, index) => {
        btn.setAttribute('aria-label', `View testimonial ${index + 1}`);
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    
    // Add focus management for mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = nav.classList.contains('nav-open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });
    }
}

// Initialize accessibility features
initAccessibility();

// Enhanced mobile touch support
function initMobileTouchSupport() {
    // Add touch support for mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });
    }
    
    // Add touch support for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', function(e) {
            // Add visual feedback for touch
            this.style.transform = 'scale(0.95)';
        });
        
        link.addEventListener('touchend', function(e) {
            // Remove visual feedback
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add touch support for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Prevent zoom on double tap for buttons
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Initialize mobile touch support
initMobileTouchSupport();

// Viewport height fix for mobile browsers
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Force full width on mobile devices
function ensureFullWidth() {
    if (window.innerWidth <= 768) {
        // Force full width on mobile
        document.documentElement.style.width = '100%';
        document.body.style.width = '100%';
        document.body.style.maxWidth = '100%';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        // Ensure header takes full width
        const header = document.querySelector('.header');
        if (header) {
            header.style.width = '100%';
            header.style.left = '0';
            header.style.right = '0';
        }
        
        // Ensure container takes full width
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.width = '100%';
            container.style.maxWidth = '100%';
        });
    }
}

// Set viewport height on load and resize
window.addEventListener('load', function() {
    setViewportHeight();
    ensureFullWidth();
});

window.addEventListener('resize', debounce(function() {
    setViewportHeight();
    ensureFullWidth();
}, 100));

// Add CSS custom property for viewport height
const viewportHeightStyle = `
    :root {
        --vh: 1vh;
    }
    
    .hero {
        height: calc(var(--vh, 1vh) * 100);
    }
    
    @media (max-width: 768px) {
        .hero {
            height: calc(var(--vh, 1vh) * 100);
            min-height: 400px;
        }
    }
`;

// Inject viewport height styles
const viewportStyleSheet = document.createElement('style');
viewportStyleSheet.textContent = viewportHeightStyle;
document.head.appendChild(viewportStyleSheet);