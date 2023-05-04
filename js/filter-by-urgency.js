
const urgencyList = document.getElementById('urgency-filter');

function filterByUrgency() {
    const cardsAll = Array.from(document.getElementById('all-cards').children);
    cardsAll.forEach(card => {
        card.style.display = '';

        if(urgencyList.value === 'urgency') {
            card.style.display = '';
        } else if(urgencyList.value !== card.dataset.urgency) {
            card.style.display = 'none';
        }
    })
}

export { urgencyList, filterByUrgency }