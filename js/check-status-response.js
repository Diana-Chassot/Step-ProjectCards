/* CheckStatusResponse */
export function checkStatusResponse(response) {
    if (response.ok) {
    return response.json();
    } 
    else {
    throw new Error('Error');
    }
};