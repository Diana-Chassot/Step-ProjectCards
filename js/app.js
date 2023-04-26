
//window.addEventListener('load', getCards);

/* CustomHttp */
function customHttp() {

  const API_TOKEN = "7230c3ef-1075-4f6e-bdbd-9c4639644533";
  const API_URL = "https://ajax.test-danit.com/api/v2/cards";
  return { API_TOKEN, API_URL };

};
/* CheckStatusResponse */
function checkStatusResponse(response) {

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error');
  }
};

/*Post Cards*/
async function postCards() {

  try {
    showSpinner()
    const { API_TOKEN, API_URL } = customHttp();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        nameClient: "ExapmleName",
        nameDoctor: "DoctorExample",
        briefVisitDesc: "here will be data",
        urgency: "here will be data"
        /* какие еще данные нужны? */
      })
    });

    const card = await checkStatusResponse(response);
    checkCardsExist(card);

    const newCard = new Card(card);

    newCard.renderCard();
    hideSpinner()
  } catch (error) {
    console.error(error);
  }
};

/*Get Cards */
async function getCards() {

  try {
    showSpinner()
    const { API_TOKEN, API_URL } = customHttp();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
    });
    const cards = await checkStatusResponse(response);

    checkCardsExist(cards);
    cards.forEach(card => {

      const newCard = new Card(card);
      newCard.renderCard();

    });
    hideSpinner()
  } catch (error) {
    console.error(error);
  }
};

/* Check if cards exist  */
function checkCardsExist(cards) {

  if (cards.length === 0) {
    addNoItemsMessage()
  } else {
    deleteNoItemsMessage()
  }
};
/* Add Message "no item has been added" */
function addNoItemsMessage() {

  const cardsContent = document.querySelector(".cards-content");
  const message = `
  <span class="no-items">No items have been added</span>
  `;
  cardsContent.insertAdjacentHTML("afterbegin", message)
};
/* Delete Message "no item has been added" */
function deleteNoItemsMessage() {

  const noItemsMessage = document.querySelector('.no-items');
  if (noItemsMessage) {
    noItemsMessage.remove();
  }
};
/* Show Spinner */
function showSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "block";
};
/* Hide Spinner */
function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "none";
};
/* Card class and methodes delete, edit, render  */
class Card {

  constructor({ nameClient, nameDoc, briefVisitDescr, urgency, id /* больше данных */ }) {
    this.nameClient = nameClient;
    this.nameDoctor = nameDoc;
    this.briefVisitDescription = briefVisitDescr;
    this.urgency = urgency;
    this.id = id;
  }
  /* delete card */
  async deleteCard() {

    try {
      showSpinner()
      const { API_TOKEN, API_URL } = customHttp();
      const API_URL_ID = `${API_URL}/${this.id}`;

      const response = await fetch(API_URL_ID, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      this.element.remove();
      hideSpinner()
    }
    catch (error) {
      console.error(error);
    }
  }
  /* корректировка карточки. не доделано*/
  editCard() {
    console.log(this.id);
  }
  /* разметка карточки */
  templateCard() {

    const card = `
      <div class="card-element mb-3" style="max-width: 16rem">
        <div class="card border-warning shadow text-center col-xl " id="${this.id}">
            <div class="card-header border-warning bg-dark">
                <h2 class="card-title text-uppercase text-warning">New visit</h2>
                <button type="button" class="btn-delete btn-close btn-close-white"></button>
            </div>
            <div class="card-body">
              <p>${this.nameClient}</p>
              <p>${this.nameDoctor}</p>
              <button class="btn btn-edit btn-dark">
                <span class="text-uppercase text-warning">Edit card</span>
              </button>
              <button class="btn btn-warning" type="button" data-bs-toggle="collapse"
                data-bs-target="#c${this.id}" aria-controls="c${this.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                fill="currentColor"class="bi-arrow-down-square" 
                viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 
                  2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 
                  0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 
                  3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
                </svg>
              </button>
              
              <div id="c${this.id}" class="collapse">
                <p class="mt-2">
                контент карточки, который будет показан при
                раскрытии.
                </p>
              </div>
            </div>
          </div>    
        </div>
      `
    return card;
  };
  /* добавление карточки в разметку */
  renderCard() {
    const cardsContent = document.querySelector(".cards-content");

    let fragment = this.templateCard();

    cardsContent.insertAdjacentHTML("afterbegin", fragment);
  }
};


  
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


const createVisitModal = document.getElementById('createVisitModal')
if (createVisitModal) {
    createVisitModal.addEventListener('show.bs.modal', event => {
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
