const formAction = '' //Скрипт на php для отправки писем
const formMethod = 'GET' //GET или POST метод для отправки данных формы



const placeholders = {};

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const popup = document.querySelector('.popup');
    const form = document.querySelector('.form');
    const overlay = document.querySelector('.overlay');

    if (!(body && overlay)) {
        console.error('Ошибка: отсутствуют необходимые элементы HTML');
        return;
    }

/*
    РАБОТА С МОБИЛЬНЫМ МЕНЮ
*/ 

    const menu = document.querySelector('.menu-main');
    const menuButton = document.querySelector('.menu-mobile-button');

    if (menu && menuButton) {
        menuButton.addEventListener('click', () => showMenuMobile(menu, overlay));
        menu.addEventListener('click', () => hideMenuMobile(menu, overlay));
    }
    
/*
    РАБОТА С POPUP
*/
    const ratesButtons = document.querySelectorAll('.rates__card button');
        
    ratesButtons.forEach(button => button.addEventListener('click', (e) => {
        if (popup) {
            showPopup(body, popup, overlay)
            setRateToButton(button, popup);
        };
    }))

    overlay.addEventListener('click', () => {
        hideMenuMobile(menu, overlay);
        if (popup) hidePopupAndResetForm();
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            hideMenuMobile(menu, overlay);
            if (popup) hidePopupAndResetForm();
        }
    });

    function hidePopupAndResetForm() {
        hidePopup(body, popup, overlay)
        setRateToButton(undefined, popup);
        resetForm(form);
        clearFormErrors(form);
    }


/*
    РАБОТА С ФОРМОЙ
*/  
    if (form) {

        form.addEventListener('submit', (e) => checkFormErrors(e));
        form.addEventListener('click', (e) => clearFormErrors(e.currentTarget));

        const inputs = form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            placeholders[input.name] = input.placeholder;
        });
    }
})

function showPopup (body, popup, overlay) {
    body.classList.add('noscroll');
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hidePopup (body, popup, overlay) {
    body.classList.remove('noscroll');
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
}

function setRateToButton (button, popup) {
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

function showMenuMobile(menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствуют необходимые элементы');
        return;
    }

    menu.classList.add('menu-main_mobile');
    overlay.classList.remove('hidden');
}

function hideMenuMobile(menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствуют необходимые элементы');
        return;
    }

    menu.classList.remove('menu-main_mobile');
    overlay.classList.add('hidden');
}