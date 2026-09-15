// State Management
const state = {
    user: null,
    token: null,
    contacts: [],
    friends: [],
    requests: [],
    currentEditingContact: null,
    currentContactInterests: {}
};

const API_URL = '/aurelia/api';

const isElectron = window.electron && window.electron.versions && window.electron.versions.electron;

// ============ Authentication ============

// Electron login state
let electronLoginState = {
    email: null,
    codeRequested: false
};

// Request login code for Electron (expose globally)
window.requestLoginCode = async function requestLoginCode() {
    const email = document.getElementById('login-email').value.trim();
    
    if (!email) {
        await showAlert('Please enter your email address or username', 'warning', 'Input Required');
        return;
    }

    const submitBtn = document.getElementById('electron-send-code-btn') || document.querySelector('#login-form button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending code...';
    }

    try {
        const response = await fetch(`${API_URL}/auth/request-login-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            electronLoginState.email = email;
            electronLoginState.codeRequested = true;
            
            // Show code input, hide password field, hide send code button
            document.getElementById('login-password-group').style.display = 'none';
            document.getElementById('electron-code-group').style.display = 'block';
            document.getElementById('electron-send-code-btn').style.display = 'none';
            
            // Update submit button text
            const loginSubmitBtn = document.querySelector('#login-form button[type="submit"]');
            if (loginSubmitBtn) {
                loginSubmitBtn.innerHTML = 'Sign In';
                loginSubmitBtn.disabled = false;
            }
            
            await showAlert('Verification code sent! Check your email.', 'success', 'Code Sent');
        } else {
            await showAlert(data.error || 'Failed to send verification code', 'error', 'Error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText || 'Send Verification Code';
            }
        }
    } catch (error) {
        console.error('Request login code error:', error);
        await showAlert('Failed to send verification code. Please try again.', 'error', 'Error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText || 'Send Verification Code';
        }
    }
}

// Login with code for Electron (expose globally)
window.loginWithCode = async function loginWithCode() {
    const email = electronLoginState.email || document.getElementById('login-email').value.trim();
    const code = document.getElementById('electron-login-code').value.trim();

    if (!email || !code) {
        await showAlert('Please enter the code from your email', 'warning', 'Code Required');
        return;
    }

    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';
    }

    try {
        const response = await fetch(`${API_URL}/auth/login-with-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store token and user data persistently (works for both Electron and web)
            // Use same keys as regular login for compatibility
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Also store with alternative keys for compatibility
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            console.log('Γ£à Session saved persistently');

            // Update state for compatibility with existing code
            if (typeof state !== 'undefined') {
                state.token = data.token;
                state.user = data.user;
            }
            if (typeof currentUser !== 'undefined') {
                currentUser = data.user;
            }
            if (typeof authToken !== 'undefined') {
                authToken = data.token;
            }

            await showAlert('Login successful!', 'success', 'Welcome Back');
            
            // Reset Electron login state
            electronLoginState.codeRequested = false;
            electronLoginState.email = null;
            
            // Use existing app screen functions if available
            if (typeof showAppScreen === 'function') {
                await showAppScreen();
                if (typeof loadDashboard === 'function') {
                    await loadDashboard();
                }
            } else if (typeof loadUserData === 'function') {
                loadUserData();
                if (typeof showMainContent === 'function') {
                    showMainContent();
                }
            }
        } else {
            await showAlert(data.error || 'Invalid login code', 'error', 'Login Failed');
        }
    } catch (error) {
        console.error('Login with code error:', error);
        await showAlert('Failed to login. Please try again.', 'error', 'Error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText || 'Sign In';
        }
    }
}

// Helper function to check if input looks like an email
function isEmail(input) {
    // Simple email validation - contains @ and has a domain
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

async function login() {
    // Electron-specific login flow
    if (isElectron) {
        // If code was already requested and code field is visible, try to login with code
        const codeGroup = document.getElementById('electron-code-group');
        if (electronLoginState.codeRequested && codeGroup && codeGroup.style.display !== 'none') {
            await loginWithCode();
            return;
        }
        
        // Check if input is email or username
        const input = document.getElementById('login-email').value.trim();
        if (!input) {
            await showAlert('Please enter your email address or username', 'warning', 'Input Required');
            return;
        }
        
        // If it's a username (not an email), allow password login with bypass
        if (!isEmail(input)) {
            // Username login - use password flow with Electron bypass
            const password = document.getElementById('login-password').value;
            if (!password) {
                await showAlert('Please enter your password', 'warning', 'Password Required');
                return;
            }
            // Use regular login endpoint with bypass token
            await electronLoginWithPassword(input, password);
            return;
        }
        
        // It's an email - request code (this will show the code input and hide password)
        await requestLoginCode();
        return;
    }

    // ============ ORIGINAL WEBSITE LOGIN (UNCHANGED) ============
    const email = document.getElementById('login-email').value.trim(); // Can be username or email
    const password = document.getElementById('login-password').value;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Environment:', window.location.hostname);
    console.log('API URL:', API_URL);
    console.log('Email/Username:', email);

    if (!email || !password) {
        await showAlert('Please fill all fields', 'warning', 'Login Required');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';
    }

    try {
        console.log('≡ƒôí Sending login request to:', `${API_URL}/auth/login`);
        
        // Add timeout to detect hanging requests (reduced to 10 seconds for faster feedback)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.error('Γ¥î Request timeout after 10 seconds - Server not responding');
        }, 10000);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('≡ƒôÑ Login response status:', response.status);
        console.log('≡ƒôÑ Response headers:', {
            'content-type': response.headers.get('content-type'),
            'access-control-allow-origin': response.headers.get('access-control-allow-origin')
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Γ¥î Server returned non-JSON response');
            console.error('Content-Type:', contentType);
            const text = await response.text();
            console.error('Response body:', text.substring(0, 200));
            
            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            
            await showAlert('Server error: Invalid response format. Please check server logs.', 'error', 'Server Error');
            return;
        }

        const data = await response.json();
        console.log('≡ƒôÑ Login response data:', data);

        if (response.ok && data.success) {
            if (!data.token || !data.user) {
                console.error('Γ¥î Missing token or user data in response');
                
                // Restore button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                
                await showAlert('Login response incomplete. Please try again.', 'error', 'Login Error');
                return;
            }

            console.log('Γ£à Login successful');
            console.log('Γ£à User:', data.user.username);
            console.log('Γ£à Token:', data.token.substring(0, 20) + '...');
            
            // Store credentials
            state.user = data.user;
            state.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Γ£à Credentials stored in localStorage');
            
            // Show success message
            showToast('Login successful! Welcome back!', 'success');
            
            // Transition to app screen
            console.log('Γ£à Transitioning to app screen...');
            await showAppScreen();
            
            // Load dashboard data
            console.log('Γ£à Loading dashboard...');
            await loadDashboard();
            
            console.log('Γ£à Login flow complete!');
        } else {
            console.error('Γ¥î Login failed with status:', response.status);
            console.error('Γ¥î Error message:', data.error);

            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }

            // Check if account needs verification
            if (data.requiresVerification && data.email) {
                await showAlert('≡ƒôº ' + data.error, 'warning', 'Email Verification Required');
                localStorage.setItem('verificationEmail', data.email);

                // Redirect to verification page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/html/verify-email.html?email=' + encodeURIComponent(data.email);
                }, 2000);
            } else {
                await showAlert(data.error || 'Login failed. Please check your credentials.', 'error', 'Login Failed');
            }
        }
    } catch (error) {
        console.error('Γ¥î Login exception:', error);
        console.error('Γ¥î Error type:', error.name);
        console.error('Γ¥î Error message:', error.message);
        console.error('Γ¥î Error stack:', error.stack);
        
        // Restore button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Provide more specific error messages
        if (error.name === 'AbortError') {
            await showAlert('Login request timed out. Please check your internet connection and try again.', 'error', 'Request Timeout');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            await showAlert('Cannot connect to server. Please check if the server is running and accessible.', 'error', 'Connection Error');
        } else if (error.name === 'SyntaxError') {
            await showAlert('Server returned invalid data. Please check server logs.', 'error', 'Server Error');
        } else {
            await showAlert('Login error: ' + error.message + '. Please try again.', 'error', 'Connection Error');
        }
    }
}

