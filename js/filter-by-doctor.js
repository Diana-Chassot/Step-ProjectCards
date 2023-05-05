
const doctorsList = document.getElementById('doctor-filter');

function filterByDoctor() {
    const cardsAll = Array.from(document.getElementById('all-cards').children);
    cardsAll.forEach(card => {
        card.style.display = '';

        if(doctorsList.value === 'doctors') {
            card.style.display = '';
        } else if(doctorsList.value !== card.dataset.doctor) {
            card.style.display = 'none';
        }
    })
}

export { doctorsList, filterByDoctor }