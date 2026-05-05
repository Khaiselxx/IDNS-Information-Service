// ========================================
// IDNS ADMIN DASHBOARD - MAIN LOGIC
// ========================================

// Admin Configuration
const ADMIN_CONFIG = {
    storageKeys: {
        plans: 'idnsPlans',
        promos: 'idnsPromos',
        services: 'idnsServices'
    }
};

// ========================================
// SESSION AUTHENTICATION (from admin-login.html)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    checkAdminSession();
});

function checkAdminSession() {
    // Check sessionStorage from login page
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Show dashboard
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('authCheck').style.display = 'none';
    
    // Set username
    const username = sessionStorage.getItem('adminUsername') || 'Admin';
    document.getElementById('adminUsername').textContent = username;
    
    // Initialize dashboard
    initializeEventListeners();
    loadAllData();
    console.log('✅ IDNS Admin Dashboard loaded for:', username);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear sessionStorage (from login page)
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'index.html';
    }
}

// ========================================
// NAVIGATION
// ========================================
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    event.target.classList.add('active');
    
    // Load data for section
    switch(sectionName) {
        case 'plans': loadPlans(); break;
        case 'promos': loadPromos(); break;
        case 'services': loadServices(); break;
        case 'applications': loadApplications(); break; // NEW
    }
}

// ========================================
// MESSAGE SYSTEM
// ========================================
function showMessage(message, isError = false) {
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');
    const successText = document.getElementById('successText');
    const errorText = document.getElementById('errorText');
    
    if (isError) {
        errorText.textContent = message;
        errorMsg.style.display = 'flex';
        successMsg.style.display = 'none';
    } else {
        successText.textContent = message;
        successMsg.style.display = 'flex';
        errorMsg.style.display = 'none';
    }
    
    setTimeout(() => {
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
    }, 5000);
}

// ========================================
// PLANS MANAGEMENT (UNCHANGED)
// ========================================
document.getElementById('addPlanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const speed = document.getElementById('planSpeed').value.trim();
    const price = parseInt(document.getElementById('planPrice').value);
    const popular = document.getElementById('planPopular').value === 'true';
    
    if (!speed || isNaN(price)) {
        showMessage('Please fill all fields correctly!', true);
        return;
    }
    
    const plans = getStorageData(ADMIN_CONFIG.storageKeys.plans);
    plans.push({ speed, price, popular });
    saveStorageData(ADMIN_CONFIG.storageKeys.plans, plans);
    
    updateMainSite();
    loadPlans();
    showMessage('✅ Plan added successfully!');
    this.reset();
});

function loadPlans() {
    const plans = getStorageData(ADMIN_CONFIG.storageKeys.plans);
    const tbody = document.querySelector('#plansTable tbody');
    tbody.innerHTML = '';
    
    if (plans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #7f8c8d;">No plans yet. Add your first plan above!</td></tr>';
        return;
    }
    
    plans.forEach((plan, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>${plan.speed}</strong></td>
            <td><strong>₱${plan.price.toLocaleString()}</strong></td>
            <td>${plan.popular ? '<span style="color: #e74c3c;">🔥 BEST VALUE</span>' : '<span style="color: #7f8c8d;">Normal</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editPlan(${index})" title="Edit Price">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletePlan(${index})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    });
}

function deletePlan(index) {
    if (confirm('🗑️ Are you sure you want to delete this plan?')) {
        const plans = getStorageData(ADMIN_CONFIG.storageKeys.plans);
        plans.splice(index, 1);
        saveStorageData(ADMIN_CONFIG.storageKeys.plans, plans);
        updateMainSite();
        loadPlans();
        showMessage('✅ Plan deleted successfully!');
    }
}

function editPlan(index) {
    const plans = getStorageData(ADMIN_CONFIG.storageKeys.plans);
    const plan = plans[index];
    
    const newPrice = prompt('💰 Enter new price (current: ₱' + plan.price + '):', plan.price);
    if (newPrice !== null && !isNaN(newPrice) && newPrice > 0) {
        plan.price = parseInt(newPrice);
        saveStorageData(ADMIN_CONFIG.storageKeys.plans, plans);
        updateMainSite();
        loadPlans();
        showMessage('✅ Plan price updated!');
    }
}

// ========================================
// PROMOS & SERVICES (UNCHANGED - same as your code)
// ========================================
// ... [Keep all your existing promos/services code exactly the same] ...

// ========================================
// NEW: APPLICATIONS SECTION (SHEETDB)
// ========================================
function loadApplications() {
    // Fetch from your SHEETDB
    const SHEETDB_API = 'https://sheetdb.io/api/v1/641wo3uhxnqoq';
    
    fetch(SHEETDB_API)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#applicationsTable tbody');
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">No applications yet</td></tr>';
                return;
            }
            
            // Sort by date (newest first)
            data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            
            data.slice(0, 50).forEach((app, index) => { // Show last 50
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td><strong>${app.Full_Name || 'N/A'}</strong></td>
                    <td><a href="tel:${app.Phone}">${app.Phone || 'N/A'}</a></td>
                    <td><a href="mailto:${app.Email}">${app.Email || 'N/A'}</a></td>
                    <td><span class="service-tag">${app.Services || 'N/A'}</span></td>
                    <td>${app.Date ? new Date(app.Date).toLocaleString('en-PH') : 'N/A'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="viewApplication(${index})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                `;
            });
        })
        .catch(error => {
            console.error('Error loading applications:', error);
            showMessage('Failed to load applications', true);
        });
}

function viewApplication(index) {
    alert('Application details would open here!\n\nAdd modal or new page for full details.');
}

// ========================================
// STORAGE HELPERS (UNCHANGED)
// ========================================
function getStorageData(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        console.error('Storage error:', e);
        return [];
    }
}

function saveStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Storage save error:', e);
        showMessage('Storage error occurred!', true);
    }
}

function updateMainSite() {
    window.dispatchEvent(new CustomEvent('adminDataUpdated'));
}

// ========================================
// INITIALIZATION
// ========================================
function initializeEventListeners() {
    // Auto-logout after 30 minutes of inactivity
    let timeout;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (confirm('Session timeout due to inactivity! Login again?')) {
                logout();
            }
        }, 30 * 60 * 1000);
    }
}

function loadAllData() {
    loadPlans();
    loadPromos();
    loadServices();
}