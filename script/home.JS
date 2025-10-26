/* config menu responsivo */

const menuHamburger = document.getElementById("menu-hamburger")
const menu = document.getElementById("menu")
const nav = document.querySelector('.nav')

const menuResponsive = () =>{
      nav.classList.toggle('active');
}

menuHamburger.addEventListener('click', () => menuResponsive())

document.addEventListener('click', (event) =>{
    const clickInMenu = nav.contains(event.target);
    const clickoutMenu = menuHamburger.contains(event.target)
    if(!clickInMenu && !clickoutMenu){
        nav.classList.remove("active")
    } 

});


/* form interativo */

let formdata = {
    clientChallenge: "",
    lackTime: "",
    adress: "",
    number: "",
    email: "",
    
}

// função para nextstep 

// Preciso criar as funções que irão fazer com que o usuario navegue através dos formulários
// o primeiro botão será para iniciar o form

const formStep = document.querySelectorAll(".form-step");
const startBtn = document.querySelector(".start-btn");
const finalBtn = document.querySelector(".final-btn");
const nextBtn = document.querySelectorAll(".next-btn");
const prevBtn = document.querySelectorAll(".prev-btn");

let currentStep = 0;
console.log(formStep);
const nextStep = () =>{
    const currentStep = document.querySelector(".form-set.active")
    //const next = document.getElementById(`step${stepNumper}`)
    if(formStep.length === 0){
        currentStep.classList.remove("active")
        next.classList.add("active")
        currentStep++
    }else if (formStep.length === 1){
        currentStep++
    }
}

startBtn.addEventListener('click', () =>{
    nextStep()
});
            
            
            
            
            
            
            
            
            
            