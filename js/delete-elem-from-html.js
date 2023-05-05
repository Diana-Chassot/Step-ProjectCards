/* Delete element form html */
export function deleteFromHtml(id) {
    const element = document.getElementById(id);
    element.remove();
}