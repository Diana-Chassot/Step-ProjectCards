  
const logInModal = document.getElementById('logInModal')
if (logInModal) {
    logInModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    // const modalBodyInput = logInModal.querySelector('.modal-body input')
    // modalBodyInput.value = recipient
    })
}


const logInDiv = document.querySelector('#log-in-div');
const createVisitDiv = document.querySelector('#create-visit-div');

const userEmail = document.querySelector('#user-email');
const userPassword = document.querySelector('#user-password');

const logInModalBtn = document.querySelector('#log-in-btn-modal');
const createVisitBtn = document.querySelector('#create-visit-btn');

const visitsNoItem = document.querySelector('.visits-no-items');

logInModalBtn.addEventListener('click', () => {
    if(userEmail.value !== '' && userPassword.value !== '') {
        logInDiv.classList.toggle('hidden-element');
        createVisitDiv.classList.toggle('hidden-element');
        visitsNoItem.classList.toggle('hidden-element');
    }
})