// Electron-specific password login (with bypass token)
async function electronLoginWithPassword(emailOrUsername, password) {
    const email = emailOrUsername;
    const pwd = password;

    console.log('=== ELECTRON LOGIN ATTEMPT ===');
    console.log('Email/Username:', email);

    if (!email || !pwd) {
        await showAlert('Please fill all fields', 'warning', 'Login Required');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pwd })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store credentials (persistent for Electron)
            if (typeof state !== 'undefined') {
                state.user = data.user;
                state.token = data.token;
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            console.log('Γ£à Credentials stored in localStorage (persistent)');

            // Show success message
            if (typeof showToast === 'function') {
                showToast('Login successful! Welcome back!', 'success');
            } else if (typeof showAlert === 'function') {
                await showAlert('Login successful!', 'success', 'Welcome Back');
            }

            // Transition to app screen
            if (typeof showAppScreen === 'function') {
                await showAppScreen();
                if (typeof loadDashboard === 'function') {
                    await loadDashboard();
                }
            } else if (typeof loadUserData === 'function') {
                loadUserData();
                if (typeof showMainContent === 'function') {
                    showMainContent();
                }
            }
        } else {
            await showAlert(data.error || 'Login failed. Please check your credentials.', 'error', 'Login Failed');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        await showAlert('Login failed. Please try again.', 'error', 'Error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

async function register() {
    const firstName = document.getElementById('register-firstName').value;
    const lastName = document.getElementById('register-lastName').value;
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const age = Number(document.getElementById('register-age').value);
    const phone = document.getElementById('register-phone').value.trim() || null;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (!firstName || !lastName || !email || !username || !age || !password) {
        await showAlert('Please fill all fields', 'warning', 'Registration Required');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        await showAlert('Passwords do not match. Please make sure both password fields are identical.', 'error', 'Password Mismatch');
        return;
    }

    // Check password strength
    if (password.length < 8) {
        await showAlert('Password must be at least 8 characters long', 'warning', 'Weak Password');
        return;
    }

    if (!Number.isInteger(age) || age < 13 || age > 120) {
        await showAlert('You must be at least 13 years old to register', 'warning', 'Age Requirement');
        return;
    }

    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - age, 0, 1);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, username, age, birthday: birthday.toISOString().slice(0, 10), phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.requiresVerification) {
                // Registration successful, redirect to verification page
                await showAlert(data.message || '≡ƒôº Account created! Check your email for verification code.', 'success', 'Registration Successful');

                // Store email for verification page
                localStorage.setItem('verificationEmail', email);

                // Clear form
                document.getElementById('register-form').reset();

                // Redirect to verification page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/html/verify-email.html?email=' + encodeURIComponent(email);
                }, 2000);
            } else {
                // Old flow for already verified users (shouldn't happen with new registrations)
                state.user = data.user;
                state.token = data.token;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                await showAlert('Account created! Welcome!', 'success', 'Welcome!');
                // Clear form
                document.getElementById('register-form').reset();
                setTimeout(() => {
                    showAppScreen();
                    loadDashboard();
                }, 1500);
            }
        } else {
            await showAlert(data.error || data.details || 'Registration failed', 'error', 'Registration Failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        await showAlert('Failed to register: ' + error.message, 'error', 'Registration Error');
    }
}

let resendTimer = null;
let resendCountdown = 30;

async function showForgotPassword(e) {
    e.preventDefault();

    // Get email from login form
    const email = document.getElementById('login-email').value.trim();

    // Reset modal state
    document.getElementById('forgot-password-form-view').classList.add('hidden');
    document.getElementById('forgot-password-success-view').classList.add('hidden');
    document.getElementById('forgot-password-email').value = email;

    // Show/hide footer appropriately
    const footer = document.getElementById('forgot-password-form-footer');
    if (footer) footer.style.display = 'flex';

    // Clear any existing timer
    if (resendTimer) {
        clearInterval(resendTimer);
        resendTimer = null;
    }

    // Show modal
    document.getElementById('forgot-password-modal').classList.add('active');

    // If email is provided, automatically send reset email
    if (email) {
        await sendResetEmail(email);
    } else {
        // No email, show form to enter it
        document.getElementById('forgot-password-form-view').classList.remove('hidden');
    }
}

async function sendResetEmail(email) {
    // Show a loading state in the modal
    document.getElementById('forgot-password-form-view').classList.add('hidden');
    document.getElementById('forgot-password-success-view').classList.remove('hidden');

    // Hide footer when showing success view
    const footer = document.getElementById('forgot-password-form-footer');
    if (footer) footer.style.display = 'none';

    // Update success view to show loading state
    const successView = document.getElementById('forgot-password-success-view');
    successView.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366f1, #8b5cf6); 
                border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                margin: 0 auto 1rem;">
                <span class="spinner" style="width: 40px; height: 40px; border-width: 4px; border-color: rgba(255,255,255,0.3); border-top-color: white;"></span>
            </div>
            <h3 style="color: var(--text); font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">
                Sending Email...
            </h3>
            <p style="color: var(--text-secondary);">
                Please wait while we send the reset link to your email.
            </p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Handle plain text responses (like rate limit errors)
            const text = await response.text();
            data = { error: text };
        }

        if (response.ok) {
            // Show success view
            successView.innerHTML = `
                <div style="margin-bottom: 1.5rem;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); 
                        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 1rem; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h3 style="color: var(--success); font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">
                        Email Sent!
                    </h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">
                        Check your inbox for a password reset link. It may take a few minutes to arrive.
                    </p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Sent to: <strong id="forgot-password-sent-email" style="color: var(--text);">${email}</strong>
                    </p>
                </div>

                <div style="padding: 1rem; background: #f8fafc; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.75rem;">
                        Didn't receive the email?
                    </p>
                    <button type="button" id="resend-email-btn" class="btn btn-secondary" 
                        onclick="resendResetEmail()" style="width: 100%;">
                        Resend Email
                    </button>
                    <p id="resend-timer" class="hidden" style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                        Resend available in <strong id="resend-countdown">30</strong> seconds
                    </p>
                </div>

                <button type="button" class="btn btn-primary" onclick="closeForgotPasswordModal()" style="width: 100%;">
                    Done
                </button>
            `;

            // Store email for resend
            document.getElementById('forgot-password-email').dataset.lastEmail = email;

            // Start resend timer
            startResendTimer();
        } else {
            // Show error
            successView.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ef4444, #dc2626); 
                        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 1rem;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <h3 style="color: var(--danger); font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">
                        Failed to Send
                    </h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        ${data.error || 'Failed to send reset email. Please try again.'}
                    </p>
                    <button type="button" class="btn btn-primary" onclick="closeForgotPasswordModal()" style="width: 100%;">
                        Close
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        // Show error
        successView.innerHTML = `
            <div style="text-align: center; padding: 2rem 0;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ef4444, #dc2626); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                    margin: 0 auto 1rem;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </div>
                <h3 style="color: var(--danger); font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">
                    Connection Error
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                    Failed to send reset email. Please check your connection and try again.
                </p>
                <button type="button" class="btn btn-primary" onclick="closeForgotPasswordModal()" style="width: 100%;">
                    Close
                </button>
            </div>
        `;
    }
}

function closeForgotPasswordModal() {
    document.getElementById('forgot-password-modal').classList.remove('active');
    if (resendTimer) {
        clearInterval(resendTimer);
        resendTimer = null;
    }
    
    // Reset modal state
    document.getElementById('forgot-password-form-view').classList.add('hidden');
    document.getElementById('forgot-password-success-view').classList.add('hidden');
    const footer = document.getElementById('forgot-password-form-footer');
    if (footer) footer.style.display = 'flex';
}

async function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('forgot-password-email').value.trim();
    if (!email) return;

    // Use the sendResetEmail function
    await sendResetEmail(email);
}

