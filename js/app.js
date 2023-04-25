function customHttp() {
  const API_TOKEN = "7230c3ef-1075-4f6e-bdbd-9c4639644533";
  const API_URL = "https://ajax.test-danit.com/api/v2/cards";
  return { API_TOKEN, API_URL };
}
function postCards() {
  const { API_TOKEN, API_URL } = customHttp();
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      nameClient: "here will be data",
      nameDoctor: "here will be data",
      briefVisitDesc: "here will be data",
      urgency: "here will be data"
    })
  })
    .then(response => checkStatusResponse(response))
    .then(data => console.log(data))
}

function getCards() {
  const { API_TOKEN, API_URL } = customHttp();
  fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
  })
    .then(response => checkStatusResponse(response))
    .then(cards => {
      cards.forEach(cardItem => {
        const card = new Card(cardItem);
        card.renderCard();
        console.log(card)
      })

    })
}
getCards()
function checkStatusResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error');
  }
};
class Card {
  constructor({ nameClient, nameDoc, briefVisitDescr, urgency, id }) {
    this.nameClient = nameClient;
    this.nameDoctor = nameDoc;
    this.briefVisitDescription = briefVisitDescr;
    this.urgency = urgency;
    this.id = id ;

   /*  this.deleteBtn = this.queryselector(".")
    this.editBtn = this.queryselector(".")

    this.deleteBtn.addEventListener("click", this.deleteCard.bind(this))
    this.editBtn.addEventListener("click", this.editCard.bind(this)) */

  }
  deleteCard() {
    fetch("https://ajax.test-danit.com/api/v2/cards/1", {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  editCard() {
    // Обработчик события для кнопки редактирования
  }

  templateCard() {
    const card = `
    <div class="col-xl" style="max-width: 15rem">
      <div class="card border-warning text-center" id="${this.id}">
        <div class="card-header border-warning bg-dark">
          <h2 class="card-title text-uppercase text-warning">New visit</h2>
          <button type="button" class="btn-close btn-delete "></button>
        </div>
        <div class="card-body">
          <p class="card-subtitle mb-2 text-body-secondary">${this.nameClient}</p>
          <p class="card-text">${this.nameDoctor}</p>
          <div>
            <button class="btn">
              <span class="text-uppercase text-warning">Edit card</span>
            </button>
            <button class="btn btn-sm btn-warning" type="button" data-bs-toggle="collapse"
              data-bs-target="#c${this.id}" aria-expanded="false"
              aria-controls="c${this.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                class="bi bi-arrow-down-square" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
              </svg>
            </button>
          </div>
          <div id="c${this.id}" class="collapse">
            <div class="card-more-info">
              контент карточки, который будет показан при
              раскрытии.
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    return card
  }
  renderCard() {
    const cardsContent = document.querySelector(".cards-content");

    let fragment = this.templateCard();
    cardsContent.insertAdjacentHTML("afterbegin", fragment)
  }
}
