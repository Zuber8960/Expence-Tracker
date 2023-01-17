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
const downloadFilesButton = document.getElementById('showDownloadedFile');
const divForFiles = document.getElementById('bucket');
const pagination = document.getElementById('pagination');
const premiumDiv = document.getElementById('forPremium');

// console.log(token);
const numberOfRows = localStorage.getItem('numberOfRows');

window.addEventListener('DOMContentLoaded', async () => {
    console.log(`abc`);
    try {
        const page = 1;
        const result = await axios.post(`${backendApis}/expence/get-expence?page=${page}`, { numberOfRows: numberOfRows } , { headers: { "Authorization": token } } );

        document.getElementById('rows').value = numberOfRows;
        // console.log(result);
        if (result.data.isPremium) {
            premiumUserFunction();
        } else {
            rzrPay.style.display = "block";
        }
        
        logout();

        showUserName(result.data.name);
        if(!result.data.expences.length){
            document.getElementById('perPage').style.display = 'none';
            return;
        }
        result.data.expences.forEach(element => {
            // console.log(element);
            showExpenseOnScreen(element);
        });
        showPagination(result.data);

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
    li.className = 'litag';
    li.innerHTML = `${obj.amount} - ${obj.description} - ${obj.categary}`;
    const del = document.createElement('button');
    del.className = "delete";
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
    leaderBoard.style.display = "block";
    downloadButton.style.display = "block";
    downloadFilesButton.style.display = "block";

    const h3 = document.createElement('h3');
    h3.innerHTML = `👍 Great ! You are a premium user now.`
    premiumDiv.appendChild(h3);
}


const div = document.createElement('div');
section.appendChild(div);

leaderBoard.addEventListener('click', () => {
    // // console.log('hello leaderboard');

    if (leaderBoard.innerText != "Hide Leaderboard") {
        leaderBoard.innerText = "Hide Leaderboard";
        const h4 = document.createElement('h4');
        h4.innerText = "LeaderBoard ------";
        const ul = document.createElement('ol');
        ul.setAttribute('id', 'ulList');
        ul.style.width = "500px";
        div.appendChild(h4);
        div.appendChild(ul);
        showList();
    } else{
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
            li.className = "litag"
            li.innerHTML = `<b>Name : ${data.name} , Total-Expence : ${data.total_amount}</b>`;
            ulTag.appendChild(li);
        })
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div class="error">Oops! Something went wrong.</div>`;
    }
}


function showUserName(name) {
    const userName = document.createElement('label');
    userName.innerText = name;
    userName.setAttribute('id', 'userName');
    premiumDiv.appendChild(userName);   
}



async function downloadExpence() {
    try {
        const response = await axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } });
        if (response.status === 200) {
            console.log(response);
            let a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpence.csv';
            a.click();
            console.log(`file downloaded`);
        } else {
            throw new Error(response.data.message);
        }
    }
    catch (err) {
        document.body.innerHTML += `<div class="error">Oops! Something went wrong.</div>`;
        throw new Error(err);
    };
}


async function previousfileDownloaded() {
    if (downloadFilesButton.innerText != "Hide Files") {
        downloadFilesButton.innerText = "Hide Files";
        try {
            const responce = await axios.get(`${backendApis}/user/oldFiles`, { headers: { 'Authorization': token } });
            if (responce.status == 200) {
                const ul = document.createElement('ul');
                ul.style.width = "200px";
                divForFiles.appendChild(ul);
                if (!responce.data.allFiles.length) {
                    ul.innerHTML = `<b>No files Exist !</b>`;
                    return;
                }
                responce.data.allFiles.forEach(file => {
                    const li = document.createElement('li');
                    li.className = 'litag';
                    const date = file.createdAt.split('T')[0].split('-').reverse().join('-');
                    li.innerHTML = `<b>${date} - <a href="${file.fileURL}">Details</a></b>`;
                    ul.appendChild(li);
                })
            } else {
                throw new Error(err);
            }

        } catch (err) {
            console.log(err);
            document.body.innerHTML += `<div class="error">Oops! Something went wrong.</div>`;
        }
    } else if (downloadFilesButton.innerText == "Hide Files") {
        downloadFilesButton.innerText = "Show Download Files";
        divForFiles.innerHTML = "";
    }
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage ,
    previousPage ,
    lastPage ,
}) {
    pagination.innerHTML = "" ;
    if(currentPage !=1 && previousPage!=1){
        const btn = document.createElement('button');
        btn.innerText = 1;
        btn.className = "pegination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(1);
        })
        const span = document.createElement('span');
        span.innerText = '......';
        pagination.appendChild(btn);
        pagination.appendChild(span);
    } 
    if(hasPreviousPage){
        const btn = document.createElement('button');
        btn.innerText = previousPage;
        btn.className = "pegination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(previousPage);
        })
        pagination.appendChild(btn);
    }
    const btn2 = document.createElement('button');
    btn2.className = "pegination";
    btn2.innerHTML = `<h3>${currentPage}</h3>`;
    btn2.addEventListener('click' , () => {
        list.innerHTML = "";
        gettingAllExpence(currentPage);
    })
    pagination.appendChild(btn2);
    if(hasNextPage){
        const btn = document.createElement('button');
        btn.innerText = nextPage;
        btn.className = "pegination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(nextPage);
        })
        pagination.appendChild(btn);
    }
    if(nextPage != lastPage && currentPage != lastPage){
        const btn = document.createElement('button');
        btn.innerText = lastPage;
        btn.className = "pegination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(lastPage);
        })
        const span = document.createElement('span');
        span.innerText = '......';
        pagination.appendChild(span);
        pagination.appendChild(btn);
    } 
}


async function gettingAllExpence(page){
    const result = await axios.post(`${backendApis}/expence/get-expence?page=${page}` , { numberOfRows: numberOfRows } , { headers: { "Authorization": token } });

    result.data.expences.forEach(element => {
        // console.log(element);
        showExpenseOnScreen(element);
    });
    showPagination(result.data);

}

const row = document.getElementById('setRows');

row.addEventListener('click' , () => {
    const numberOfRow = document.getElementById('rows').value;
    localStorage.setItem('numberOfRows' , numberOfRow);
    return window.location.reload();
})

function logout(){
    const div = document.createElement('div');
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.className = 'logout';
    div.appendChild(logoutButton);
    section.appendChild(div);
}


section.addEventListener('click' , (e) => {
    if(e.target.className == 'logout'){
        localStorage.removeItem('token');
        localStorage.removeItem('numberOfRows');
        return window.location.href = './login.html';
    }
})