async function resendResetEmail() {
    const email = document.getElementById('forgot-password-email').dataset.lastEmail;
    if (!email) return;

    const btn = document.getElementById('resend-email-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Sending...';

    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Handle plain text responses (like rate limit errors)
            const text = await response.text();
            data = { error: text };
        }

        if (response.ok) {
            // Show brief success message
            btn.textContent = 'Γ£ô Email Sent!';
            btn.style.background = 'var(--success)';
            btn.style.color = 'white';

            setTimeout(() => {
                btn.style.background = '';
                btn.style.color = '';
                startResendTimer();
            }, 2000);
        } else {
            btn.textContent = originalText;
            btn.disabled = false;
            showAlert('Failed to resend email. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Resend error:', error);
        btn.textContent = originalText;
        btn.disabled = false;
        showAlert('Failed to resend email. Please try again.', 'error');
    }
}

function startResendTimer() {
    resendCountdown = 30;
    const btn = document.getElementById('resend-email-btn');
    const timer = document.getElementById('resend-timer');
    const countdown = document.getElementById('resend-countdown');

    // Hide button, show timer
    btn.classList.add('hidden');
    timer.classList.remove('hidden');
    countdown.textContent = resendCountdown;

    // Clear existing timer if any
    if (resendTimer) {
        clearInterval(resendTimer);
    }

    // Start countdown
    resendTimer = setInterval(() => {
        resendCountdown--;
        countdown.textContent = resendCountdown;

        if (resendCountdown <= 0) {
            clearInterval(resendTimer);
            resendTimer = null;

            // Show button, hide timer
            btn.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Resend Email';
            timer.classList.add('hidden');
        }
    }, 1000);
}

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuthScreen();
    clearForms();
}

// ============ UI Navigation ============

function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}

async function showAppScreen() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');

    // Refresh user data from server to ensure we have latest info
    await refreshUserDataFromServer();

    initializeWelcomeSection();
}

async function refreshUserDataFromServer() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.user) {
                // Update state and localStorage with fresh data from server
                state.user = { ...state.user, ...data.user };
                localStorage.setItem('user', JSON.stringify(state.user));
                console.log('Γ£à User data refreshed from server - username:', data.user.username);
                return true;
            }
        }
    } catch (error) {
        console.warn('Could not refresh user data:', error);
    }
    return false;
}

function initializeWelcomeSection() {
    if (!state.user || !state.user.username) return;

    const username = state.user.username;
    const profilePicture = state.user.profilePicture;

    // Set profile picture (use actual picture if available, otherwise first letter)
    const pfpElement = document.getElementById('user-pfp-nav');
    if (pfpElement) {
        if (profilePicture) {
            // Show actual profile picture
            pfpElement.innerHTML = `<img src="${profilePicture}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Profile">`;
        } else {
            // Show initial letter
            pfpElement.textContent = username.charAt(0).toUpperCase();
            pfpElement.innerHTML = username.charAt(0).toUpperCase(); // Clear any img tags
        }
    }

    // Set welcome text with @username
    const welcomeTextElement = document.getElementById('welcome-text-nav');
    if (welcomeTextElement) {
        welcomeTextElement.textContent = `Welcome back @${username}`;
    }

    // Set username text (initially hidden)
    const usernameTextElement = document.getElementById('username-text-nav');
    if (usernameTextElement) {
        usernameTextElement.textContent = `@${username}`;
    }

    // After 5 seconds, fade out welcome text and fade in username + pfp
    setTimeout(() => {
        console.log('Fading welcome section...');
        if (welcomeTextElement) {
            welcomeTextElement.classList.add('fade-out');
        }
        if (usernameTextElement) {
            usernameTextElement.classList.add('fade-in');
        }

        const welcomeSectionElement = document.getElementById('welcome-user-section');
        if (welcomeSectionElement) {
            welcomeSectionElement.classList.add('fade-complete');
        }
    }, 5000); // 5 seconds
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionName + '-section').classList.remove('hidden');
}

// ============ Dashboard ============

async function loadDashboard() {
    await Promise.all([
        loadContacts(),
        loadFriends(),
        loadRequests()
    ]);
    updateStats();
}

async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await response.json();
        state.contacts = data.contacts;
        renderContacts();
    } catch (error) {
        console.error('Failed to load contacts:', error);
    }
}

