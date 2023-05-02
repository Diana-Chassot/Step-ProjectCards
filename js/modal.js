class Modal {
    constructor(id, btnId, text) {
        this.id = id;
        this.btnId = btnId;
        this.text = text;
    };

    getModalContent() {
        const modalContent = document.getElementById(`${this.id}`);
        return modalContent;
    }

    getModalInputs() {
        const modalInputs = Array.from(document.getElementById(`${this.id}`).getElementsByTagName('input'));
        return modalInputs;
    }

    getModalConfirmBtn() {
        const modalConfirmBtn = document.getElementById(`${this.id}`).querySelector(`#${this.btnId}`);
        return modalConfirmBtn;
    }
    
    checkInputs(modalInputs, modalConfirmBtn) {
        let res = true;
        modalInputs.forEach(input => {
            if(input.value == '') {
                res = false;
                modalConfirmBtn.removeAttribute('data-bs-dismiss', 'modal');
                input.style.borderColor = 'red';
            }
        })
        return res;
    }

    listenToInputs(modalContent, modalInputs, modalConfirmBtn) {
        modalInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                modalContent.querySelector('.warning') ? modalContent.querySelector('.warning').remove() : '';                
                modalConfirmBtn.setAttribute('data-bs-dismiss', 'modal');
                this.checkInputs(modalInputs, modalConfirmBtn);
            })
        })
    }

    addWarning() {
        this.getModalContent().querySelector('.warning') ? '' : this.getModalConfirmBtn().insertAdjacentHTML('beforebegin', `<p class='warning' style='color: red'>${this.text}</p>`);
    }
}

export { Modal }
