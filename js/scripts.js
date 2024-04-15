const formAction = '' //Скрипт на php для отправки писем
const formMethod = 'GET' //GET или POST метод для отправки данных формы



const placeholders = {};

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const popup = document.querySelector('.popup');
    const form = document.querySelector('form');
    const overlay = document.querySelector('.overlay');

    if (!(body && popup && form && overlay)) {
        console.error('Ошибка: отсутствуют необходимые элементы HTML');
        return;
    }

    
/*
    РАБОТА С POPUP
*/
    const ratesButtons = document.querySelectorAll('.rates__card button');
        
    ratesButtons.forEach(button => button.addEventListener('click', (e) => {
        console.log('Button ', e.currentTarget.dataset['rate'], 'clicked!');
        showPopup(body, popup, overlay)
        setRateToButton(button, popup);
    }))

    overlay.addEventListener('click', hidePopupAndResetForm);
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') hidePopupAndResetForm();
    })

    function hidePopupAndResetForm() {
        hidePopup(body, popup, overlay)
        setRateToButton(undefined, popup);
        resetForm(form);
        clearFormErrors(form);
    }


/*
    РАБОТА С ФОРМОЙ
*/  
    
    form.addEventListener('submit', (e) => checkFormErrors(e));
    form.addEventListener('click', (e) => clearFormErrors(e.currentTarget));

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
        placeholders[input.name] = input.placeholder;
    });
})

const showPopup = (body, popup, overlay) => {
    body.classList.add('noscroll');
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const hidePopup = (body, popup, overlay) => {
    body.classList.remove('noscroll');
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
}

const setRateToButton = (button, popup) => {
    const rate = button ? button.dataset.rate : '';
    const inputRate = popup.querySelector('.form input[name="rate"]');

    if (!inputRate) {
        console.error('Ошибка: в HTML кнопки не был указан тариф data-rate');
        return;
    }
       
    inputRate.value = rate;
}

function checkFormErrors(e) {
    e.preventDefault();

    let isFormValid = true;

    const form = e.currentTarget;
    form.action = formAction;
    form.method = formMethod;
    
    const formName = form.querySelector('input[name="name"]');
    const formTel = form.querySelector('input[name="tel"]');
    const formEmail = form.querySelector('input[name="email"]');

    if (!formName || !formName.value) {
        console.error('Ошибка: в форме не было указано ФИО');
        
        formName.classList.add('form__input_error');
        formName.placeholder = 'Необходимо указать ФИО';
        
        isFormValid = false;
    }

    if (!((formTel && formTel.value) || (formEmail && formEmail.value))) {
        console.error('Ошибка: в форме не был указан телефон или e-mail');
        
        formTel.classList.add('form__input_error');
        formEmail.classList.add('form__input_error');
        formTel.placeholder = 'Необходимо указать телефон';
        formEmail.placeholder = 'или адрес электронной почты';
        
        isFormValid = false;
    }

    if (isFormValid) form.submit();
}

function clearFormErrors(form) {
    if (!form) return;

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.classList.remove('form__input_error');
        input.placeholder = placeholders[input.name];
    });
}

function resetForm(form) {
    if (!form) return;

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => input.value = '');
}