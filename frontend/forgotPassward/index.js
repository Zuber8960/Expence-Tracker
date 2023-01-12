const form = document.querySelector('form');

form.addEventListener('click' , (e) => {
    e.preventDefault();
    if(e.target.className == 'forgotPassward'){
        const email = document.getElementById('email').value;
        console.log(email);
        const userEmail = {email};
        axios.post(`http://localhost:3000/passward/forgotPassward`,userEmail)
        .then(responce => {
            if(responce.status == 202){
                console.log('forgotPassward successfull');
                console.log(responce);
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