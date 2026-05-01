    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded');
        
        initNavigation();
        initSmoothScroll();
        initAnimations();
        initForm();  // EMAIL ONLY VERSION
        initTimelineAnimation();
    });

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

        document.querySelectorAll('.section-title, .about-card, .plan-card, .feature-card, .contact-item').forEach(el => {
            observer.observe(el);
        });
    }

    // ✅ COMPLETE WORKING TIMELINE ANIMATION
    function initTimelineAnimation() {
        console.log('Timeline animation initialized'); // Debug
        
        const milestoneSections = document.querySelectorAll('.milestone-fullpage');
        console.log('Found milestones:', milestoneSections.length); // Debug
        
        if (milestoneSections.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            console.log('Animating:', entry.target); // Debug
                            entry.target.classList.add('animate');
                            observer.unobserve(entry.target); // Prevent re-trigger
                        }
                    });
                },
                { 
                    threshold: 0.3,
                    rootMargin: '0px 0px -20% 0px'
                }
            );

            milestoneSections.forEach(section => observer.observe(section));
        }
    }

    // ✅ Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initTimelineAnimation();
        
        // Also call on window load (for images)
        window.addEventListener('load', initTimelineAnimation);
    });

    function initForm() {
        emailjs.init("du3WGCOq2EcfxjyKh");

        const form = document.getElementById('applyForm');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                plan: document.getElementById('plan').value,
                address: document.getElementById('address').value.trim(),
                date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
                plan_price: getPlanPrice(document.getElementById('plan').value)
            };

            emailjs.send('service_9obuszs', 'template_bfu67as', formData)
                .then(function(response) {
                    console.log('✅ Email sent!');
                    
                    setTimeout(() => {
                        // 🎯 PERFECT HOME JUMP WITH NAVBAR OFFSET
                        const homeSection = document.getElementById('home');
                        const navbarHeight = 90;  // Your navbar height
                        const homeTop = homeSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                        
                        window.scrollTo({
                            top: homeTop,
                            behavior: 'smooth'
                        });
                        
                        setTimeout(() => {
                            alert('✅ Success! The Application has been sent. Thank you!');
                            window.location.href = window.location.pathname + '#home';
                            window.location.reload();
                        }, 1000);
                    }, 500);
                    
                }, function(error) {
                    console.error('❌ Error:', error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Application';
                    alert('❌ Please try again.');
                });
        });
    }
    function getPlanPrice(planValue) {
        const plans = { 
            '799': '₱799', 
            '999': '₱999 ⭐', 
            '1299': '₱1,299', 
            '1499': '₱1,499', 
            '2000': '₱2,000' 
        };
        return plans[planValue] || 'N/A';
    }

    // Add this to your existing initNavigation() function or create new
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        // Desktop hover (already handled by CSS)
        
        // Mobile click
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            }
        });
    });
}

// Update your initNavigation function to include dropdowns
function initNavigation() {
    // ... your existing code ...
    
    initDropdowns(); // Add this line
}