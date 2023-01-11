let form = document.getElementById('my-form');
const list = document.getElementById('lists');
const backendApis = `http://localhost:3000`;
const massage = document.querySelector('.msg');
const token = localStorage.getItem("token");
const rzrPay = document.querySelector('#rzr-pay');
const header = document.querySelector('header');
// console.log(token);

window.addEventListener('DOMContentLoaded', async () => {
    console.log(`abc`);
    try {
        const result = await axios.get(`${backendApis}/expence/get-expence`, { headers: { "Authorization": token } });
        console.log(result);
        if (result.data.isPremiumUser) {
            rzrPay.style.display = 'none';
            const h2 = document.createElement('h2');
            h2.innerHTML = `👍 Great ! You are a premium user now.`
            header.appendChild(h2);
        }
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

            rzrPay.style.display = 'none';
            const h2 = document.createElement('h2');
            h2.innerHTML = `👍 Great ! You are a premium user now.`
            header.appendChild(h2);

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