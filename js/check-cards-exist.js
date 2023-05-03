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
export function checkCardsExist(cards) {
    if (cards.length === 0) {
        addNoItemsMessage()
    }
    else {
        deleteNoItemsMessage()
    }
};