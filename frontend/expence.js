let form = document.getElementById('my-form');


// //after refresh take all data from server to UI
// window.addEventListener('DOMContentLoaded', async () => {
//     // try {
//     //     let promise = await axios.get("https://crudcrud.com/api/8d729f6bc3fd47f5847ff201f2f6a3ff/expence");

//     //     promise.data.forEach((ele) => {
//     //         showNewUserOnscreen(ele);
//     //     })
//     // } catch (err) {
//     //     console.log(err);
//     // }
// })



form.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.className == 'signup'){
        console.log('ok');
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let passward = document.getElementById('passward').value;
        let massage = document.querySelector('.msg');
        
        if (name == "" || email == "" || passward == "") {
            massage.innerHTML = "Please fill all feilds !"
            return setTimeout(() => {
                massage.innerHTML = "";
            }, 2000);
        }
        let obj = { name, email, passward };
        console.log(obj);
        axios.post('http://localhost:3000/user/sign-up', obj)
            .then(responce => {
                if (responce.status === 201) {
                    // console.log(responce.data);
                    window.location.href = "./login.html"
                } else {
                    throw new Error("Failed to login.");
                }
            })
            .catch(err => {
                console.log(err);
                document.body.innerHTML += `<div style="color:red; background-color:white;">${err}</div>`;
            });
    }
});


