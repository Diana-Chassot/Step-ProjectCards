
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
        nameClient: "Marianna",
        doctor: "dont need doc",
        briefVisitDescr: "I am not sick just come here to rest",
        urgency: "small",
        bodyMassIndex: undefined,
        age: 33,
        bloodPressure: undefined,
        pastDiseasesCardiovascularSystem: undefined,
        dateOfLastVisit: undefined
      })
    });

    const card = await checkStatusResponse(response);
    checkCardsExist(card);

    const newCard = filterCardByDoctor(card);

    newCard.renderCard();
    newCard.renderSpecialDetails()

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

      const newCard = filterCardByDoctor(card);
      newCard.renderCard();
      newCard.renderSpecialDetails();

    });

    hideSpinner()
  } catch (error) {
    console.error(error);
  }
};
/* Check and filter type of card */
function filterCardByDoctor(cardData) {
  if (cardData.doctor === "Dentist") {
    return new DentistCard(cardData);
  }
  else if (cardData.doctor === "Cardiologist") {
    return new CardiologistCard(cardData);
  }
  else if (cardData.doctor === "Therapist") {
    return new TherapistCard(cardData)
  }
  else {
    return new Card(cardData)
  }

}

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

  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr }) {

    this.id = id;
    this.nameClient = nameClient;
    this.doctor = doctor;
    this.urgency = urgency;
    this.purposeVisit = purposeOfTheVisit,
    this.visitDescr = briefVisitDescr;
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
      
      if (response.ok) {
        const cardElement = document.getElementById(this.id);
        cardElement.remove();
      }

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
      <div class="card-element mb-3" style="max-width: 25rem" id="${this.id}">
        <div class="card border-warning shadow text-center col-xl" >
          <div class="card-header border-warning bg-dark">
              <h2 class="card-title text-uppercase text-warning">New visit</h2>
              <button type="button" class="btn-close btn-close-white" id="delete-${this.id}"></button>
          </div>
          <div class="card-body">
            <p class="text-uppercase">${this.nameClient}</p>
            <p class="text-uppercase">${this.doctor}</p>
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
              <ul class="card-details mt-2 text-start">
                <li>
                  <span class="text-warning">Urgency:</span>
                  ${this.urgency}
                </li>
                <li>
                  <span>Purpose of the Visit:</span>
                  ${this.purposeVisit}
                </li>
                <li>
                  <span>Visit Description:</span>
                  ${this.visitDescr}
                </li>
              </ul>
            </div>
          </div>
        </div>    
      </div>
    `
    return card;
  };
  /* удалить после когда все картчоки на сервере будут с определнными докторами */
  renderSpecialDetails() {
    console.log("Delete this.method when all cards will be with DEFIND DOCTOR");
  }
  /* добавление карточки в разметку */
  renderCard() {

    const cardsContent = document.querySelector(".cards-content");

    let fragment = this.templateCard();

    cardsContent.insertAdjacentHTML("afterbegin", fragment);
    this.addEventListener();

  }
  addEventListener() {
    const deleteBtn = document.getElementById(`delete-${this.id}`);
    deleteBtn.addEventListener('click', this.deleteCard.bind(this));
  }
};


class TherapistCard extends Card {

  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.age = age;
  };
  /* render details depends of doctor */
  renderSpecialDetails() {

    const detailsElements = [
      { text: "Age: ", value: this.age },
    ];
    addSpecialDetails(detailsElements);
  }
};

class CardiologistCard extends Card {

  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, bodyMassIndex, bloodPressure, pDCSystem, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.bodyMassIndex = bodyMassIndex;
    this.bloodPressure = bloodPressure;
    this.pDCSystem = pDCSystem;
    this.age = age;
  };
  /* render details depends of doctor */
  renderSpecialDetails() {

    const detailsElements = [
      { text: "Age: ", value: this.age },
      { text: "Body Mass Index: ", value: this.bodyMassIndex },
      { text: "Blood Pressure ", value: this.bloodPressure },
      { text: "Cardiovascular system ", value: this.pDCSystem }
    ];
    addSpecialDetails(detailsElements);
  }
};

class DentistCard extends Card {

  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, dateOfLastVisit }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.dateOfLastVisit = dateOfLastVisit;
  };

  /* render details depends of doctor */
  renderSpecialDetails() {

    const detailsElements = [
      { text: "Date of last visit: ", value: this.dateOfLastVisit },
    ];
    addSpecialDetails(detailsElements);
  }
};
/* Add Speciall Details */
function addSpecialDetails(detailsElements) {

  const cardDetails = document.querySelector(".card-details");

  detailsElements.forEach((element) => {
    const template = `
    <li><span>${element.text}</span>${element.value}</li>
    `
    cardDetails.insertAdjacentHTML("beforeend", template)
  });
}


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

logInModalBtn.addEventListener('click', () => {
  if (userEmail.value !== '' && userPassword.value !== '') {
    logInDiv.classList.toggle('hidden-element');
    createVisitDiv.classList.toggle('hidden-element');
    getCards();
  }
})

/* модальне вікно для створення візиту */
const createVisitModal = document.getElementById('createVisitModal')
if (createVisitModal) {
  createVisitModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
  })
}

/* форма для створення візиту */
const selectDoctorBtn = document.getElementById('select-doctor-btn');
const visitForm = document.getElementById('visit-form');
const visitAddInfo = document.querySelector('.visit-add-info');

selectDoctorBtn.addEventListener('click', (ev) => {
  ev.preventDefault();
  showForm();
  selectDoctorBtn.classList.add('disabled');
})

const doctorSelect = document.getElementById('doctor');
function showForm() {
  let formAddFields = '';
  let doctor = doctorSelect.value;

  if (doctor === 'therapist') {
    formAddFields = `
            <div class="mb-3">
                <label for="visit-age" class="col-form-label">Patient age:</label>
                <input type="text" class="form-control" id="visit-age">
            </div>
        `
  }

  if (doctor === 'dentist') {
    formAddFields = `
            <div class="mb-3">
                <label for="visit-last" class="col-form-label">Last visit:</label>
                <input type="date" class="form-control" id="visit-last">
            </div>
        `
  }

  if (doctor === 'cardiologist') {
    formAddFields = `
            <div class="mb-3">
                <label for="visit-normal-pressure" class="col-form-label">Normal pressure:</label>
                <input type="text" class="form-control" id="visit-normal-pressure">
            </div>
            <div class="mb-3">
                <label for="visit-BMI" class="col-form-label">Body mass index:</label>
                <input type="text" class="form-control" id="visit-BMI">
            </div>
            <div class="mb-3">
                <label for="visit-heart-diseases" class="col-form-label">Past diseases of the cardiovascular system:</label>
                <input type="text" class="form-control" id="visit-heart-diseases">
            </div>
            <div class="mb-3">
                <label for="visit-age" class="col-form-label">Patient age:</label>
                <input type="text" class="form-control" id="visit-age">
            </div>
        `
  }

  visitAddInfo.insertAdjacentHTML('afterbegin', formAddFields);
  visitForm.classList.remove('hidden-element')
}

/* зміна полів форми для створення візиту */
doctorSelect.addEventListener('change', () => {
  hideForm();
  deleteAddInfo();
  selectDoctorBtn.classList.remove('disabled');
})

/* підтвердження створення візиту*/
const createVisitConfirmBtn = document.getElementById('create-visit-confirm');
createVisitConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  postCards();
})

/* скасування створення візиту*/
const createVisitCancelBtn = document.getElementById('create-visit-cancel');
createVisitCancelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  hideForm();
  clearVisitFormFields();
  deleteAddInfo();
  selectDoctorBtn.classList.remove('disabled');
})

function clearVisitFormFields() {
  const visitModalFields = visitForm.querySelectorAll('input');

  visitModalFields.forEach(field => {
    field.value = ''
  });

  doctorSelect.value = 'therapist';

  const visitUrgencySelect = document.getElementById('urgency');
  visitUrgencySelect.value = 'ordinary';
}

function deleteAddInfo() {
  Array.from(visitAddInfo.children).forEach(child => {
    child.remove();
  })
}

function hideForm() {
  visitForm.classList.add('hidden-element')
}