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

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                showFormSuccess();
                contactForm.reset();
            }
        });
        
        // Add focus effects to form controls
        const formControls = contactForm.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            control.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    function validateForm(data) {
        let isValid = true;
        
        // Remove previous error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Validate required fields
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'Please enter a valid name');
            isValid = false;
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            showFieldError('message', 'Please enter a message with at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4444';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        
        field.parentElement.appendChild(errorDiv);
        field.style.borderColor = '#ff4444';
        
        // Remove error styling on input
        field.addEventListener('input', function() {
            this.style.borderColor = '';
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
    
    function showFormSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div style="
                background: #4CAF50;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                animation: slideDown 0.3s ease-out;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
            </div>
        `;
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
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

// Handle resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate any size-dependent elements
    const nav = document.getElementById('nav');
    if (window.innerWidth > 768) {
        nav.classList.remove('nav-open');
        document.getElementById('mobile-menu-btn').classList.remove('active');
    }
}, 250));

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