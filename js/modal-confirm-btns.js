export function createModalConfirmBtnEdit(){
    const btnsContainer = document.querySelector(".visit-form-btns");
    
    const createVisitBtn = document.getElementById("create-visit-confirm");
    createVisitBtn.style.display ="none"

    const editVisitConfirmBtn = document.createElement("button");
    editVisitConfirmBtn.textContent = "Edit";
    editVisitConfirmBtn.id = "edit-visit-confirm" ;
    editVisitConfirmBtn.classList =`btn btn-warning`;
    editVisitConfirmBtn.setAttribute('data-bs-dismiss', 'modal');
    btnsContainer.appendChild(editVisitConfirmBtn);

};

export function deleteModalConfirmBtnEdit(){
    const editVisitConfirmBtn = document.getElementById("edit-visit-confirm");
    const createVisitBtn = document.getElementById("create-visit-confirm");
   
    if(editVisitConfirmBtn){
        editVisitConfirmBtn.remove() 
        createVisitBtn.style.display ="inline-block"
    }
    
}