async function loadFriends() {
    try {
        const response = await fetch(`${API_URL}/friends`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await response.json();
        console.log('Friends data loaded:', data);
        state.friends = data.friends || [];
        renderFriends();
    } catch (error) {
        console.error('Failed to load friends:', error);
    }
}

async function loadRequests() {
    try {
        const response = await fetch(`${API_URL}/friends/requests/received`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await response.json();
        state.requests = data.requests;
        renderRequests();
    } catch (error) {
        console.error('Failed to load requests:', error);
    }
}

function updateStats() {
    document.getElementById('stats-contacts').textContent = state.contacts.length;
    document.getElementById('stats-friends').textContent = state.friends.length;
    document.getElementById('stats-requests').textContent = state.requests.length;
}

// ============ Contacts ============

function renderContacts() {
    const container = document.getElementById('contacts-list');
    const empty = document.getElementById('contacts-empty');

    if (state.contacts.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    container.innerHTML = state.contacts.map(contact => `
        <div class="card">
            <div class="card-header">${contact.name}</div>
            <div class="card-text"><strong>Email:</strong> ${contact.email}</div>
            ${contact.phone ? `<div class="card-text"><strong>Phone:</strong> ${contact.phone}</div>` : ''}
            ${contact.category ? `<div class="card-text mb-2"><span class="badge badge-secondary">${contact.category}</span></div>` : ''}
            ${contact.preferredInfo ? `<div class="card-text"><span class="badge badge-primary">Shared with friends</span></div>` : ''}
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary btn-small flex-1" onclick="editContact('${contact.id}')">Edit</button>
                <button class="btn btn-danger btn-small flex-1" onclick="deleteContact('${contact.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddContactModal() {
    state.currentEditingContact = null;
    state.currentContactInterests = {};
    document.getElementById('contact-form').reset();
    renderContactInterests();
    document.querySelector('#contact-modal .modal-title').textContent = 'Add Contact';
    document.getElementById('contact-modal').classList.add('active');
}

function editContact(contactId) {
    const contact = state.contacts.find(c => c.id === contactId);
    if (!contact) return;

    state.currentEditingContact = contactId;
    document.getElementById('contact-name').value = contact.name;
    document.getElementById('contact-email').value = contact.email;
    document.getElementById('contact-phone').value = contact.phone || '';
    document.getElementById('contact-address').value = contact.address || '';
    document.getElementById('contact-category').value = contact.category || 'Other';
    document.getElementById('contact-notes').value = contact.notes || '';
    
    // Load interests if they exist
    if (contact.interests) {
        try {
            const interests = typeof contact.interests === 'string' ? JSON.parse(contact.interests) : contact.interests;
            state.currentContactInterests = interests;
        } catch (e) {
            state.currentContactInterests = {};
        }
    } else {
        state.currentContactInterests = {};
    }
    renderContactInterests();

    document.querySelector('#contact-modal .modal-title').textContent = 'Edit Contact';
    document.getElementById('contact-modal').classList.add('active');
}

async function saveContact(e) {
    e.preventDefault();

    const contactData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        address: document.getElementById('contact-address').value,
        category: document.getElementById('contact-category').value,
        notes: document.getElementById('contact-notes').value,
        interests: Object.keys(state.currentContactInterests || {}).length > 0 
            ? JSON.stringify(state.currentContactInterests || {}) 
            : null
    };

    try {
        const url = state.currentEditingContact
            ? `${API_URL}/contacts/${state.currentEditingContact}`
            : `${API_URL}/contacts`;

        const method = state.currentEditingContact ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(contactData)
        });

        const data = await response.json();

        if (response.ok) {
            closeModal('contact-modal');
            await loadContacts();
            showMessage('contact-modal', 'Contact saved!', 'success');
        } else {
            showMessage('contact-modal', data.error || 'Failed to save', 'error');
        }
    } catch (error) {
        showMessage('contact-modal', error.message, 'error');
    }
}

// Contact Interests Management
function renderContactInterests() {
    const container = document.getElementById('contact-interests-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const interests = state.currentContactInterests || {};
    const categories = Object.keys(interests);
    
    if (categories.length === 0) {
        container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem; padding: 0.5rem 0;">No interests added yet.</div>';
        return;
    }
    
    categories.forEach(category => {
        const data = interests[category];
        const genres = data.genres || [];
        const favorites = data.favorites || [];
        
        const interestCard = document.createElement('div');
        interestCard.style.cssText = 'margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;';
        
        let genresHtml = '';
        if (genres.length > 0) {
            genresHtml = `
                <div style="margin-bottom: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem;">Genres</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        ${genres.map(g => `
                            <span style="padding: 0.25rem 0.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
                                ${g} <button type="button" onclick="removeContactGenre('${category}', '${g.replace(/'/g, "\\'")}')" style="background: none; border: none; color: white; cursor: pointer; margin-left: 0.25rem; font-weight: bold;">├ù</button>
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        let favoritesHtml = '';
        if (favorites.length > 0) {
            favoritesHtml = `
                <div>
                    <div style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem;">Favorites</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        ${favorites.map(f => `
                            <span style="padding: 0.25rem 0.5rem; background: #e0e7ff; color: #6366f1; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
                                ${f} <button type="button" onclick="removeContactFavorite('${category}', '${f.replace(/'/g, "\\'")}')" style="background: none; border: none; color: #6366f1; cursor: pointer; margin-left: 0.25rem; font-weight: bold;">├ù</button>
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        interestCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="font-weight: 600; color: #1a202c;">${category}</div>
                <button type="button" onclick="removeContactInterest('${category.replace(/'/g, "\\'")}')" style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">Remove</button>
            </div>
            ${genresHtml}
            ${favoritesHtml}
            <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                <select onchange="addContactGenre('${category.replace(/'/g, "\\'")}', this)" style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem;">
                    <option value="">Add genre...</option>
                    ${getContactGenreOptions(category).map(g => `<option value="${g.replace(/'/g, "&#39;")}">${g}</option>`).join('')}
                </select>
                <input type="text" id="contact-fav-input-${categoryId}" placeholder="Add favorite..." style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem;" onkeypress="if(event.key==='Enter') addContactFavorite('${category.replace(/'/g, "\\'")}')">
                <button type="button" onclick="addContactFavorite('${category.replace(/'/g, "\\'")}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Add</button>
            </div>
        `;
        
        container.appendChild(interestCard);
    });
}

function getContactGenreOptions(category) {
    const genreMap = {
        'Board Games': ['Strategy', 'Party', 'Cooperative', 'Competitive', 'Card Games', 'Dice Games', 'Puzzle', 'Family'],
        'Video Games': ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Simulation', 'Fighting', 'Shooter'],
        'Movies': ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Animation'],
        'Books': ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help'],
        'Music': ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop', 'Country', 'Electronic', 'R&B', 'Metal', 'Indie'],
        'Sports': ['Football', 'Basketball', 'Soccer', 'Baseball', 'Tennis', 'Golf', 'Swimming', 'Running', 'Cycling', 'Yoga'],
        'Travel': ['Beach', 'Mountain', 'City', 'Adventure', 'Cultural', 'Relaxation', 'Food', 'Nature', 'Historical'],
        'Cooking': ['Baking', 'Grilling', 'Italian', 'Asian', 'Mexican', 'Desserts', 'Vegetarian', 'Vegan', 'BBQ']
    };
    return genreMap[category] || [];
}

function addContactInterest() {
    const select = document.getElementById('contact-interest-category-select');
    const category = select.value.trim();
    
    if (!category) return;
    
    if (!state.currentContactInterests) {
        state.currentContactInterests = {};
    }
    
    if (state.currentContactInterests[category]) {
        alert('This interest is already added.');
        return;
    }
    
    state.currentContactInterests[category] = { genres: [], favorites: [] };
    select.value = '';
    renderContactInterests();
}

function removeContactInterest(category) {
    if (state.currentContactInterests && state.currentContactInterests[category]) {
        delete state.currentContactInterests[category];
        renderContactInterests();
    }
}

function addContactGenre(category, select) {
    const genre = select.value.trim();
    if (!genre || !state.currentContactInterests[category]) return;
    
    if (!state.currentContactInterests[category].genres.includes(genre)) {
        state.currentContactInterests[category].genres.push(genre);
        renderContactInterests();
    }
    select.value = '';
}

function removeContactGenre(category, genre) {
    if (state.currentContactInterests && state.currentContactInterests[category]) {
        state.currentContactInterests[category].genres = state.currentContactInterests[category].genres.filter(g => g !== genre);
        renderContactInterests();
    }
}

function addContactFavorite(category) {
    const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const input = document.getElementById(`contact-fav-input-${categoryId}`);
    if (!input) return;
    
    const favorite = input.value.trim();
    if (!favorite || !state.currentContactInterests[category]) return;
    
    if (!state.currentContactInterests[category].favorites.includes(favorite)) {
        state.currentContactInterests[category].favorites.push(favorite);
        input.value = '';
        renderContactInterests();
    }
}

function removeContactFavorite(category, favorite) {
    if (state.currentContactInterests && state.currentContactInterests[category]) {
        state.currentContactInterests[category].favorites = state.currentContactInterests[category].favorites.filter(f => f !== favorite);
        renderContactInterests();
    }
}

async function deleteContact(contactId) {
    const confirmed = await showConfirm(
        'Are you sure you want to delete this contact? This action cannot be undone.',
        'Delete Contact',
        { confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' }
    );
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/contacts/${contactId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            await loadContacts();
        }
    } catch (error) {
        console.error('Delete failed:', error);
    }
}

// ============ Friends ============

function renderFriends() {
    const container = document.getElementById('friends-list-view');
    const empty = document.getElementById('friends-empty');

    if (!container) {
        console.error('friends-list-view container not found');
        return;
    }

    if (state.friends.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    container.innerHTML = state.friends.map(friend => {
        // Parse privacy settings and share preferences
        const privacySettings = friend.privacySettings ? JSON.parse(friend.privacySettings) : {};
        const sharePrefs = (friend.sharePreferences || '').split(',').map(s => s.trim()).filter(Boolean);
        const shareAll = sharePrefs.includes('all');

        // Build shared personal info HTML
        let sharedInfoHtml = '';
        const sharedInfoParts = [];

        if (shareAll || sharePrefs.includes('email')) {
            sharedInfoParts.push(`<div class="card-text">≡ƒôº ${friend.email || 'N/A'}</div>`);
        }
        if (shareAll || sharePrefs.includes('phone')) {
            if (friend.phone) sharedInfoParts.push(`<div class="card-text">≡ƒô₧ ${friend.phone}</div>`);
        }
        if (friend.birthday) {
            sharedInfoParts.push(`<div class="card-text">≡ƒÄé ${new Date(friend.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>`);
        }

        if (sharedInfoParts.length > 0) {
            sharedInfoHtml = `
                <div style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <div style="font-weight: 600; color: #475569; margin-bottom: 0.5rem;">≡ƒôï Shared Information</div>
                    ${sharedInfoParts.join('')}
                </div>
            `;
        }

        // Store friend interests data for modal viewing
        let hasInterests = false;
        if (privacySettings.shareInterests !== false && friend.interests) {
            try {
                const interests = JSON.parse(friend.interests);
                const categories = Object.keys(interests);
                if (categories.length > 0) {
                    hasInterests = true;
                    // Store in global map for modal access
                    if (!window.friendInterestsMap) window.friendInterestsMap = {};
                    window.friendInterestsMap[friend.id] = {
                        name: `${friend.firstName} ${friend.lastName}`,
                        interests: interests
                    };
                }
            } catch (e) {
                console.error('Failed to parse interests:', e);
            }
        }

        // Build avatar HTML with profile picture or initials
        const initials = `${friend.firstName?.charAt(0).toUpperCase() || '?'}${friend.lastName?.charAt(0).toUpperCase() || ''}`;
        const avatarHtml = friend.profilePicture
            ? `<img src="${friend.profilePicture}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="${friend.firstName}">`
            : initials;

        return `
            <div class="card" style="overflow: hidden; word-wrap: break-word;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="avatar">${avatarHtml}</div>
                    <div style="min-width: 0; flex: 1;">
                        <div class="card-header" style="margin: 0; overflow: hidden; text-overflow: ellipsis;">${friend.firstName} ${friend.lastName}</div>
                        <div class="card-text" style="overflow: hidden; text-overflow: ellipsis;">@${friend.username}</div>
                    </div>
                </div>
                ${friend.bio ? `<div class="card-text mb-2" style="word-wrap: break-word;">${friend.bio}</div>` : ''}
                ${sharedInfoHtml}
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    ${hasInterests ? `<button class="btn btn-primary btn-small flex-1" onclick="viewFriendInterests('${friend.id}')">View Interests</button>` : ''}
                    <button class="btn btn-danger btn-small flex-1" onclick="removeFriend('${friend.id}')">Remove Friend</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderRequests() {
    const container = document.getElementById('requests-list');
    const empty = document.getElementById('requests-empty');

    if (state.requests.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    container.innerHTML = state.requests.map(request => `
        <div class="card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div class="avatar">${request.firstName?.charAt(0).toUpperCase()}${request.lastName?.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="card-header" style="margin: 0;">${request.firstName} ${request.lastName}</div>
                    <div class="card-text">@${request.username}</div>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-small flex-1" onclick="acceptRequest('${request.userId}')">Accept</button>
                <button class="btn btn-secondary btn-small flex-1" onclick="rejectRequest('${request.userId}')">Reject</button>
            </div>
        </div>
    `).join('');
}

async function acceptRequest(userId) {
    const request = state.requests.find(r => r.userId === userId);
    if (!request) return;

    try {
        const response = await fetch(`${API_URL}/friends/request/accept/${request.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            await Promise.all([loadFriends(), loadRequests()]);
        }
    } catch (error) {
        console.error('Accept failed:', error);
    }
}

async function rejectRequest(userId) {
    const request = state.requests.find(r => r.userId === userId);
    if (!request) return;

    try {
        const response = await fetch(`${API_URL}/friends/request/reject/${request.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            await loadRequests();
        }
    } catch (error) {
        console.error('Reject failed:', error);
    }
}

async function removeFriend(friendId) {
    const confirmed = await showConfirm(
        'Are you sure you want to remove this friend? You will need to send a new friend request to reconnect.',
        'Remove Friend',
        { confirmText: 'Remove', cancelText: 'Cancel', type: 'danger' }
    );
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/friends/${friendId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            await loadFriends();
        }
    } catch (error) {
        console.error('Remove failed:', error);
    }
}

function viewFriendInterests(friendId) {
    const friendData = window.friendInterestsMap?.[friendId];
    if (!friendData) {
        console.error('Friend interests data not found for ID:', friendId);
        return;
    }

    // Create modal HTML if it doesn't exist
    let modal = document.getElementById('friend-interests-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'friend-interests-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2 class="modal-title" id="friend-interests-title">Interests</h2>
                    <button class="modal-close" onclick="closeModal('friend-interests-modal')">&times;</button>
                </div>
                <div class="modal-body" id="friend-interests-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Build interests HTML
    const interests = friendData.interests;
    const categories = Object.keys(interests);

    const interestDropdowns = categories.map((category, idx) => {
        const data = interests[category];
        const genres = data.genres || [];
        const favorites = data.favorites || [];

        // Build genres section
        let genresSection = '';
        if (genres.length > 0) {
            genresSection = `
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Genres/Types</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${genres.map(g => `
                            <span style="padding: 0.4rem 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">
                                ${g}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Build favorites section
        let favoritesSection = '';
        if (favorites.length > 0) {
            favoritesSection = `
                <div>
                    <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Favorites</div>
                    <div style="display: grid; gap: 0.5rem;">
                        ${favorites.map(f => `
                            <div style="padding: 0.6rem 0.75rem; background: #f0f9ff; border-left: 3px solid #3b82f6; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">Γ¡É</span>
                                <span style="color: #1e40af; font-weight: 500;">${f}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const hasContent = genres.length > 0 || favorites.length > 0;
        if (!hasContent) return '';

        return `
            <div style="margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <button onclick="toggleInterestCategory(${idx})" style="width: 100%; padding: 1rem; background: #f8fafc; border: none; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: 600; color: #1e40af;">
                    <span>${category}</span>
                    <span id="interest-arrow-${idx}" style="transition: transform 0.3s;">Γû╝</span>
                </button>
                <div id="interest-content-${idx}" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out;">
                    <div style="padding: 1.25rem; background: white;">
                        ${genresSection}
                        ${favoritesSection}
                    </div>
                </div>
            </div>
        `;
    }).filter(Boolean).join('');

    const bodyContent = interestDropdowns || '<p style="color: #64748b;">No interests shared yet.</p>';

    document.getElementById('friend-interests-title').textContent = `${friendData.name}'s Interests`;
    document.getElementById('friend-interests-body').innerHTML = bodyContent;
    modal.classList.add('active');
}

function toggleInterestCategory(index) {
    const content = document.getElementById(`interest-content-${index}`);
    const arrow = document.getElementById(`interest-arrow-${index}`);

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}

function viewFullContactById(contactId) {
    const contactData = window.contactsDataMap[contactId];
    if (!contactData) {
        console.error('Contact data not found for ID:', contactId);
        return;
    }
    viewFullContact(contactData);
}

function viewFullContact(contactData) {
    console.log('=== viewFullContact called ===');
    console.log('Full contactData:', contactData);
    console.log('contactData.interests type:', typeof contactData.interests);
    console.log('contactData.interests value:', contactData.interests);
    console.log('contactData.interests length:', contactData.interests?.length);

    // Create modal HTML if it doesn't exist
    let modal = document.getElementById('contact-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contact-detail-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2 class="modal-title" id="contact-detail-title">Contact Details</h2>
                    <button class="modal-close" onclick="closeModal('contact-detail-modal')">&times;</button>
                </div>
                <div class="modal-body" id="contact-detail-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Parse interests - try JSON first, then comma-separated
    let interestsHtml = '';
    console.log('Starting to parse interests...');
    console.log('contactData.interests exists?', !!contactData.interests);
    console.log('contactData.interests value:', contactData.interests);

    if (contactData.interests && contactData.interests.trim() !== '') {
        console.log('Parsing interests for modal:', contactData.interests);
        try {
            // Try to parse as JSON (structured interests)
            const interestsObj = typeof contactData.interests === 'string'
                ? JSON.parse(contactData.interests)
                : contactData.interests;

            const categories = Object.keys(interestsObj);
            console.log('Interest categories found:', categories);

            if (categories.length > 0) {
                const interestDropdowns = categories.map((category, idx) => {
                    const data = interestsObj[category];
                    const genres = data.genres || [];
                    const favorites = data.favorites || [];

                    console.log(`Category "${category}":`, { genres, favorites });

                    // Build genres section
                    let genresSection = '';
                    if (genres.length > 0) {
                        genresSection = `
                            <div style="margin-bottom: 1rem;">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Genres/Types</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                    ${genres.map(g => `
                                        <span style="padding: 0.4rem 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">
                                            ${g}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }

                    // Build favorites section
                    let favoritesSection = '';
                    if (favorites.length > 0) {
                        favoritesSection = `
                            <div>
                                <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Favorites</div>
                                <div style="display: grid; gap: 0.5rem;">
                                    ${favorites.map(f => `
                                        <div style="padding: 0.6rem 0.75rem; background: #f0f9ff; border-left: 3px solid #3b82f6; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-size: 1.2rem;">Γ¡É</span>
                                            <span style="color: #1e40af; font-weight: 500;">${f}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }

                    const hasContent = genres.length > 0 || favorites.length > 0;
                    const noContentMsg = !hasContent ? `
                        <div style="padding: 1rem; text-align: center; color: #94a3b8; font-style: italic;">
                            No items added yet
                        </div>
                    ` : '';

                    // Category icons
                    const icons = {
                        'Video Games': '≡ƒÄ«',
                        'Board Games': '≡ƒÄ▓',
                        'Movies': '≡ƒÄ¼',
                        'Books': '≡ƒôÜ',
                        'Music': '≡ƒÄ╡',
                        'Sports': 'ΓÜ╜',
                        'Travel': 'Γ£ê∩╕Å',
                        'Cooking': '≡ƒì│'
                    };
                    const icon = icons[category] || '≡ƒÄ»';

                    return `
                        <details ${idx === 0 ? 'open' : ''} style="margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 10px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;">
                            <summary style="font-weight: 700; color: #1e40af; cursor: pointer; user-select: none; list-style: none; display: flex; align-items: center; font-size: 1.1rem;">
                                <span class="dropdown-arrow" style="margin-right: 0.75rem; font-size: 0.9rem; transition: transform 0.2s; display: inline-block;">Γû╢</span>
                                <span style="margin-right: 0.5rem;">${icon}</span>
                                <span>${category}</span>
                                <span style="margin-left: auto; font-size: 0.85rem; font-weight: 500; color: #64748b; background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 12px;">
                                    ${genres.length + favorites.length} items
                                </span>
                            </summary>
                            <div style="padding-top: 1rem; margin-top: 1rem; border-top: 1px solid #e2e8f0;">
                                ${genresSection}
                                ${favoritesSection}
                                ${noContentMsg}
                            </div>
                        </details>
                    `;
                }).join('');

                interestsHtml = interestDropdowns;
            }
        } catch (e) {
            console.error('Failed to parse interests as JSON:', e);
            console.log('Trying fallback: comma-separated parsing');
            // Fallback: treat as comma-separated list
            const interestsList = contactData.interests.split(',').map(i => i.trim()).filter(Boolean);
            if (interestsList.length > 0) {
                interestsHtml = `
                    <div style="padding: 1.5rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-weight: 600; color: #475569; font-size: 1rem; margin-bottom: 1rem;">≡ƒôï Listed Interests</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${interestsList.map(interest => `
                                <span style="padding: 0.5rem 1rem; background: white; border: 2px solid #e2e8f0; border-radius: 8px; color: #1e40af; font-weight: 500;">
                                    ${interest}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
    } else {
        console.warn('No interests data found or interests is empty');
    }

    console.log('Final interestsHtml length:', interestsHtml.length);
    console.log('Has interests HTML?', !!interestsHtml);

    // Populate modal - ONLY show interests
    document.getElementById('contact-detail-title').textContent = `${contactData.name}'s Interests`;

    if (interestsHtml) {
        console.log('Setting modal body with interests HTML');
        document.getElementById('contact-detail-body').innerHTML = interestsHtml;
    } else {
        console.log('No interests - showing empty message');

        document.getElementById('contact-detail-body').innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #64748b;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">≡ƒÄ»</div>
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">No Interests Added</div>
                <div style="font-size: 0.9rem;">This contact hasn't added any interests yet.</div>
            </div>
        `;
    }

    // Show modal
    modal.classList.add('active');

    // Add click handlers to toggle details arrows with animation and hover effects
    setTimeout(() => {
        document.querySelectorAll('#contact-detail-body details').forEach(details => {
            // Arrow rotation on toggle
            details.addEventListener('toggle', function () {
                const arrow = this.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = this.open ? 'rotate(90deg)' : 'rotate(0deg)';
                }

                // Change border color when open
                if (this.open) {
                    this.style.borderColor = '#3b82f6';
                    this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                } else {
                    this.style.borderColor = '#e2e8f0';
                    this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
            });

            // Hover effect
            details.addEventListener('mouseenter', function () {
                if (!this.open) {
                    this.style.borderColor = '#cbd5e1';
                    this.style.transform = 'translateY(-2px)';
                }
            });

            details.addEventListener('mouseleave', function () {
                if (!this.open) {
                    this.style.borderColor = '#e2e8f0';
                    this.style.transform = 'translateY(0)';
                }
            });
        });
    }, 100);
}

function showFindFriendsModal() {
    document.getElementById('find-friends-modal').classList.add('active');
}

const searchInput = document.getElementById('search-query');
if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (query.length < 2) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/search/${query}`, {
                headers: { 'Authorization': `Bearer ${state.token}` }
            });
            const data = await response.json();

            if (data.users) {
                const html = data.users.map(user => `
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="avatar">${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}</div>
                            <div style="flex: 1;">
                                <div class="card-header" style="margin: 0;">${user.firstName} ${user.lastName}</div>
                                <div class="card-text">@${user.username}</div>
                            </div>
                            <button class="btn btn-primary btn-small" onclick="sendFriendRequest('${user.id}')">Add</button>
                        </div>
                    </div>
                `).join('');
                document.getElementById('search-results').innerHTML = html;
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    }, 300));
}

async function sendFriendRequest(userId) {
    try {
        const response = await fetch(`${API_URL}/friends/request/${userId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await response.json();

        if (response.ok) {
            showToast('Friend request sent successfully!', 'success');
            document.getElementById('search-query').value = '';
            document.getElementById('search-results').innerHTML = '';
        } else {
            showAlert(data.error || 'Failed to send request', 'error');
        }
    } catch (error) {
        console.error('Send request failed:', error);
    }
}

// ============ Profile ============

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await response.json();

        if (data.user) {
            // Always load these fields
            const firstNameField = document.getElementById('profile-firstName');
            if (firstNameField) firstNameField.value = data.user.firstName || '';

            const lastNameField = document.getElementById('profile-lastName');
            if (lastNameField) lastNameField.value = data.user.lastName || '';

            const bioField = document.getElementById('profile-bio');
            if (bioField) bioField.value = data.user.bio || '';

            // Load username (read-only display)
            const usernameField = document.getElementById('profile-username');
            if (usernameField) usernameField.value = data.user.username || '';

            // Load email (read-only display)
            const emailField = document.getElementById('profile-email');
            if (emailField) emailField.value = data.user.email || '';

            // Load profile picture if field exists
            const profilePictureField = document.getElementById('profile-picture');
            if (profilePictureField) {
                profilePictureField.value = data.user.profilePicture || '';
            }

            // Load phone if field exists
            const phoneField = document.getElementById('profile-phone');
            if (phoneField) {
                phoneField.value = data.user.phone || '';
            }

            // Load birthday if field exists
            const birthdayField = document.getElementById('profile-birthday');
            if (birthdayField) {
                birthdayField.value = data.user.birthday || '';
            }
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

async function saveProfile(e) {
    e.preventDefault();

    try {
        // Build profile data object with all available fields
        const profileData = {
            firstName: document.getElementById('profile-firstName').value.trim(),
            lastName: document.getElementById('profile-lastName').value.trim(),
            bio: (document.getElementById('profile-bio')?.value || '').trim()
        };

        // Add email (read-only, but include it in case backend needs it)
        const emailField = document.getElementById('profile-email');
        if (emailField && emailField.value) {
            // Email is typically not updatable, but we include it for reference
        }

        // Add optional fields if they exist
        const profilePictureField = document.getElementById('profile-picture');
        if (profilePictureField) {
            profileData.profilePicture = profilePictureField.value.trim() || '';
        }

        const phoneField = document.getElementById('profile-phone');
        if (phoneField) {
            profileData.phone = phoneField.value.trim() || '';
        }

        const birthdayField = document.getElementById('profile-birthday');
        if (birthdayField) {
            profileData.birthday = birthdayField.value || '';
        }

        console.log('Saving profile data:', profileData); // Debug log

        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Profile saved successfully:', data); // Debug log
            showToast('Profile updated successfully!', 'success');
            // Reload profile to ensure UI is in sync with server
            await loadProfile();
            // Update state.user if it exists
            if (data.user && state.user) {
                state.user = { ...state.user, ...data.user };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        } else {
            console.error('Save failed:', data); // Debug log
            showAlert('Failed to update profile: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Save failed:', error);
        showAlert('Failed to save profile. Please check your connection and try again.', 'error');
    }
}

// ============ Utilities ============

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showMessage(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    el.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        el.innerHTML = '';
    }, 5000);
}

function clearForms() {
    document.querySelectorAll('form').forEach(f => f.reset());
}

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

// ============ Event Listeners ============
// Note: Event listeners are initialized in DOMContentLoaded at the bottom of the file

// ============ Contact Import Handler ============

async function handleContactImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('import-status');
    statusEl.textContent = 'Processing file...';
    statusEl.style.color = '#3b82f6';

    try {
        const text = await file.text();
        let contacts = [];

        if (file.name.endsWith('.csv')) {
            // Parse CSV
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const contact = {};
                headers.forEach((header, index) => {
                    if (header.includes('name')) contact.name = values[index];
                    else if (header.includes('email')) contact.email = values[index];
                    else if (header.includes('phone')) contact.phone = values[index];
                    else if (header.includes('address')) contact.address = values[index];
                    else if (header.includes('interest')) contact.interests = values[index];
                    else if (header.includes('note')) contact.notes = values[index];
                });
                if (contact.name && contact.email) contacts.push(contact);
            }
        } else if (file.name.endsWith('.vcf') || file.name.endsWith('.vcard')) {
            // Parse vCard
            const vcards = text.split('BEGIN:VCARD');
            for (const vcard of vcards) {
                if (!vcard.trim()) continue;
                const contact = { category: 'Personal' };
                const lines = vcard.split('\n');
                for (const line of lines) {
                    if (line.startsWith('FN:')) contact.name = line.substring(3).trim();
                    else if (line.startsWith('EMAIL')) contact.email = line.split(':')[1]?.trim();
                    else if (line.startsWith('TEL')) contact.phone = line.split(':')[1]?.trim();
                    else if (line.startsWith('ADR')) contact.address = line.split(':')[1]?.trim();
                    else if (line.startsWith('NOTE')) contact.notes = line.split(':')[1]?.trim();
                }
                if (contact.name && contact.email) contacts.push(contact);
            }
        }

        if (contacts.length === 0) {
            statusEl.textContent = 'No valid contacts found in file';
            statusEl.style.color = '#ef4444';
            return;
        }

        // Import contacts
        let imported = 0;
        for (const contact of contacts) {
            try {
                const response = await fetch(`${API_URL}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.token}`
                    },
                    body: JSON.stringify({
                        ...contact,
                        category: contact.category || 'Other'
                    })
                });
                if (response.ok) imported++;
            } catch (err) {
                console.error('Failed to import contact:', contact.name, err);
            }
        }

        statusEl.textContent = `Γ£ô Successfully imported ${imported} of ${contacts.length} contacts`;
        statusEl.style.color = '#059669';

        // Reload contacts
        await loadContacts();

        // Reset file input
        event.target.value = '';

        // Close modal after 2 seconds
        setTimeout(() => {
            closeModal('contact-modal');
            statusEl.textContent = '';
        }, 2000);

    } catch (error) {
        console.error('Import error:', error);
        statusEl.textContent = 'Γ£ù Error importing file';
        statusEl.style.color = '#ef4444';
    }
}


// ============ Date Picker for Register Form ============

let registerPickerState = { year: 2000, month: 1, day: 1 };
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function openRegisterBirthdayPicker() {
    registerPickerState = { year: 2000, month: 1, day: 1 };
    renderRegisterDatePicker();
    document.getElementById('register-date-picker-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRegisterBirthdayPicker() {
    document.getElementById('register-date-picker-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderRegisterDatePicker() {
    document.getElementById('register-picker-year').value = registerPickerState.year;

    const date = new Date(registerPickerState.year, registerPickerState.month - 1, registerPickerState.day);
    document.getElementById('register-picker-display-month-year').textContent = `${monthNames[registerPickerState.month - 1]} ${registerPickerState.year}`;
    document.getElementById('register-picker-display-day').textContent = registerPickerState.day;
    const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('register-picker-display-weekday').textContent = weekdayName;

    const today = new Date();
    const birthDate = new Date(registerPickerState.year, registerPickerState.month - 1, registerPickerState.day);
    let actualAge = today.getFullYear() - registerPickerState.year;
    const monthDiff = today.getMonth() - (registerPickerState.month - 1);
    const dayDiff = today.getDate() - registerPickerState.day;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    const agePreview = document.getElementById('register-picker-age-preview');
    if (actualAge >= 0 && actualAge <= 120) {
        agePreview.innerHTML = `You are <strong>${actualAge}</strong> years old`;
    } else {
        agePreview.innerHTML = '';
    }

    document.getElementById('register-picker-month-select').value = registerPickerState.month;

    const grid = document.getElementById('register-calendar-grid');
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = weekdays.map(d => `<div class="weekday">${d}</div>`).join('');

    const firstDay = new Date(registerPickerState.year, registerPickerState.month - 1, 1).getDay();
    const daysInMonth = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
    const todayDate = new Date();

    for (let i = 0; i < firstDay; i++) html += `<div></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(registerPickerState.year, registerPickerState.month - 1, d);
        const disabled = dt > new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        const isToday = dt.getFullYear() === todayDate.getFullYear() && dt.getMonth() === todayDate.getMonth() && dt.getDate() === todayDate.getDate();
        const classes = ['day'];
        if (disabled) classes.push('disabled');
        if (registerPickerState.day === d) classes.push('selected');
        if (isToday) classes.push('today');
        html += `<div class="${classes.join(' ')}" onclick="selectRegisterDay(${d})">${d}</div>`;
    }

    grid.innerHTML = html;
}

function prevRegisterMonth() {
    registerPickerState.month -= 1;
    if (registerPickerState.month < 1) { registerPickerState.month = 12; registerPickerState.year -= 1; }
    if (registerPickerState.year < 1906) registerPickerState.year = 1906;
    const dim = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
    if (registerPickerState.day > dim) registerPickerState.day = dim;
    renderRegisterDatePicker();
}

function nextRegisterMonth() {
    registerPickerState.month += 1;
    if (registerPickerState.month > 12) { registerPickerState.month = 1; registerPickerState.year += 1; }
    const maxYear = new Date().getFullYear();
    if (registerPickerState.year > maxYear) registerPickerState.year = maxYear;
    const dim = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
    if (registerPickerState.day > dim) registerPickerState.day = dim;
    renderRegisterDatePicker();
}

function selectRegisterDay(d) {
    const dt = new Date(registerPickerState.year, registerPickerState.month - 1, d);
    const todayDate = new Date();
    if (dt > new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())) return;
    registerPickerState.day = d;
    renderRegisterDatePicker();
}

function confirmRegisterBirthday() {
    const { year, month, day } = registerPickerState;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    document.getElementById('register-birthday').value = dateStr;
    updateRegisterBirthdayDisplay();
    closeRegisterBirthdayPicker();
}

function updateRegisterBirthdayDisplay() {
    const dateVal = document.getElementById('register-birthday').value;
    if (dateVal) {
        const [year, month, day] = dateVal.split('-');
        const date = new Date(year, parseInt(month) - 1, day);
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const today = new Date();
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        let age = today.getFullYear() - parseInt(year);
        const monthDiff = today.getMonth() - (parseInt(month) - 1);
        const dayDiff = today.getDate() - parseInt(day);
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        document.getElementById('register-birthday-display').value = formatted;
        document.getElementById('register-birthday-info').innerHTML = `<span>≡ƒÄé Age: ${age}</span>`;
    } else {
        document.getElementById('register-birthday-display').value = '';
        document.getElementById('register-birthday-info').innerHTML = '';
    }
}

// ============ Initialization ============

// Set max date to today for birthday field and initialize date picker
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing event listeners');

    // ============ Auth Form Event Listeners ============
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            login();
        });
        console.log('Login form listener attached');
    } else {
        console.error('Login form not found!');
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Register form submitted');
            register();
        });
        console.log('Register form listener attached');
    } else {
        console.error('Register form not found!');
    }

    // ============ Auth Tabs ============
    document.querySelectorAll('#auth-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#auth-tabs .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));

            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            const targetForm = document.getElementById(`${tabName}-form`);
            if (targetForm) {
                targetForm.classList.remove('hidden');
            }
        });
    });

    // ============ Navigation ============
    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-nav');
            showSection(section);
        });
    });

    // ============ Contact Form ============
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', saveContact);
    }

    // ============ Friend Tabs ============
    document.querySelectorAll('[data-friend-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-friend-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const view = tab.getAttribute('data-friend-tab');
            const friendsListView = document.getElementById('friends-list-view');
            const requestsListView = document.getElementById('requests-list-view');
            
            if (friendsListView && requestsListView) {
                if (view === 'friends') {
                    friendsListView.classList.remove('hidden');
                    requestsListView.classList.add('hidden');
                } else {
                    friendsListView.classList.add('hidden');
                    requestsListView.classList.remove('hidden');
                }
            }
        });
    });

    // ============ Modal Background Click ============
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // ============ Birthday Picker Initialization ============
    const birthdayInput = document.getElementById('register-birthday');

    // Set max date to today (must be at least 13 years old)
    if (birthdayInput) {
        const today = new Date().toISOString().split('T')[0];
        birthdayInput.max = today;
    }

    // Year input handler
    const yearInput = document.getElementById('register-picker-year');
    if (yearInput) {
        yearInput.addEventListener('change', (e) => {
            const year = parseInt(e.target.value);
            const maxYear = new Date().getFullYear();
            if (year >= 1906 && year <= maxYear) {
                registerPickerState.year = year;
                const daysInMonth = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
                if (registerPickerState.day > daysInMonth) {
                    registerPickerState.day = daysInMonth;
                }
                renderRegisterDatePicker();
            }
        });
        yearInput.addEventListener('input', (e) => {
            const year = parseInt(e.target.value);
            const maxYear = new Date().getFullYear();
            if (!isNaN(year) && year >= 1906 && year <= maxYear) {
                registerPickerState.year = year;
                const daysInMonth = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
                if (registerPickerState.day > daysInMonth) {
                    registerPickerState.day = daysInMonth;
                }
                renderRegisterDatePicker();
            }
        });
    }

    // Month select handler
    const monthSelect = document.getElementById('register-picker-month-select');
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            const m = parseInt(e.target.value);
            if (!isNaN(m) && m >= 1 && m <= 12) {
                registerPickerState.month = m;
                const daysInMonth = new Date(registerPickerState.year, registerPickerState.month, 0).getDate();
                if (registerPickerState.day > daysInMonth) registerPickerState.day = daysInMonth;
                renderRegisterDatePicker();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('register-date-picker-modal')?.classList.contains('active')) {
            closeRegisterBirthdayPicker();
        }
    });

    // ============ Check for Invite Link Parameter ============
    const urlParams = new URLSearchParams(window.location.search);
    const isInviteLink = urlParams.has('invite');

    if (isInviteLink) {
        // Force show auth screen for invite links, even if user is logged in
        console.log('Invite link detected - showing registration/login screen');
        showAuthScreen();
        
        // Switch to register tab by default for new users
        const registerTab = document.querySelector('#auth-tabs .tab[data-tab="register"]');
        if (registerTab) {
            document.querySelectorAll('#auth-tabs .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
            registerTab.classList.add('active');
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.classList.remove('hidden');
            }
        }
        
        // Clean up the URL (remove the invite parameter) without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
        
        console.log('Invite link processed - registration form shown');
    } else {
        // ============ Normal Login Check ============
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            state.token = token;
            state.user = JSON.parse(user);
            (async () => {
                await showAppScreen();
                loadDashboard();
            })();
        } else {
            showAuthScreen();
        }
    }

    console.log('Initialization complete');
});

