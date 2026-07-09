// ========================================
// DYNAMIC OTHER SERVICES - ADMIN SYNC
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dynamic Other Services Page Loaded');
    
    initNavigation();
    initSmoothScroll();
    initAnimations();
    
    // ✅ LOAD DYNAMIC SERVICES
    loadDynamicServices();
    
    console.log('✅ Other Services page ready - synced with admin');
});

window.addEventListener('storage', function(e) {
    // Sync when admin updates from other tabs
    if (e.key === 'idnsServices') {
        console.log('🔄 Services updated by admin - refreshing...');
        loadDynamicServices();
    }
});

// ========================================
// ✅ DYNAMIC SERVICES SYSTEM
// ========================================
function loadDynamicServices() {
    console.log('🔄 Loading dynamic services...');
    
    const servicesGrid = document.getElementById('dynamicServicesGrid');
    if (!servicesGrid) return;
    
    // Show loading
    servicesGrid.innerHTML = `
        <div class="service-card loading-placeholder">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading services...</p>
        </div>
    `;
    
    // ✅ IMMEDIATE LOAD - NO setTimeout
    const services = getStorageServices();
    
    console.log('Services found:', services); // DEBUG
    
    if (services.length === 0) {
        servicesGrid.innerHTML = `
            <div class="no-services-placeholder">
                <i class="fas fa-cogs"></i>
                <h3>No Services Available</h3>
                <p>Services will appear here once administrator adds them.</p>
            </div>
        `;
        return;
    }
    
   // Render services without the Apply Now button
    servicesGrid.innerHTML = services.map((service, index) => `
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-${getServiceIcon(service.value)}"></i>
            </div>
            <h3 class="service-title">${service.name}</h3>
            <div class="service-description">
                Professional ${service.name.toLowerCase()} service.
            </div>
        </div>
    `).join('');
    
    console.log(`✅ Loaded ${services.length} services:`, services);
}

function getStorageServices() {
    try {
        return JSON.parse(localStorage.getItem('idnsServices') || '[]');
    } catch (e) {
        console.error('Services storage error:', e);
        return [];
    }
}

// ✅ SERVICE ICON MAPPING
function getServiceIcon(value) {
    const icons = {
        'cctv': 'video',
        'firewall': 'shield-alt',
        'network': 'network-wired',
        'cabling': 'cable-carrier',
        'ftth': 'sitemap',
        'fiber': 'route',
        'p2p': 'link',
        'wifi': 'wifi',
        'server': 'server',
        'cloud': 'cloud',
        'backup': 'database',
        'security': 'lock',
        'it': 'laptop-code',
        'support': 'headset'
    };
    return icons[value] || 'cogs';
}

// ✅ AUTO-GENERATE DESCRIPTIONS
function generateServiceDescription(name) {
    const descriptions = {
        'cctv': 'Professional CCTV installation with HD/4K cameras, night vision, and remote access.',
        'firewall': 'Enterprise-grade firewall and secure VPN setup with threat detection.',
        'network': 'Complete network audit, optimization, and hardware upgrade.',
        'cabling': 'Structured cabling with Cat6/Cat6A and fiber optic certification.',
        'ftth': 'GPON FTTH design, fiber installation, ONT setup, and testing.',
        'fiber': 'Aerial/underground fiber laying with OTDR testing and certification.',
        'p2p': 'Dedicated point-to-point fiber links with 1Gbps+ speeds and SLA.',
        'default': 'Professional IT service tailored to your business needs.'
    };
    
    const key = name.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    return descriptions[key] || descriptions.default;
}

// ✅ SERVICE SELECTION (Pre-fill main site form)
function selectService(value) {
    // Store selection for main site form
    sessionStorage.setItem('selectedService', value);
    console.log(`✅ Selected service: ${value}`);
}

// ========================================
// NAVIGATION - Identical to main site
// ========================================
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

// ========================================
// SMOOTH SCROLL + ANIMATIONS
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

    document.querySelectorAll('.section-title, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// COOKIE FUNCTIONS
// ========================================
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

// Show cookie banner
setTimeout(() => {
    if (!document.cookie.includes('cookies_accepted')) {
        const banner = document.getElementById('cookieBanner');
        banner.style.display = 'flex';
        setTimeout(() => banner.classList.add('show'), 50);
    }
}, 2000);

// ========================================
// ADMIN SYNC - Real-time updates
// ========================================
window.addEventListener('adminDataUpdated', function() {
    console.log('🔄 Admin updated services - refreshing...');
    loadDynamicServices();
});

// Refresh on visibility change (back from admin tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadDynamicServices();
    }
});

console.log('✅ Dynamic Other Services - Fully synced with admin panel');