export function filterByKeyWord(autocompleteInput) {
 
    let  filter, cardElements, card, txtValue;
    
    filter = autocompleteInput.value.toUpperCase();
    cardElements = document.getElementsByClassName("card-element");
  
    for (let i = 0; i < cardElements.length; i++) {
      card = cardElements[i];
      txtValue = card.textContent || card.innerText;
      
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    }
  }