// ============ Invite Friend Functions ============

function showInviteFriend(event) {
    if (event) event.preventDefault();

    // Set the username in the invite message
    if (state.user && state.user.username) {
        const usernameElement = document.getElementById('invite-username');
        if (usernameElement) {
            usernameElement.textContent = '@' + state.user.username;
        }
    }

    // Clear any previous status
    const statusElement = document.getElementById('invite-copy-status');
    if (statusElement) {
        statusElement.textContent = '';
    }

    // Show the modal
    openModal('invite-friend-modal');
}

function copyInviteMessage() {
    const messageElement = document.getElementById('invite-message');
    const statusElement = document.getElementById('invite-copy-status');

    if (!messageElement) return;

    // Get the text content and format it properly
    const plainText = messageElement.textContent.trim().replace(/\s+/g, ' ').trim();
    
    // Create HTML version with proper link
    const htmlContent = messageElement.innerHTML
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace('https://aureliacontacts.com?invite=true', '<a href="https://aureliacontacts.com?invite=true">https://aureliacontacts.com?invite=true</a>');

    // Try to copy to clipboard with both plain text and HTML
    if (navigator.clipboard && navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
            'text/html': new Blob([htmlContent], { type: 'text/html' })
        });

        navigator.clipboard.write([clipboardItem])
            .then(() => {
                if (statusElement) {
                    statusElement.textContent = 'Γ£à Invitation copied to clipboard!';
                    statusElement.style.color = 'var(--success)';

                    // Clear status after 3 seconds
                    setTimeout(() => {
                        statusElement.textContent = '';
                    }, 3000);
                }
            })
            .catch(err => {
                console.error('Copy failed:', err);
                // Fallback to plain text copy
                fallbackCopyText(plainText, statusElement);
            });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // Fallback to simple text copy
        navigator.clipboard.writeText(plainText)
            .then(() => {
                if (statusElement) {
                    statusElement.textContent = 'Γ£à Invitation copied to clipboard!';
                    statusElement.style.color = 'var(--success)';

                    // Clear status after 3 seconds
                    setTimeout(() => {
                        statusElement.textContent = '';
                    }, 3000);
                }
            })
            .catch(err => {
                console.error('Copy failed:', err);
                fallbackCopyText(plainText, statusElement);
            });
    } else {
        fallbackCopyText(plainText, statusElement);
    }
}

