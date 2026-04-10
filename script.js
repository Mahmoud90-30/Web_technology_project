document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');

    console.log("JS Loaded!"); // لو الرسالة دي مظهرتش في الـ Console يبقى الملف مش مربوط صح

    if (signUpBtn && signInBtn) {
        signUpBtn.addEventListener('click', (e) => {
            e.preventDefault(); // منع أي سلوك افتراضي
            console.log("Sign Up clicked");
            container.classList.add('right-panel-active');
        });

        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Sign In clicked");
            container.classList.remove('right-panel-active');
        });
    } else {
        console.error("Buttons not found! Check IDs in HTML");
    }
});