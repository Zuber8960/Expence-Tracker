let form = document.getElementById('my-form');
let massage = document.querySelector('.msg');
const backendApis = `http://localhost:3000/user`;

form.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.className == 'signup') {
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let obj = { name, email, password };
        // console.log(obj);
        signUp();
        async function signUp() {
            try {
                const responce = await axios.post(`${backendApis}/sign-up`, obj);
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
            } catch (err) {
                console.log(`error ==> `, err);
                document.body.innerHTML += `<div style="color:red; background-color:white; text-align:center;">${err.response.data.message}</div>`;
            }
        }
    }

    if (e.target.className == 'login') {
        return window.location.href = "./login.html";
    }

    if (e.target.className == 'goToLogin') {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let obj = { email, password };
        // console.log(obj);
        login();
        async function login() {
            try {
                const response = await axios.post(`${backendApis}/login`, obj);
                // console.log(response);
                if (response.status == 201) {
                    localStorage.setItem("token", response.data.token);
                    alert(`${response.data.message}`);
                    return window.location.href = "./expence.html";
                } else if (response.status == 204) {
                    massage.innerHTML = response.statusText;
                    return setTimeout(() => {
                        massage.innerHTML = "";
                    }, 2500)
                } else {
                    throw new Error("Failed to login.");
                }
            } catch (err) {
                console.log(err);
                document.body.innerHTML += `<div style="color:red; background-color:white; text-align:center;">${err.response.data.message}</div>`;
            }
        }
    }

    if (e.target.className == 'firstGoSignUp') {
        return window.location.href = "./signup.html";
    }

    if(e.target.className == 'forgotpassword'){
        console.log(`hello forgeotPass`);
        window.location.href = "./forgotpassword/index.html";
    }

});
