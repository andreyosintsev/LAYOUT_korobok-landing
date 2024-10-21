/*
    НАСТРОЙКИ ОТПРАВКИ ФОРМЫ ОБРАТНОЙ СВЯЗИ
*/
    //Публичный ключ API keys Public Key - https://dashboard.emailjs.com/admin/account
    const mailPublicKey = '';

    //Почтовый сервис - https://dashboard.emailjs.com/admin
    const mailServiceID = '';

    //Шаблон письма - https://dashboard.emailjs.com/admin/templates
    const mailTemplateID = '';


const placeholders = {};

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const popup = document.querySelector('#popup-order');
    const popupSuccess = document.querySelector('#popup-success');
    const popupFailed = document.querySelector('#popup-failed');
    const form = document.querySelector('.form');
    const overlay = document.querySelector('.overlay');
    const loader = document.querySelector('.loader');

    const rates = document.querySelector('.rates__content');


    /*
    РАБОТА С МОБИЛЬНЫМ МЕНЮ
*/ 

    const menu = document.querySelector('.menu-main');
    const menuButton = document.querySelector('.menu-mobile-button');

    if (menu && menuButton) {
        menuButton.addEventListener('click', () => showMenuMobile(body, menu, overlay));
        menu.addEventListener('click', () => hideMenuMobile(body, menu, overlay));
    }
    
/*
    РАБОТА С POPUP
*/
    const ratesButtons = document.querySelectorAll('.rates__card button');

    if (rates && popup) {
        rates.addEventListener('click', (e) => {
            if (!e.target.classList.contains('button')) return;

            showPopup(body, popup, overlay)
            setRate(e.target, popup);
        })
    } else {
        console.error('Ошибка: в HTML отсутствует блок с карточками тарифов ratest__content или #popup-order');
    }
        
    if (overlay) {
        overlay.addEventListener('click', hideMenuAndPopups);
    }

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            hideMenuAndPopups();
        }
    });

    function hidePopupAndResetForm() {
        hidePopup(body, popup, overlay)
        setRate(undefined, popup);
        resetForm(form);
        clearFormErrors(form);
    }

    function hideMenuAndPopups() {
        hideMenuMobile(body, menu, overlay);
        hidePopupAndResetForm();
        hidePopup(body, popupSuccess, overlay);
        hidePopup(body, popupFailed, overlay);
    };

/*
    РАБОТА С ФОРМОЙ
*/  
    if (!form) {
        console.error('Ошибка: в HTML отсутствует form');
        return;
    }

    form.addEventListener('submit', (e) => {
        if (!checkFormErrors(e)) return;

        showLoader(loader);

        emailjs.sendForm(mailServiceID, mailTemplateID, form)
        .then(
            (response) => {
                console.log('Письмо успешно отправлено!', response.status, response.text);
                hidePopupAndResetForm();        
                showPopup(body, popupSuccess, overlay);
            },
            (error) => {
                console.error('Не удалось отправить письмо', error);
                hidePopupAndResetForm();        
                showPopup(body, popupFailed, overlay);
            },
        )
        .finally(
            () => {
                hideLoader(loader);
            }
        )
    });

    form.addEventListener('click', (e) => clearFormErrors(e.currentTarget));

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => placeholders[input.name] = input.placeholder);

/*
    ПОДГОТОВКА ОТПРАВКИ ФОРМЫ ПРИ ПОМОЩИ EMAILJS.COM
*/
    emailjs.init({
        publicKey: mailPublicKey,
    });
})

function showPopup (body, popup, overlay) {
    body.classList.add('noscroll');
    popup.classList.remove('hidden');
    if (overlay) overlay.classList.remove('hidden');
}

function hidePopup (body, popup, overlay) {
    body.classList.remove('noscroll');
    popup.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

function setRate (button, popup) {
    if (!popup) {
        console.error('Ошибка: в HTML отсуттвует #popup-order');
        return;
    }
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
    
    const formName = form.querySelector('input[name="name"]');
    const formTel = form.querySelector('input[name="tel"]');
    const formEmail = form.querySelector('input[name="email"]');

    if (!formName || !formName.value) {
        console.error('Ошибка: в форме отсутствует input "name" или не было указано ФИО');
        
        formName.classList.add('form__input_error');
        formName.placeholder = 'Необходимо указать ФИО';
        
        isFormValid = false;
    }

    if (!((formTel && formTel.value) || (formEmail && formEmail.value))) {
        console.error('Ошибка: в форме отсутствует input "tel" или input "email"');
        console.error('Ошибка: или в форме не был указан телефон или e-mail');
        
        formTel.classList.add('form__input_error');
        formEmail.classList.add('form__input_error');
        formTel.placeholder = 'Необходимо указать телефон';
        formEmail.placeholder = 'или адрес электронной почты';
        
        isFormValid = false;
    }

    return isFormValid;
}

function clearFormErrors(form) {
    if (!form) {
        console.error('Ошибка: в HTML отсутствует form');
        return;
    }  

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.classList.remove('form__input_error');
        input.placeholder = placeholders[input.name] ? placeholders[input.name] : '';
    });
}

function resetForm(form) {
    if (!form) {
        console.error('Ошибка: в HTML отсутствует form');
        return;
    }          

    const inputs = form.querySelectorAll('.form__input');
    inputs.forEach(input => input.value = '');
}

function showMenuMobile(body, menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствует menu');
        return;
    }
    
    body.classList.add('noscroll');
    menu.classList.add('menu-main_mobile');
    if (overlay) overlay.classList.remove('hidden');
}

function hideMenuMobile(body, menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствует menu');
        return;
    }

    body.classList.remove('noscroll');
    menu.classList.remove('menu-main_mobile');
    if (overlay) overlay.classList.add('hidden');
}

function showLoader(loader){
    if (!loader) return;

    loader.classList.remove('hidden');
}

function hideLoader(loader){
    if (!loader) return;

    loader.classList.add('hidden');
}
