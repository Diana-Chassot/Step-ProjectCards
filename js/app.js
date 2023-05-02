/* modules */
import { Modal } from "./modal.js"
import { Visit } from "./visit.js"
import { VisitTherapist } from "./visit.js"
import { VisitCardiologist } from "./visit.js"
import { VisitDentist } from "./visit.js"
import { createNewVisit } from "./visit.js"

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
  }
  else {
  throw new Error('Error');
  }
};
/*Post Cards*/
async function postCards({nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit}) {

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
        nameClient: nameClient,
        doctor: doctor,
        purposeOfTheVisit: purposeOfTheVisit, 
        briefVisitDescr: briefVisitDescr,
        urgency: urgency,
        age: age,
        bodyMassIndex: bodyMassIndex,
        bloodPressure: bloodPressure,
        pDCSystem: pastDiseasesCardiovascularSystem,
        dateOfLastVisit: dateOfLastVisit
      })
    });

    const card = await checkStatusResponse(response);
    checkCardsExist(card);
    const newCard = filterCardByDoctor(card);
    newCard.renderCard();
    newCard.renderSpecialDetails()

    hideSpinner()
    } 
    catch (error) {
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
  } 
  catch (error) {
  console.error(error);
  }
};
/* Check and filter type of card */
function filterCardByDoctor(cardData) {
  if (cardData.doctor === "dentist") {
    return new DentistCard(cardData);
  }
  else if (cardData.doctor === "cardiologist") {
    return new CardiologistCard(cardData);
  }
  else if (cardData.doctor === "therapist") {
    return new TherapistCard(cardData)
  }
  else {
  return new Card(cardData)
  }
};
/* Check if cards exist  */
function checkCardsExist(cards) {
  if (cards.length === 0) {
  addNoItemsMessage()
  }
  else {
  deleteNoItemsMessage()
  }
};
/* Add Message "no item has been added" */
function addNoItemsMessage() {
  const cardsContent = document.querySelector(".cards-content");
  const message = `
  <span class="no-items">No items have been added</span>
  `;
  cardsContent.insertAdjacentHTML("afterbegin", message);
};
/* Delete Message "no item has been added" */
function deleteNoItemsMessage() {
  const noItemsMessage = document.querySelector('.no-items');
  if (noItemsMessage) {
  noItemsMessage.remove();
  };

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
  };
  /* Delete card */
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
      };

      hideSpinner();
    }
    catch (error) {
    console.error(error);
    }
  };
  /* Edit Card */
  async editCard() {
  try {
    showSpinner()
      const { API_TOKEN, API_URL } = customHttp();
      const API_URL_ID = `${API_URL}/${this.id}`;

      const response = await fetch(API_URL_ID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          nameClient: "new Name",
          doctor: "Cardiologist",
          briefVisitDescr: "new Visit",
          urgency: "urgency",
          purposeOfTheVisit: "purpose",
          dateOfLastVisit: "31.03.2023",
          age: 55,
          bodyMassIndex: "dfsf",
          bloodPressure: "fdsfds",
          pastDiseasesCardiovascularSystem: "dfdfdf"
        })
      });
    const updatedCard = await checkStatusResponse(response);
    console.log(updatedCard)
    hideSpinner()
    }  
    
  catch (error) {
  console.error(error);
  }
  }
  renderSpecialDetails(){
  console.log("blal")
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
          <p class="text-uppercase name-client">${this.nameClient}</p>
          <p class="text-uppercase doctor">${this.doctor}</p>
          <button class="btn btn-dark" id="edit-${this.id}">
            <span class="text-uppercase text-warning">Edit card</span>
          </button>
          <button class="btn btn-warning" type="button" data-bs-toggle="collapse"
            data-bs-target="#c${this.id}" aria-controls="c${this.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
              fill="currentColor"class="bi-arrow-down-square" 
              viewBox="0 0 16 16">
              <path fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 
              2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 
              0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 
              3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
            </svg>
          </button>
          <div id="c${this.id}" class="collapse">
            <ul class="card-details mt-2 text-start">
              <li>
                <span class="text-warning">Urgency:</span>
                <span class="urgency"${this.urgency}></span>
              </li>
              <li>
                <span>Purpose of the Visit:</span>
                <span class="purpose-visit">${this.purposeVisit}</span>
              </li>
              <li>
                <span>Visit Description:</span>
                <span class="visit-descr">${this.visitDescr}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>    
    </div>
    `;
  return card;
  };

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

    const editBtn = document.getElementById(`edit-${this.id}`);
    editBtn.addEventListener('click', this.editCard.bind(this));
  }
};

class TherapistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, age }){
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.age = age;
  };

  /* render details depends of doctor */
  renderSpecialDetails() {
    const detailsElements = [
      {
        text: "Age: ",
        value: this.age
      },
    ];

    addSpecialDetails(detailsElements);
  }

};

class CardiologistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, 
  briefVisitDescr,bodyMassIndex, bloodPressure, pDCSystem, age }){
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.bodyMassIndex = bodyMassIndex;
    this.bloodPressure = bloodPressure;
    this.pDCSystem = pDCSystem;
    this.age = age;
  };

  renderSpecialDetails() {
    const detailsElements = [
      { text: "Age: ", value: this.age },
      { text: "Body Mass Index: ", value: this.bodyMassIndex },
      { text: "Blood Pressure: ", value: this.bloodPressure },
      { text: "Cardiovascular system: ", value: this.pDCSystem }
    ];

    addSpecialDetails(detailsElements);
  }
};

class DentistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, dateOfLastVisit }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.dateOfLastVisit = dateOfLastVisit;
  };

  renderSpecialDetails() {
  const detailsElements = [
    {
      text: "Date of last visit: ",
      value: this.dateOfLastVisit
    },
    ];
    addSpecialDetails(detailsElements);
  }
};
/* Add Speciall Details */
function addSpecialDetails(detailsElements) {
const cardDetails = document.querySelector(".card-details");

    detailsElements.forEach((element) => {
      const template = `
      <li>
      <span>${element.text}</span>
      <span>${element.value}</span>
      </li>
      `;
    cardDetails.insertAdjacentHTML("beforeend", template)
    });
};

/* модальні вікна */

/* вхід */
const logIn = new Modal('logInModal', 'log-in-btn-modal', 'Please enter your email and password to sign in!');
const logInModal = logIn.getModalContent();
const logInModalInputs = logIn.getModalInputs();
const logInModalBtn = logIn.getModalConfirmBtn();

const logInDiv = document.querySelector('#log-in-div');
const createVisitDiv = document.querySelector('#create-visit-div');

logIn.listenToInputs(logInModal, logInModalInputs, logInModalBtn);
logInModalBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if(logIn.checkInputs(logInModalInputs, logInModalBtn)) {
        logInDiv.classList.toggle('hidden-element');
        createVisitDiv.classList.toggle('hidden-element');

        getCards();        
    } else {
        logIn.addWarning();
    }
})

/* форма для створення візиту */
const createVisit = new Modal('createVisitModal', 'create-visit-confirm', 'All mandatory fields must be filled!');
const createVisitModal = createVisit.getModalContent();
const createVisitInputs = createVisit.getModalInputs();
const createVisitConfirmBtn = createVisit.getModalConfirmBtn();

const doctorSelect = document.getElementById('doctor');
const selectDoctorBtn = document.getElementById('select-doctor-btn');
const visitForm = document.getElementById('visit-form');
const visitAddInfo = document.querySelector('.visit-add-info');

selectDoctorBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    showForm();
    selectDoctorBtn.classList.add('disabled');
})

function showForm() {
    let formAddFields = '';

    if (doctorSelect.value === 'therapist') {
        formAddFields = `
            <div class="mb-3">
                <label for="visit-age" class="col-form-label">Patient age:</label>
                <input type="text" class="form-control" id="visit-age">
            </div>
        `
    }

    if (doctorSelect.value === 'dentist') {
        formAddFields = `
            <div class="mb-3">
                <label for="visit-last" class="col-form-label">Last visit:</label>
                <input type="date" class="form-control" id="visit-last">
            </div>
        `
    }

    if (doctorSelect.value === 'cardiologist') {
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
    clearForm();

    const urgencySelect = document.getElementById('urgency');
    urgencySelect.value = urgencySelect.children[0].value;
})

/* підтвердження створення візиту*/
createVisit.listenToInputs(createVisitModal, createVisitInputs, createVisitConfirmBtn);

createVisitConfirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(createVisit.checkInputs(createVisitInputs, createVisitConfirmBtn)) {
        postCards(createNewVisit());
            
        clearForm();
        clearSelectFields();
        createVisitConfirmBtn.removeAttribute('data-bs-dismiss', 'modal');
    } else {
        createVisit.addWarning();
    }
})

/* скасування створення візиту*/
const createVisitCancelBtn = document.getElementById('create-visit-cancel');
createVisitCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();

    clearForm();
    clearSelectFields();
})

/* очистка форми і всіх полів */
function clearForm() {
    hideForm();
    deleteAddInfo();
    deleteWarning();
    clearInputFields();
    selectDoctorBtn.classList.remove('disabled');
}

function hideForm() {
    visitForm.classList.add('hidden-element')
}

function clearInputFields() {
    const inputModalFields = document.querySelectorAll('input');
    inputModalFields.forEach( field => { 
        field.value = '';
        field.style.borderColor = '';
    });
}

function clearSelectFields() {
    const selectModalFields = document.querySelectorAll('select');
    Array.from(selectModalFields).forEach(field => {
        field.value = field.children[0].value;
    })
}

function deleteAddInfo() {
    Array.from(visitAddInfo.children).forEach(child => {
        child.remove();
    });
    createVisitModal.querySelector('.warning') ? createVisitModal.querySelector('.warning').remove() : '';

}

function deleteWarning() {
    document.querySelector('.warning') ? document.querySelector('.warning').remove() : '';
}

document.addEventListener('click', (ev) => {
    if(ev.target.classList.contains('modal')) {
        clearForm();
        clearSelectFields();
    }
})