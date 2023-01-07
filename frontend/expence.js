let form = document.getElementById('my-form');
let massage = document.querySelector('.msg');

form.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.className == 'signup') {
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let passward = document.getElementById('passward').value;

        let obj = { name, email, passward };
        console.log(obj);
        axios.post('http://localhost:3000/user/sign-up', obj)
            .then(responce => {
                // console.log('ok');
                if (responce.status === 201) {
                    return window.location.href = "./login.html";
                } else if (responce.status == 200) {
                    // console.log(responce)
                    massage.innerHTML = responce.data.message;
                    return setTimeout(() => {
                        massage.innerHTML = "";
                    }, 2000);
                } else {
                    throw new Error("Failed to login.");
                }
            })
            .catch(err => {
                console.log(`error ==> `, err);
                document.body.innerHTML += `<div style="color:red; background-color:white; text-align:center;">${err.response.data.message}</div>`;
            });
    }

    if (e.target.className == 'login') {
        return window.location.href = "./login.html";
    }

    if (e.target.className == 'goToLogin') {
        let email = document.getElementById('email').value;
        let passward = document.getElementById('passward').value;
        let obj = { email, passward };
        console.log(obj);
        axios.post(`http://localhost:3000/user/login`, obj)
            .then(response => {
                console.log(response);
                if (response.status == 201) {
                    if (response.data.error) {
                        massage.innerHTML = response.data.message;
                        return setTimeout(() => {
                            massage.innerHTML = "";
                        }, 2000);
                    }
                    return alert(`${response.data.message}`);
                }
            })
            .catch(err => {
                console.log(err);
                document.body.innerHTML += `<div style="color:red; background-color:white; text-align:center;">${err.response.data.message}</div>`;
            });
    }

    if (e.target.className == 'firstGoSignUp') {
        return window.location.href = "./expence.html";
    }
});


