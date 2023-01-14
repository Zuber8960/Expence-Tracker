let form = document.getElementById('my-form');
const list = document.getElementById('lists');
const backendApis = `http://localhost:3000`;
const massage = document.querySelector('.msg');
const token = localStorage.getItem("token");
const rzrPay = document.querySelector('#rzr-pay');
const leaderBoard = document.querySelector('#leaderboard');
const header = document.querySelector('header');
const section = document.querySelector('.container');
const downloadButton = document.getElementById('downloadexpense');

// console.log(token);

window.addEventListener('DOMContentLoaded', async () => {
    console.log(`abc`);
    try {
        const result = await axios.get(`${backendApis}/expence/get-expence`, { headers: { "Authorization": token } });
        console.log(result);
        if (result.data.user.isPremiumUser) {
            premiumUserFunction();
        } else {
            leaderBoard.style.display = "none";
            downloadButton.style.display = "none";
        }
        showUserName(result.data.user);
        result.data.expences.forEach(element => {
            // console.log(element);
            showExpenseOnScreen(element);
        });
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div class="error">Something went wrong</div>`;
    }
})

form.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target.className == "expence") {
        const amount = e.target.parentNode.amount;
        const description = e.target.parentNode.description;
        const categary = e.target.parentNode.categary;

        const obj = {
            amount: amount.value,
            description: description.value,
            categary: categary.value
        };
        console.log(obj);

        try {
            const expence = await axios.post(`${backendApis}/expence/add-expence`, obj, { headers: { 'Authorization': token } });
            console.log(expence.data);
            if (!expence.data.success) {
                massage.innerHTML = expence.data.message;
                return setTimeout(() => {
                    massage.innerHTML = "";
                }, 2000);
            }
            showExpenseOnScreen(expence.data.expence);
            amount.value = null;
            description.value = null;
            categary.value = `categary`;

        } catch (err) {
            console.log(err);
            document.body.innerHTML += `<div class="error">Something went wrong</div>`;
        }
    }
})

list.addEventListener('click', async (e) => {
    if (e.target.className == "delete") {
        if (confirm(`Are you sure !`)) {
            try {
                const li = e.target.parentNode;
                const id = li.id;
                // console.log(id);
                const responce = await axios.post(`${backendApis}/expence/delete-expence/${id}`, {}, { headers: { 'Authorization': token } });
                console.log(responce);
                list.removeChild(li);
            } catch (err) {
                console.log(err);
                document.body.innerHTML += `<div class="error">Oops! Something went wrong.</div>`;
            }
        }
    }
})

const showExpenseOnScreen = (obj) => {
    let li = document.createElement('li');
    li.setAttribute('id', obj.id);
    li.innerHTML = `${obj.amount} - ${obj.description} - ${obj.categary}`;
    const del = document.createElement('button');
    del.classList.add("delete");
    del.innerText = "Delete";
    li.appendChild(del);
    list.appendChild(li);
}


rzrPay.addEventListener('click', async (e) => {
    // e.preventDefault();
    console.log('Hello rzr-pay');
    const responce = await axios.get(`${backendApis}/purchase/prmiumMembership`, { headers: { 'Authorization': token } });

    console.log(responce);
    let options = {
        key: responce.data.key_id,
        order_id: responce.data.order.id,
        handler: async function (responce) {
            const result = await axios.post(`${backendApis}/purchase/udateTransection`, {
                order_id: options.order_id,
                payment_id: responce.razorpay_payment_id,
                transaction: true
            }, { headers: { 'Authorization': token } })
            console.log(result);

            premiumUserFunction();
            leaderBoard.style.display = "block";

            alert('You are now premium user now.');
        }
    }

    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();

    rzpl.on('payment.failed', async function (responce) {
        console.log(responce);
        const result = await axios.post(`${backendApis}/purchase/udateTransection`, {
            order_id: options.order_id,
            payment_id: responce.razorpay_payment_id,
            transaction: false
        }, { headers: { 'Authorization': token } });
        alert('Something went wrong !');
        rzpl.close();

    })

})

function premiumUserFunction() {
    rzrPay.style.display = 'none';
    const h3 = document.createElement('h3');
    h3.innerHTML = `👍 Great ! You are a premium user now.`
    header.appendChild(h3);
}


const div = document.createElement('div');
leaderBoard.addEventListener('click', () => {
    // // console.log('hello leaderboard');

    if (leaderBoard.innerText == "Show Leaderboard") {
        leaderBoard.innerText = "Hide Leaderboard";
        div.innerHTML = "";

        const h4 = document.createElement('h4');
        h4.innerText = "LeaderBoard";
        const ul = document.createElement('ul');
        ul.setAttribute('id', 'ulList');
        div.appendChild(h4);
        div.appendChild(ul);
        section.appendChild(div);
        showList();
    } else if (leaderBoard.innerText == 'Hide Leaderboard') {
        leaderBoard.innerText = "Show Leaderboard";
        div.innerHTML = "";
    }
})


async function showList() {
    try {
        const result = await axios.get(`${backendApis}/premium/show-leaderBoard`);
        // console.log(result);
        const ulTag = document.getElementById('ulList');
        result.data.data.forEach(data => {
            console.log(data);
            const li = document.createElement('li');
            li.innerHTML = `Name : ${data.name} , Total-Amount : ${data.total_amount}`;
            ulTag.appendChild(li);
        })
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div class="error">Oops! Something went wrong.</div>`;
    }
}


function showUserName(user) {
    const userName = document.createElement('label');
    userName.innerText = user.name;
    userName.setAttribute('id', 'userName');
    header.appendChild(userName);
}



function downloadExpence(){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            console.log(response);
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}