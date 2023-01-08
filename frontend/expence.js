let form = document.getElementById('my-form');
const list = document.getElementById('lists');
const backendApis = `http://localhost:3000/expence`;
const massage = document.querySelector('.msg');

window.addEventListener('DOMContentLoaded', async () => {
    console.log(`abc`);
    try {
        const result = await axios.get(`${backendApis}/get-expence`);
        // console.log(result);
        result.data.expences.forEach(element => {
            console.log(element);
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
            const expence = await axios.post(`${backendApis}/add-expence`, obj);
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
                const responce = await axios.post(`${backendApis}/delete-expence/${id}`);
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
    delEdit(li);
    list.appendChild(li);
}


const delEdit = (li) => {
    const del = document.createElement('button');
    del.classList.add("delete");
    del.innerText = "Delete";
    const edit = document.createElement('button');
    edit.classList.add('edit');
    edit.innerText = "Edit";
    li.appendChild(del);
    li.appendChild(edit);
}