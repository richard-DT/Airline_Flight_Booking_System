console.log('Hello World!');

// =========================================================================
// MOCK LOGIN LOGIC (for frontend testing only)
// =========================================================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const bypassButton = document.getElementById('bypassButton'); // Get the new button

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {

            event.preventDefault();
            const emailInput = document.getElementById('emailInput').value;
            const passwordInput = document.getElementById('passwordInput').value;

            const ADMIN_EMAIL = 'admin@example.com';
            const ADMIN_PASSWORD = 'admin123';

            if (emailInput === ADMIN_EMAIL && passwordInput === ADMIN_PASSWORD) {
                alert('Admin login successful! Redirecting to User Profile (PG-11).');
                window.location.href = './profile.html';
            } else {
                alert('Login failed. Incorrect credentials. Use admin@example.com / admin123 to test the profile page, or click the Bypass button.');
            }
        });
    }

    if (bypassButton) {
        bypassButton.addEventListener('click', function () {

            alert('Bypass activated. Redirecting to User Profile Page.');
            window.location.href = './profile.html';
        });
    }
})


// =========================== end ========================================================
// ========================================================================================