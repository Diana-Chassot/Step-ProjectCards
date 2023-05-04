/* modules */
import { Modal } from "./modal.js"
import { Visit, VisitTherapist, VisitCardiologist, VisitDentist, createNewVisit } from "./visit.js"
import { showSpinner, hideSpinner } from "./spinner.js"
import { checkCardsExist } from "./check-cards-exist.js"
import { customHttp } from "./http.js"
import { checkStatusResponse } from "./check-status-response.js"
import { deleteFromHtml } from "./delete-elem-from-html.js"
import { renderSpecialDetails } from "./render-speciall-details.js"
import { deleteModalConfirmBtnEdit, createModalConfirmBtnEdit } from "./modal-confirm-btns.js"
import { filterByKeyWord } from "./filter-key-word.js"
import { doctorsList, filterByDoctor } from "./filter-by-doctor.js"
import { urgencyList, filterByUrgency } from "./filter-by-urgency.js"

/*Post Cards*/
async function postCards({ nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age,
  bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit }) {
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
        age: age ,
        bodyMassIndex: bodyMassIndex ,
        bloodPressure: bloodPressure ,
        pDCSystem: pastDiseasesCardiovascularSystem ,
        dateOfLastVisit: dateOfLastVisit
      })
    });

    const card = await checkStatusResponse(response);
    const newCard = filterCardByDoctor(card);
    newCard.renderCard();
    newCard.addSpecialDetails();
    
  }

  catch (error) {
    console.error(error);
  }
  finally {
    hideSpinner()
    checkCardsExist();
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
    
    cards.forEach(card => {
      const newCard = filterCardByDoctor(card);
      newCard.renderCard();
      newCard.addSpecialDetails();
    });
    
  }

  catch (error) {
    console.error(error);
  }
  finally {
    hideSpinner()
    checkCardsExist();
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
        deleteFromHtml(this.id)
        
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      hideSpinner()
      checkCardsExist()
    }
  }
  /*  */
  addSpecialDetails() {
    console.log("We made it!");
  }
  /* Edit Card*/
  editCard() {

    createModalConfirmBtnEdit()
    const editVisitConfirmBtn = document.getElementById("edit-visit-confirm")
    
    editVisitConfirmBtn.addEventListener('click', (e) => {
      e.preventDefault();

      this.updateCard(createNewVisit())
      deleteModalConfirmBtnEdit()
      clearForm();
    })


  }
  /* UpdateCard */
  async updateCard({ nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age,
    bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit }) {

    try {

      showSpinner()
      const { API_TOKEN, API_URL } = customHttp();
      const API_URL_ID = `${API_URL}/${this.id}`;

      const responsePut = await fetch(API_URL_ID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          nameClient: nameClient || this.nameClient,
          doctor: doctor || this.doctor,
          purposeOfTheVisit: purposeOfTheVisit || this.purposeVisit,
          briefVisitDescr: briefVisitDescr || this.visitDescr,
          urgency: urgency || this.urgency,
          age: age || this.age || "",
          bodyMassIndex: bodyMassIndex || this.bodyMassIndex || "",
          bloodPressure: bloodPressure || this.bloodPressure || "",
          pDCSystem: pastDiseasesCardiovascularSystem || this.pDCSystem || "",
          dateOfLastVisit: dateOfLastVisit || this.dateOfLastVisit || ""
        })
      });


      const updatedCardServer = await checkStatusResponse(responsePut);

      const updatedCardHtml = filterCardByDoctor(updatedCardServer);
      deleteFromHtml(this.id)

      updatedCardHtml.renderCard();
      updatedCardHtml.addSpecialDetails();

    }
    catch (error) {
      console.error(error);
    }
    finally {
      hideSpinner()
    };
  }
  /* Card Template */

  templateCard() {
    const card = `
      <div class="card-element mb-3" style="max-width: 25rem" id="${this.id}" data-doctor='${this.doctor}' data-urgency='${this.urgency}'>
        <div class="card border-warning shadow text-center col-xl" >
          <div class="card-header border-warning bg-dark">
              <h2 class="card-title text-uppercase text-warning">New visit</h2>
              <button type="button" class="btn-close btn-close-white" id="delete-${this.id}"></button>
          </div>
          <div class="card-body">
            <p class="text-uppercase">${this.nameClient}</p>
            <p class="text-uppercase">${this.doctor}</p>
            <button class="btn btn-dark" id="edit-${this.id}" data-bs-toggle="modal"
            data-bs-target="#createVisitModal">
              <span class="text-uppercase text-warning">Edit card</span>
            </button>
            <button class="btn btn-warning" type="button" data-bs-toggle="collapse"
                data-bs-target="#c${this.id}" aria-controls="c${this.id}">
                <span>&#9660;</span>
            </button>
            <div id="c${this.id}" class="collapse">
              <ul class="card-details mt-2 text-start">
                <li>
                  <span class="text-warning">Urgency:</span>
                  <span>${this.urgency}</span>
                </li>
                <li>
                  <span>Purpose of the Visit:</span>
                  <span>${this.purposeVisit}</span>
                </li>
                <li>
                  <span>Visit Description:</span>
                  <span>${this.visitDescr}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>    
      </div>
    `
    return card;
  };
  /* Render Card */
  renderCard() {
    const cardsContent = document.querySelector(".cards-content");
    let fragment = this.templateCard();
    cardsContent.insertAdjacentHTML("afterbegin", fragment);
    this.addEventListener();
  };
  /* Add events on the btns */
  addEventListener() {
    const deleteBtn = document.getElementById(`delete-${this.id}`);
    deleteBtn.addEventListener('click', this.deleteCard.bind(this));

    const editBtn = document.getElementById(`edit-${this.id}`);
    editBtn.addEventListener('click', this.editCard.bind(this));

  }
};
/* Therapist */
class TherapistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.age = age;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Age: ", value: this.age },
    ];
    renderSpecialDetails(detailsElements);
  }
};
/* Cardiologist */
class CardiologistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, bodyMassIndex, bloodPressure, pDCSystem, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.bodyMassIndex = bodyMassIndex;
    this.bloodPressure = bloodPressure;
    this.pDCSystem = pDCSystem;
    this.age = age;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Age: ", value: this.age },
      { text: "Body Mass Index: ", value: this.bodyMassIndex },
      { text: "Blood Pressure: ", value: this.bloodPressure },
      { text: "Cardiovascular system: ", value: this.pDCSystem }
    ];
    renderSpecialDetails(detailsElements);
  }
};
/* Dentist */
class DentistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, dateOfLastVisit }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.dateOfLastVisit = dateOfLastVisit;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Date of last visit: ", value: this.dateOfLastVisit },
    ];
    renderSpecialDetails(detailsElements);
  }
};


