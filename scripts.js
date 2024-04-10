const formAction = '' //Скрипт на php для отправки писем
const formMethod = 'GET' //GET или POST метод для отправки данных формы



const placeholders = {};

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const popup = document.querySelector('.popup');
    const form = document.querySelector('form');
    const overlay = document.querySelector('.overlay');

    if (!(body && popup && form && overlay)) {
        console.error('Отсутствуют необходимые элементы HTML');
        return;
    }

    
/*
    РАБОТА С POPUP
*/
    const ratesButtons = document.querySelectorAll('.rates__card button');
        
    ratesButtons.forEach(button => button.addEventListener('click', () => {
        showHidePopup(body, popup, overlay)
        setRateToButton(button, popup);
    }))

    overlay.addEventListener('click', hidePopup);
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            hidePopup();
        }
    })

    function hidePopup() {
        showHidePopup(body, popup, overlay)
        setRateToButton(undefined, popup);
        resetForm(form);
        resetPlaceholders(form);
    }


/*
    РАБОТА С ФОРМОЙ
*/  
    
    form.addEventListener('submit', (e) => checkErrors(e));
    form.addEventListener('click', clearErrors);

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
        placeholders[input.name] = input.placeholder;
    });
})

const showHidePopup = (body, popup, overlay) => {
    const isHidden = popup.classList.contains('hidden');

    if (isHidden) {
        body.classList.add('noscroll');
        popup.classList.remove('hidden');
        overlay.classList.remove('hidden');
    } else {
        body.classList.remove('noscroll');
        popup.classList.add('hidden');
        overlay.classList.add('hidden');
    }
}

const setRateToButton = (button, popup) => {
    const rate = button ? button.dataset.rate : '';
    const inputRate = popup.querySelector('.form input[name="rate"]');

    if (!inputRate) {
        return;
    }
       
    inputRate.value = rate;
}

function checkErrors(e) {
    e.preventDefault();

    let isFormValid = true;

    const form = e.currentTarget;
    form.action = formAction;
    form.method = formMethod;
    
    const formName = form.querySelector('input[name="name"]');
    const formTel = form.querySelector('input[name="tel"]');
    const formEmail = form.querySelector('input[name="email"]');

    if (!formName || !formName.value) {
        console.error('В форме не было указано ФИО');
        
        formName.classList.add('form__input_error');
        formName.placeholder = 'Необходимо указать ФИО';
        
        isFormValid = false;
    }

    if (!((formTel && formTel.value) || (formEmail && formEmail.value))) {
        console.error('В форме не был указан телефон или e-mail');
        
        formTel.classList.add('form__input_error');
        formEmail.classList.add('form__input_error');
        formTel.placeholder = 'Необходимо указать телефон';
        formEmail.placeholder = 'или адрес электронной почты';
        
        isFormValid = false;
    }

    if (isFormValid) {
        form.submit();
    }
}

function clearErrors() {
    resetPlaceholders(this);
}

function resetPlaceholders(form) {
    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.classList.remove('form__input_error');
        input.placeholder = placeholders[input.name];
    });
}

function resetForm(form) {
    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => input.value = '');
}