/* config menu responsivo */

const menuHamburger = document.getElementById("menu-hamburger")
//const menu = document.getElementById("menu")
const nav = document.querySelector('.nav')

const menuResponsive = () =>{
      nav.classList.toggle('active');
};

menuHamburger.addEventListener('click', () => menuResponsive())

document.addEventListener('click', (event) =>{
    const clickInMenu = nav.contains(event.target);
    const clickoutMenu = menuHamburger.contains(event.target);
    if(!clickInMenu && !clickoutMenu){
        nav.classList.remove("active");
    } 

});


/* form interativo */

const formData = {
    challenges: [],
    manualTime: "",
    contact: {
        name: "",
        whatsapp: "",
        email: ""
    }
};

const formSteps = Array.from(document.querySelectorAll(".form-step"));
const startBtn = document.querySelector(".start-btn");
const finalBtn = document.querySelector(".final-btn");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const challengeOptions = document.querySelectorAll(".check:not(.option4)");
const otherChallengeInput = document.querySelector(".check.option4 input[type='text']");
const timeOptions = document.querySelectorAll(".selection");
const finalStepMessage = document.querySelector("#step5 p");
const defaultFinalMessage = finalStepMessage ? finalStepMessage.textContent : "";

let currentStepIndex = formSteps.findIndex(step => step.classList.contains("active"));
if (currentStepIndex === -1 && formSteps.length) {
    currentStepIndex = 0;
    formSteps[0].classList.add("active");
}

formSteps.forEach((step, index) => {
    step.setAttribute("aria-hidden", index === currentStepIndex ? "false" : "true");
});

const updateAriaState = () => {
    formSteps.forEach((step, index) => {
        step.setAttribute("aria-hidden", index === currentStepIndex ? "false" : "true");
    });
};

const focusFirstField = () => {
    const activeStep = formSteps[currentStepIndex];
    if (!activeStep) return;
    const focusable = activeStep.querySelector("button, [href], input, select, textarea");
    if (focusable) {
        focusable.focus();
    }
};

const clearErrorMessage = (step) => {
    const error = step.querySelector(".form-error");
    if (error) {
        error.remove();
    }
};

const showErrorMessage = (step, message) => {
    clearErrorMessage(step);
    const error = document.createElement("p");
    error.className = "form-error";
    error.setAttribute("role", "alert");
    error.textContent = message;
    step.appendChild(error);
};

const updateFinalStepMessage = (name) => {
    if (!finalStepMessage) return;
    if (!name) {
        finalStepMessage.textContent = defaultFinalMessage;
        return;
    }

    finalStepMessage.textContent = "";
    finalStepMessage.append("Obrigado, ");
    const strong = document.createElement("strong");
    strong.textContent = name;
    finalStepMessage.appendChild(strong);
    finalStepMessage.append("! Você acaba de dar o primeiro passo para transformar seu digital. Em breve, você receberá uma análise inicial com recomendações específicas.");
};

const showStep = (index) => {
    if (index < 0 || index >= formSteps.length) {
        return;
    }

    const currentStep = formSteps[currentStepIndex];
    const nextStep = formSteps[index];

    if (currentStep && currentStep !== nextStep) {
        currentStep.classList.remove("active");
    }

    nextStep.classList.add("active");
    currentStepIndex = index;
    updateAriaState();
    clearErrorMessage(nextStep);
    focusFirstField();
};

const getSelectedChallenges = () => {
    const selections = [];
    challengeOptions.forEach((option) => {
        const input = option.querySelector("input[type='checkbox']");
        if (input && input.checked) {
            const label = option.querySelector("label");
            selections.push(label ? label.textContent.trim() : input.name);
        }
    });
    if (otherChallengeInput) {
        const value = otherChallengeInput.value.trim();
        if (value) {
            selections.push(value);
        }
    }
    return selections;
};

const getSelectedManualTime = () => {
    let selectedValue = "";
    timeOptions.forEach((option) => {
        const input = option.querySelector("input[type='checkbox']");
        if (input && input.checked) {
            const label = option.querySelector("label");
            selectedValue = label ? label.textContent.trim() : input.name;
        }
    });
    return selectedValue;
};

