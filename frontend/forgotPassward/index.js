const form = document.querySelector('form');

form.addEventListener('click' , (e) => {
    e.preventDefault();
    if(e.target.className == 'forgotPassward'){
        let email = document.getElementById('email').value;
        console.log(email);
        const userEmail = {email};
        axios.post(`http://localhost:3000/passward/forgotPassward`,userEmail)
        .then(responce => {
            if(responce.status == 202){
                document.body.innerHTML += '<div class="error">Mail Successfuly sent <div>'
                document.getElementById('email').value = null;
            }else{
                throw new Error(err);
            }
        })
        .catch(err => {
            console.log(err);
            document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        });
    }

})