/* модальні вікна */

/* вхід */
const logIn = new Modal('logInModal', 'log-in-btn-modal');
const logInModal = logIn.getModalContent();
const logInModalInputs = logIn.getModalInputs();
const logInModalBtn = logIn.getModalConfirmBtn();

const logInDiv = document.querySelector('#log-in-div');
const createVisitDiv = document.querySelector('#create-visit-div');

logIn.listenToInputs(logInModal, logInModalInputs, logInModalBtn);
logInModalBtn.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (logIn.checkInputs(logInModalInputs, logInModalBtn)) {
    logInDiv.classList.toggle('hidden-element');
    createVisitDiv.classList.toggle('hidden-element');
    document.getElementById('filter-conditions').style.display = 'flex';

    getCards();
  } else {
    logIn.addWarning('Please enter your email and password to sign in!');
  }
})

/* форма для створення візиту */
const createVisit = new Modal('createVisitModal', 'create-visit-confirm');

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

  if (createVisit.checkInputs(createVisitInputs, createVisitConfirmBtn)) {
    postCards(createNewVisit());
    clearForm();
    clearSelectFields();
    createVisitConfirmBtn.removeAttribute('data-bs-dismiss', 'modal');
  } else {
    createVisit.addWarning('All mandatory fields must be filled!');
  }
})

/* скасування створення візиту*/
const createVisitCancelBtn = document.getElementById('create-visit-cancel');
createVisitCancelBtn.addEventListener('click', (e) => {
  e.preventDefault();

  clearForm();
  clearSelectFields();

  deleteModalConfirmBtnEdit()
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
  visitForm.classList.add('hidden-element');

}

function clearInputFields() {
  const inputModalFields = document.querySelectorAll('input');
  inputModalFields.forEach(field => {
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
  if (ev.target.classList.contains('modal')) {
    clearForm();
    clearSelectFields();

    deleteModalConfirmBtnEdit()
  }
})


/* фільтрація створених візитів за лікарем*/
doctorsList.addEventListener('change', filterByDoctor);

/* фільтрація створених візитів за терміновістю*/
urgencyList.addEventListener('change', filterByUrgency);


const autocompleteInput = document.getElementById("autocomplete-input");
autocompleteInput.addEventListener("input", function() {
  filterByKeyWord(autocompleteInput);
});
