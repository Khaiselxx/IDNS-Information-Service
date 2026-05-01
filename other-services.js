document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Other Services Page Loaded');
    
    // Initialize everything
    initNavigation();
    initSmoothScroll();
    initAnimations();
    initEmailJS();  // ✅ FIXED: Separate EmailJS init
    initOtherServicesForm();
});

function initEmailJS() {
    // ✅ FIXED: Initialize EmailJS FIRST with YOUR PUBLIC KEY
    emailjs.init("du3WGCOq2EcfxjyKh"); 
    console.log('✅ EmailJS Initialized');
}

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
    
    initDropdowns();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-title, .plan-card, .feature-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}

// ✅ FIXED FORM FUNCTION - WORKING VERSION
function initOtherServicesForm() {
    const form = document.getElementById('otherServicesForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !submitBtn) {
        console.error('❌ Form elements not found');
        return;
    }

    console.log('✅ Form found and ready');

    // Service dropdown logic
    const serviceType = document.getElementById('serviceType');
    const serviceDetailsContainer = document.getElementById('serviceDetailsContainer');
    
    if (serviceType && serviceDetailsContainer) {
        serviceType.addEventListener('change', function() {
            const serviceDetails = document.getElementById('serviceDetails');
            if (this.value === 'other') {
                serviceDetailsContainer.style.display = 'block';
                if (serviceDetails) serviceDetails.required = true;
            } else {
                serviceDetailsContainer.style.display = 'none';
                if (serviceDetails) {
                    serviceDetails.required = false;
                    serviceDetails.value = '';
                }
            }
        });
    }

    // ✅ FIXED FORM SUBMIT - WORKING EMAILJS
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('📤 Form submitted - sending email...');
        
        // Update button
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // ✅ FIXED: Get ALL form data correctly
        const formData = {
            fullName: document.getElementById('fullName').value.trim() || 'N/A',
            phone: document.getElementById('phone').value.trim() || 'N/A',
            email: document.getElementById('email').value.trim() || 'N/A',
            serviceType: document.getElementById('serviceType').value || 'Not specified',
            address: document.getElementById('address').value.trim() || 'N/A',
            serviceDetails: document.getElementById('serviceDetails')?.value.trim() || '',
            date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
            serviceHeadline: '🔧 New Service Quote Request',
            actionText: 'CALL NOW & Schedule!',
            page: 'Other Services Page'
        };

        console.log('📋 Form Data:', formData);

        // ✅ FIXED: EmailJS send with PROPER error handling
        emailjs.send('service_9obuszs', 'template_bfu67as', formData)
            .then(function(response) {
                console.log('✅ SUCCESS! Email sent:', response.status, response.text);
                
                // Success notification
                showNotification('✅ SUCCESS! Your service quote request has been sent. We will contact you soon!', 'success');
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    if (serviceDetailsContainer) serviceDetailsContainer.style.display = 'none';
                    submitBtn.innerHTML = 'Request FREE Quote 🚀';
                    submitBtn.disabled = false;
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 2000);
                
            }, function(error) {
                console.error('❌ EMAILJS ERROR:', error);
                console.error('Status:', error.status);
                console.error('Text:', error.text);
                
                // Error notification
                showNotification('❌ Failed to send. Please check your connection and try again.', 'error');
                
                // Reset button
                submitBtn.innerHTML = 'Request FREE Quote 🚀';
                submitBtn.disabled = false;
            });
    });
}

// ✅ NEW: BEAUTIFUL NOTIFICATION SYSTEM
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
        <button class="close-btn">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Close button
    notification.querySelector('.close-btn').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Window load
window.addEventListener('load', function() {
    console.log('✅ Other Services page fully loaded');
});