const validateStep = (index) => {
    const step = formSteps[index];
    if (!step) return true;
    clearErrorMessage(step);

    switch (step.id) {
        case "step2": {
            const challenges = getSelectedChallenges();
            if (challenges.length === 0) {
                showErrorMessage(step, "Selecione ou descreva pelo menos um desafio antes de avançar.");
                return false;
            }
            formData.challenges = challenges;
            return true;
        }
        case "step3": {
            const manualTime = getSelectedManualTime();
            if (!manualTime) {
                showErrorMessage(step, "Escolha a opção que melhor representa sua rotina.");
                return false;
            }
            formData.manualTime = manualTime;
            return true;
        }
        case "step4": {
            const nameInput = document.getElementById("clientName");
            const whatsappInput = document.getElementById("whatsApp");
            const emailInput = document.getElementById("email");
            const name = nameInput ? nameInput.value.trim() : "";
            const whatsapp = whatsappInput ? whatsappInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const isNameValid = name.length >= 3;
            const isWhatsAppValid = whatsapp.length >= 9;
            const isEmailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

            if (!isNameValid || !isWhatsAppValid || !isEmailValid) {
                showErrorMessage(step, "Preencha seu nome, WhatsApp e e-mail com informações válidas para continuarmos.");
                return false;
            }

            formData.contact.name = name;
            formData.contact.whatsapp = whatsapp;
            formData.contact.email = email;
            updateFinalStepMessage(name);
            return true;
        }
        default:
            return true;
    }
};

const handleNext = () => {
    if (!validateStep(currentStepIndex)) {
        return;
    }
    const nextIndex = Math.min(currentStepIndex + 1, formSteps.length - 1);
    showStep(nextIndex);
};

const toggleChallengeOption = (option, forceState) => {
    const input = option.querySelector("input[type='checkbox']");
    if (!input) return;

    const isChecked = typeof forceState === "boolean" ? forceState : !input.checked;
    input.checked = isChecked;
    option.classList.toggle("is-checked", isChecked);
    option.setAttribute("aria-checked", isChecked ? "true" : "false");
};

challengeOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
        event.preventDefault();
        toggleChallengeOption(option);
    });

    option.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            toggleChallengeOption(option);
        }
    });
});

if (otherChallengeInput) {
    otherChallengeInput.addEventListener("input", () => {
        const hasValue = otherChallengeInput.value.trim().length > 0;
        const option = otherChallengeInput.closest(".check");
        if (!option) return;
        option.classList.toggle("is-checked", hasValue);
        option.setAttribute("aria-checked", hasValue ? "true" : "false");
    });
}

const selectTimeOption = (selectedOption) => {
    timeOptions.forEach((option) => {
        const input = option.querySelector("input[type='checkbox']");
        const isSelected = option === selectedOption;
        if (input) {
            input.checked = isSelected;
        }
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-checked", isSelected ? "true" : "false");
    });
};

timeOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
        event.preventDefault();
        selectTimeOption(option);
    });

    option.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            selectTimeOption(option);
        }
    });
});

if (startBtn) {
    startBtn.addEventListener("click", handleNext);
}

nextBtns.forEach((button) => {
    button.addEventListener("click", handleNext);
});

prevBtns.forEach((button) => {
    button.addEventListener("click", handlePrev);
});

focusFirstField();

const resetForm = () => {
    formData.challenges = [];
    formData.manualTime = "";
    formData.contact.name = "";
    formData.contact.whatsapp = "";
    formData.contact.email = "";

    challengeOptions.forEach((option) => toggleChallengeOption(option, false));

    if (otherChallengeInput) {
        otherChallengeInput.value = "";
        const option = otherChallengeInput.closest(".check");
        if (option) {
            option.classList.remove("is-checked");
            option.setAttribute("aria-checked", "false");
        }
    }

    timeOptions.forEach((option) => {
        const input = option.querySelector("input[type='checkbox']");
        if (input) {
            input.checked = false;
        }
        option.classList.remove("is-selected");
        option.setAttribute("aria-checked", "false");
    });

    const nameInput = document.getElementById("clientName");
    const whatsappInput = document.getElementById("whatsApp");
    const emailInput = document.getElementById("email");
    if (nameInput) nameInput.value = "";
    if (whatsappInput) whatsappInput.value = "";
    if (emailInput) emailInput.value = "";
    updateFinalStepMessage("");
};

if (finalBtn) {
    finalBtn.addEventListener("click", () => {
        console.table(formData);
        resetForm();
        showStep(0);
    });
}
            
            
            
            
            