/*
    НАСТРОЙКИ ОТПРАВКИ ФОРМЫ ОБРАТНОЙ СВЯЗИ
*/
    //Публичный ключ API keys Public Key - https://dashboard.emailjs.com/admin/account
    const mailPublicKey = 'u3B2FsZ2o1MMFG_r6';

    //Почтовый сервис - https://dashboard.emailjs.com/admin
    const mailServiceID = 'service_mailru';

    //Шаблон письма - https://dashboard.emailjs.com/admin/templates
    const mailTemplateID = 'template_korobok';


const placeholders = {};

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const popup = document.querySelector('.popup');
    const popupSuccess = document.querySelector('.popup-success');
    const popupFailed = document.querySelector('.popup-failed');
    const form = document.querySelector('.form');
    const overlay = document.querySelector('.overlay');
    const loader = document.querySelector('.loader');

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
        menuButton.addEventListener('click', () => showMenuMobile(body, menu, overlay));
        menu.addEventListener('click', () => hideMenuMobile(body, menu, overlay));
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
        hideMenuMobile(body, menu, overlay);
        if (popup) hidePopupAndResetForm();
        if (popupSuccess) hidePopup(body, popupSuccess, overlay);
        if (popupFailed) hidePopup(body, popupFailed, overlay);
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            hideMenuMobile(body, menu, overlay);
            if (popup) hidePopupAndResetForm();
            if (popupSuccess) hidePopup(body, popupSuccess, overlay);
            if (popupFailed) hidePopup(body, popupFailed, overlay);
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

        form.addEventListener('submit', (e) => {
            if (checkFormErrors(e)) {
                if (loader) showLoader(loader);
                emailjs.sendForm(mailServiceID, mailTemplateID, form)
                .then(
                    (response) => {
                        console.log('Письмо успешно отправлено!', response.status, response.text);
                        if (loader) hideLoader(loader);
                        hidePopupAndResetForm();
                        showPopup(body, popupSuccess, overlay);
                    },
                    (error) => {
                        console.error('Не удалось отправить письмо', error);
                        if (loader) hideLoader(loader);
                        hidePopupAndResetForm();
                        showPopup(body, popupFailed, overlay);
                    },
                );
            }
        });

        form.addEventListener('click', (e) => clearFormErrors(e.currentTarget));

        const inputs = form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            placeholders[input.name] = input.placeholder;
        });
    }

/*
    ПОДГОТОВКА ОТПРАВКИ ФОРМЫ
*/

    emailjs.init({
        publicKey: mailPublicKey,
    });
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

    return isFormValid;
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

function showMenuMobile(body, menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствуют необходимые элементы');
        return;
    }
    
    body.classList.add('noscroll');
    menu.classList.add('menu-main_mobile');
    overlay.classList.remove('hidden');
}

function hideMenuMobile(body, menu, overlay) {
    if (!menu) {
        console.error('Ошибка: в HTML отсутствуют необходимые элементы');
        return;
    }

    body.classList.remove('noscroll');
    menu.classList.remove('menu-main_mobile');
    overlay.classList.add('hidden');
}

function mailSend(serviceID, templateID, form, body, popupSuccess, popupFailed, overlay) {
    console.log(serviceID, templateID, form);

}

function showLoader(loader){
    if (!loader) return;

    loader.classList.remove('hidden');
}

function hideLoader(loader){
    if (!loader) return;

    loader.classList.add('hidden');
}