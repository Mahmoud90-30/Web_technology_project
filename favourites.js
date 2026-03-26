/*---------------heart action when click (color)-----------------------*/
const heart_btn = document.querySelectorAll('.heart-btn')

heart_btn.forEach(btn => {

    btn.addEventListener("click" , function(){
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-solid'); 
    icon.classList.toggle('fa-regular');

    this.classList.toggle('active');
    });
})
