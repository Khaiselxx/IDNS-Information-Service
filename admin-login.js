// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminLoginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');
        
        // Reset previous errors
        errorMessage.style.display = 'none';
        
        // Show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loading.style.display = 'block';
        
        // Simulate API delay
        setTimeout(() => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // ✅ SUCCESS - Store login state
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);
                console.log('✅ Admin logged in successfully');
                
                // Redirect to dashboard
                window.location.href = 'admin.html';
            } else {
                // ❌ FAILED
                errorMessage.textContent = '❌ Invalid username or password!';
                errorMessage.style.display = 'block';
                
                // Reset form
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
                loading.style.display = 'none';
                
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                document.getElementById('username').focus();
            }
        }, 1500);
    });
});