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
    };
};

/* Check if cards exist  */
export function checkCardsExist() {
    const container = document.querySelector('.cards-content');
    const cardElements = container.querySelectorAll('.card-element');

    if (cardElements.length === 0) {
        addNoItemsMessage()
    }
    else {
        deleteNoItemsMessage()
    }
};