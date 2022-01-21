//Display message to the user
function getMessage(){
    let userMessage = document.getElementById("message").value;
    Swal.fire(
        'The App Title',
        userMessage,
        'success'
    );
}