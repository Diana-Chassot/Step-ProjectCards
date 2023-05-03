/* render Speciall Details */
export function renderSpecialDetails(detailsElements) {
    const cardDetails = document.querySelector(".card-details");
    detailsElements.forEach((element) => {
        const template = `
        <li><span>${element.text}</span>${element.value}</li>
        `
        cardDetails.insertAdjacentHTML("beforeend", template)
    });
};