document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    initNavigation();
    initSmoothScroll();
    initAnimations();
    initForm();  // ✅ NOW WITH SHEETDB!
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

function initTimelineAnimation() {
    console.log('Timeline animation initialized');
    
    const milestoneSections = document.querySelectorAll('.milestone-fullpage');
    console.log('Found milestones:', milestoneSections.length);
    
    if (milestoneSections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log('Animating:', entry.target);
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
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

document.addEventListener('DOMContentLoaded', function() {
    initTimelineAnimation();
    window.addEventListener('load', initTimelineAnimation);
});


function initForm() {
    emailjs.init("du3WGCOq2EcfxjyKh");

    const form = document.getElementById('applyForm');
    const submitBtn = document.getElementById('submitBtn');
    

    const SHEETDB_API = 'https://sheetdb.io/api/v1/641wo3uhxnqoq';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        const formData = {
            Full_Name: document.getElementById('fullName').value.trim(),
            Phone: document.getElementById('phone').value.trim(),
            Email: document.getElementById('email').value.trim(),
            Services: document.getElementById('plan').value,
            Address: document.getElementById('address').value.trim(),
            Date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
            Price_Description: getPlanPrice(document.getElementById('plan').value)
        };

        try {
 
            await fetch(SHEETDB_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            console.log('✅ Google Sheets saved!');

   
            const emailResponse = await emailjs.send('service_9obuszs', 'template_bfu67as', formData);
            console.log('✅ Email sent!');

            setTimeout(() => {
                const homeSection = document.getElementById('home');
                const navbarHeight = 90;
                const homeTop = homeSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: homeTop,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    alert('✅ Success! The Application has been sent and will contact you as soon as possible. Thank you!');
                    window.location.href = window.location.pathname + '#home';
                    window.location.reload();
                }, 1000);
            }, 500);

        } catch (error) {
            console.error('❌ Error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Application';
            alert('❌ Please try again.');
        }
    });
}

function getPlanPrice(planValue) {
    const plans = { 
        '50Mbps': '₱799', 
        '100Mbps': '₱999', 
        '150Mbps': '₱1,299', 
        '200Mbps': '₱1,499', 
        '300Mbps': '₱2,000',
        'cctv': 'CCTV Installation',
        'firewall': 'Firewall VPN Setup',
        'network': 'Network Rehabilitation',
        'cabling': 'Structured Cabling',
        'ftth': 'FTTH Installation & Design',
        'fiber': 'Fiber Lying',
        'p2p': 'P2P Installation'
    };
    return plans[planValue] || 'Custom Service';
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            }
        });
    });
}


setTimeout(() => {
    if (!document.cookie.includes('cookies_accepted')) {
        document.getElementById('cookieBanner').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 50);
    }
}, 2000);

function acceptCookies() {
    document.cookie = "cookies_accepted=true; path=/; max-age=31536000";
    document.getElementById('cookieBanner').classList.remove('show');
    setTimeout(() => {
        document.getElementById('cookieBanner').style.display = 'none';
    }, 500);
}

function rejectCookies() {
    document.cookie = "cookies_accepted=false; path=/; max-age=31536000";
    document.getElementById('cookieBanner').classList.remove('show');
    setTimeout(() => {
        document.getElementById('cookieBanner').style.display = 'none';
    }, 500);
}