function fallbackCopyText(text, statusElement) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        if (statusElement) {
            statusElement.textContent = 'Γ£à Invitation copied to clipboard!';
            statusElement.style.color = 'var(--success)';
            setTimeout(() => {
                statusElement.textContent = '';
            }, 3000);
        }
    } catch (err) {
        if (statusElement) {
            statusElement.textContent = 'ΓÜá∩╕Å Please manually copy the text above';
            statusElement.style.color = 'var(--warning)';
        }
    }

    document.body.removeChild(textArea);
}


function shareInvite() {
    const url = 'https://aureliacontacts.com?invite=true';
    const title = 'Join me on Aurelia Contacts!';
    const text = `Hey! Check out Aurelia Contacts - a secure way to manage contacts and share info with friends. Join me @${state.user?.username || ''}`;

    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        })
            .then(() => {
                console.log('Share successful');
            })
            .catch(err => {
                console.log('Share failed or cancelled:', err);
                // Fallback to copying the link
                copyShareLink(url);
            });
    } else {
        // Fallback: copy the URL to clipboard
        copyShareLink(url);
    }
}

function copyShareLink(url) {
    const statusElement = document.getElementById('invite-copy-status');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                if (statusElement) {
                    statusElement.textContent = 'Γ£à Website link copied to clipboard!';
                    statusElement.style.color = 'var(--success)';
                    setTimeout(() => {
                        statusElement.textContent = '';
                    }, 3000);
                }
            })
            .catch(err => {
                console.error('Copy failed:', err);
                if (statusElement) {
                    statusElement.textContent = 'ΓÜá∩╕Å Could not copy link';
                    statusElement.style.color = 'var(--warning)';
                }
            });
    }
}
