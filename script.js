document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');

    if (signUpButton && signInButton && container) {
        signUpButton.onclick = () => {
            container.classList.add('right-panel-active');
            
            if (window.innerWidth <= 850) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        signInButton.onclick = () => {
            container.classList.remove('right-panel-active');
            
            if (window.innerWidth <= 850) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.textContent = 'Processing...';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';
            }
        });
    });

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {

    // sign up
    let signUpForm = document.querySelector(".sign-up-container form");

    signUpForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let role = document.getElementById("reg-role").value;

        localStorage.setItem("userRole", role);
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "index.html";
    });
    // login
    let loginForm = document.querySelector(".sign-in-container form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let role = localStorage.getItem("userRole") || "User";

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role);

        window.location.href = "index.html";
    });

});
