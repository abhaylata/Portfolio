// Portfolio Website JavaScript - React-like functionality

class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.isMenuOpen = false;
        this.isSidebarOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupAnimations();
        this.setupFormHandling();
        this.setupModalHandling();
        this.updateActiveNavigation();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link, .sidebar-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Sidebar hover effects
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.addEventListener('mouseenter', () => this.expandSidebar());
            sidebar.addEventListener('mouseleave', () => this.collapseSidebar());
        }

        // Smooth scrolling for hero buttons
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Window scroll listener
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Window resize listener
        window.addEventListener('resize', () => this.handleResize());

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateActiveNavigation();
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupAnimations() {
        const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-content');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.classList.add('fade-in');
            animationObserver.observe(element);
        });
    }

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Real-time form validation
        const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupModalHandling() {
        const modal = document.getElementById('successModal');
        const modalClose = document.querySelector('.modal-close');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (this.isMenuOpen) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        const overlay = document.querySelector('.mobile-menu-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    expandSidebar() {
        this.isSidebarOpen = true;
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.add('expanded');
    }

    collapseSidebar() {
        this.isSidebarOpen = false;
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('expanded');
    }

    handleNavigation(e) {
        const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = href.substring(1);
            this.scrollToSection(targetSection);
            this.closeMobileMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavigation() {
        // Update sidebar links
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });

        // Update dropdown links
        const dropdownLinks = document.querySelectorAll('.dropdown-content .nav-link');
        dropdownLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        this.removeFieldError(field);
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate all fields
        const fields = form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormError('Please fix the errors above before submitting.');
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Simulate form submission (since we can't create actual backend)
            await this.simulateFormSubmission(formData);
            
            // Show success modal
            this.showSuccessModal();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('There was an error sending your message. Please try again.');
        } finally {
            this.setFormLoading(false);
        }
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate successful submission
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    resolve({
                        success: true,
                        message: 'Message sent successfully!'
                    });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    setFormLoading(isLoading) {
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showFormError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        const form = document.getElementById('contactForm');
        form.insertBefore(errorElement, form.firstChild);
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Utility methods
    debounce(func, wait) {
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

    // Component-like methods for dynamic content
    createSkillTag(skill) {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        return tag;
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        card.innerHTML = `
            <div class="project-image">
                <i class="fas fa-${project.icon || 'code'}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        return card;
    }

    // Initialize typing animation for hero section
    initTypingAnimation() {
        const subtitleElement = document.querySelector('.hero-subtitle');
        if (subtitleElement) {
            const text = subtitleElement.textContent;
            subtitleElement.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    subtitleElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing animation after page load
            setTimeout(typeWriter, 1000);
        }
    }

    // Smooth reveal animations
    revealElements() {
        const elements = document.querySelectorAll('.fade-in:not(.visible)');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Initialize particle background (optional enhancement)
    initParticleBackground() {
        // This would create a subtle particle effect in the hero section
        // Implementation would depend on requirements
    }
}

// CSS for form validation and error states
const additionalStyles = `
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }

    .field-error {
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-4);
    }

    .field-error::before {
        content: "⚠";
        font-size: var(--font-size-sm);
    }

    .form-error {
        background: rgba(var(--color-error-rgb), 0.1);
        border: 1px solid var(--color-error);
        color: var(--color-error);
        padding: var(--space-12);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        display: flex;
        align-items: center;
        gap: var(--space-8);
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .header.scrolled {
        background: rgba(var(--color-surface), 0.98);
        box-shadow: var(--shadow-sm);
    }

    .sidebar.expanded {
        box-shadow: var(--shadow-lg);
    }

    /* Loading spinner animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .fa-spinner {
        animation: spin 1s linear infinite;
    }

    /* Smooth transitions for all interactive elements */
    .btn, .nav-link, .sidebar-link, .project-card, .skill-tag {
        transition: all var(--duration-fast) var(--ease-standard);
    }

    /* Focus styles for accessibility */
    .btn:focus-visible,
    .form-control:focus,
    .nav-link:focus,
    .sidebar-link:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Initialize typing animation
    setTimeout(() => {
        app.initTypingAnimation();
    }, 500);
    
    // Initialize reveal animations on scroll
    window.addEventListener('scroll', app.debounce(() => {
        app.revealElements();
    }, 100));
    
    // Initial reveal check
    app.revealElements();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}