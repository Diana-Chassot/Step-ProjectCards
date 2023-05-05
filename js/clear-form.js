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

export { clearInputFields, clearSelectFields }