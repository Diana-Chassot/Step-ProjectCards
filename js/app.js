
/* CustomHttp */
function customHttp() {

  const API_TOKEN = "7824dd3b-6167-4226-8604-be4289acc8b1";
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
      <div class="card-element mb-3" style="max-width: 25rem">
        <div class="card border-warning shadow text-center col-xl " id="${this.id}">
          <div class="card-header border-warning bg-dark">
              <h2 class="card-title text-uppercase text-warning">New visit</h2>
              <button type="button" class="btn-delete btn-close btn-close-white"></button>
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

/* модальні вікна */
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

class Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency) {
        this.nameClient = nameClient,
        this.doctor = doctor,
        this.purposeOfTheVisit = purposeOfTheVisit,
        this.briefVisitDescr = briefVisitDescr,
        this.urgency = urgency
    }
}

class VisitTherapist extends Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age) {
        super(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency),
        this.age = age
    }
}

class VisitCardiologist extends Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem) {
        super(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency),
        this.age = age,
        this.bodyMassIndex = bodyMassIndex,
        this.bloodPressure = bloodPressure,
        this.pastDiseasesCardiovascularSystem = pastDiseasesCardiovascularSystem
    }
}

class VisitDentist extends Visit {
    constructor(nameClient, doctor, briefVisitDescr, urgency, dateOfLastVisit) {
        super(nameClient, doctor, briefVisitDescr, urgency),
        this.dateOfLastVisit = dateOfLastVisit
    }
}

function createNewVisit() {
    let newVisit;

    if (doctorSelect.value === 'therapist') {
        newVisit = new VisitTherapist(
            document.getElementById('visit-patient').value,
            document.getElementById('doctor').value,
            document.getElementById('visit-purpose').value,
            document.getElementById('visit-description').value,
            document.getElementById('urgency').value,
            document.getElementById('visit-age').value
        )
    }

    if (doctorSelect.value === 'dentist') {
        newVisit = new VisitDentist(
            document.getElementById('visit-patient').value,
            document.getElementById('doctor').value,
            document.getElementById('visit-purpose').value,
            document.getElementById('visit-description').value,
            document.getElementById('urgency').value,
            document.getElementById('visit-last').value
        )
    }

    if (doctorSelect.value === 'cardiologist') {
        newVisit = new VisitCardiologist(
            document.getElementById('visit-patient').value,
            document.getElementById('doctor').value,
            document.getElementById('visit-purpose').value,
            document.getElementById('visit-description').value,
            document.getElementById('urgency').value,
            document.getElementById('visit-age').value,
            document.getElementById('visit-BMI').value,
            document.getElementById('visit-normal-pressure').value,
            document.getElementById('visit-heart-diseases').value
        )
    }

    const {nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit} = newVisit;
    return {nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit}
}

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