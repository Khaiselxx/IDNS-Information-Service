// ========================================
// IDNS MAIN SITE - COMPLETE DYNAMIC VERSION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 IDNS Main Site Loaded - Dynamic Mode');
    
    initNavigation();
    initAdminNavigation();
    initSmoothScroll();
    initAnimations();
    initForm();
    initTimelineAnimation();
    loadDynamicPlans();      // ✅ NEW: Dynamic plans
    updatePlanDropdown();    // ✅ NEW: Dynamic dropdown
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

function initAdminNavigation() {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin-login.html';
        });
    }
}

// ========================================
// ✅ DYNAMIC PLANS SYSTEM (NEW!)
// ========================================
function loadDynamicPlans() {
    console.log('🔄 Loading dynamic plans...');
    
    const plansGrid = document.getElementById('dynamicPlansGrid');
    if (!plansGrid) return;
    
    const plans = JSON.parse(localStorage.getItem('idnsPlans') || '[]');
    
    // Show loading
    plansGrid.innerHTML = `
        <div class="plan-card loading-placeholder">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading plans from admin...</p>
        </div>
    `;
    
    setTimeout(() => {  // Simulate network delay
        if (plans.length === 0) {
            plansGrid.innerHTML = `
                <div class="no-plans-placeholder">
                    <i class="fas fa-cog"></i>
                    <h3>No Plans Available Yet</h3>
                    <p>Plans will appear here once admin adds them.<br>
                    <small>Contact administrator to setup plans.</small></p>
                </div>
            `;
            console.log('❌ No plans found');
            return;
        }
        
        // Sort by price (low to high)
        plans.sort((a, b) => a.price - b.price);
        
        // Find popular/most expensive
        const maxPricePlan = plans.reduce((max, plan) => plan.price > max.price ? plan : max);
        
        plansGrid.innerHTML = plans.map((plan, index) => `
            <div class="plan-card ${plan.popular || plan === maxPricePlan ? 'popular' : ''}">
                ${(plan.popular || plan === maxPricePlan) ? '<div class="popular-badge">🔥 BEST VALUE</div>' : ''}
                <div class="plan-price">₱${plan.price.toLocaleString()}</div>
                <div class="plan-speed">${plan.speed}</div>
                <div class="plan-features">
                    <div><i class="fas fa-check"></i>Unlimited Data</div>
                    <div><i class="fas fa-check"></i>Quick Support</div>
                    <div><i class="fas fa-check"></i>No lock-in Contract</div>
                </div>
                <a href="#applyForm" class="plan-cta">Apply Now</a>
            </div>
        `).join('');
        
        console.log(`✅ Loaded ${plans.length} dynamic plans`);
    }, 800);
}

// ========================================
// ✅ DYNAMIC PLAN DROPDOWN (NEW!)
// ========================================
function updatePlanDropdown() {
    const planSelect = document.getElementById('plan');
    if (!planSelect) return;
    
    const plans = JSON.parse(localStorage.getItem('idnsPlans') || '[]');
    
    let options = `
        <option value="" disabled selected>Select Service/Plan</option>
    `;
    
    // ✅ Dynamic plans first
    plans.forEach(plan => {
        const popular = plan.popular ? ' ⭐' : '';
        options += `<option value="${plan.speed}">${plan.speed} - ₱${plan.price.toLocaleString()}${popular}</option>`;
    });
    
    // Static services
    options += `
        <optgroup label="Other Services">
            <option value="cctv">CCTV Installation</option>
            <option value="firewall">Firewall VPN</option>
            <option value="network">Network Rehabilitation</option>
            <option value="cabling">Structured Cabling</option>
            <option value="ftth">FTTH Installation & Design</option>
            <option value="fiber">Fiber Lying</option>
            <option value="p2p">P2P Installation</option>
        </optgroup>
    `;
    
    planSelect.innerHTML = options;
    console.log(`✅ Updated dropdown with ${plans.length} plans`);
}

// ========================================
// ✅ REAL-TIME SYNC WITH ADMIN (NEW!)
// ========================================
window.addEventListener('adminDataUpdated', function() {
    console.log('🔄 Admin updated plans - refreshing...');
    loadDynamicPlans();
    updatePlanDropdown();
});

// Refresh when returning from other tabs
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadDynamicPlans();
        updatePlanDropdown();
    }
});

// ========================================
// YOUR EXISTING FUNCTIONS (unchanged)
// ========================================
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
    const milestoneSections = document.querySelectorAll('.milestone-fullpage');
    if (milestoneSections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -20% 0px' }
        );
        milestoneSections.forEach(section => observer.observe(section));
    }
}

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
            
            await emailjs.send('service_9obuszs', 'template_bfu67as', formData);

            setTimeout(() => {
                const homeSection = document.getElementById('home');
                const navbarHeight = 90;
                const homeTop = homeSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({ top: homeTop, behavior: 'smooth' });
                
                setTimeout(() => {
                    alert('✅ Success! Application sent. We will contact you soon!');
                    form.reset();
                    window.location.href = window.location.pathname + '#home';
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

// ✅ UPDATED: Dynamic price lookup
function getPlanPrice(planValue) {
    const plans = JSON.parse(localStorage.getItem('idnsPlans') || '[]');
    const plan = plans.find(p => p.speed === planValue);
    
    if (plan) return `Plan ₱${plan.price.toLocaleString()}`;
    
    const services = { 
        'cctv': 'CCTV Installation',
        'firewall': 'Firewall VPN Setup',
        'network': 'Network Rehabilitation',
        'cabling': 'Structured Cabling',
        'ftth': 'FTTH Installation & Design',
        'fiber': 'Fiber Lying',
        'p2p': 'P2P Installation'
    };
    return services[planValue] || 'Custom Service';
}

// Cookie functions
function acceptCookies() {
    document.cookie = "cookies_accepted=true; path=/; max-age=31536000";
    document.getElementById('cookieBanner').classList.remove('show');
    setTimeout(() => document.getElementById('cookieBanner').style.display = 'none', 500);
}

function rejectCookies() {
    document.cookie = "cookies_accepted=false; path=/; max-age=31536000";
    document.getElementById('cookieBanner').classList.remove('show');
    setTimeout(() => document.getElementById('cookieBanner').style.display = 'none', 500);
}

setTimeout(() => {
    if (!document.cookie.includes('cookies_accepted')) {
        const banner = document.getElementById('cookieBanner');
        banner.style.display = 'flex';
        setTimeout(() => banner.classList.add('show'), 50);
    }
}, 2000);