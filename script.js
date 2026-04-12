document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');

    console.log("JS Loaded!");
    if (signUpBtn && signInBtn) {
        signUpBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            console.log("Sign Up clicked");
            container.classList.add('right-panel-active');
        });

        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Sign In clicked");
            container.classList.remove('right-panel-active');
        });
    }
    else 
    {
        console.error("Buttons not found! Check IDs in HTML");
    }

if (window.location.hash === '#signup') {
    document.getElementById('container').classList.add('right-panel-active');
}
    
});

document.addEventListener('submit', (e) => {

    e.preventDefault();

    const role = document.getElementById('reg-role')?.value;
    const email = document.getElementById('reg-email')?.value || document.getElementById('login-email')?.value;


    if (email !== "" && email !== null) {
        

        localStorage.setItem("userRole", role || "User");
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "index.html"; 
    } else {
        alert("من فضلك كمل البيانات الأول!");
    }
});