const Expence = require('../models/expence');
const User = require('../models/user');

exports.getAllExpence = (req, res, next) => {
    console.log('getAllExpences');

    let bag = [];
    User.findAll({ include : ['expences']})
    .then(data => {
        // console.log(data);
        data.forEach(user => {
            let total_amount = 0;
            user.expences.forEach(exp => {
                total_amount += exp.amount;
            })
            // console.log(user.name, `==>`,total_amount);
            bag.push({name : user.name , total_amount: total_amount});
        });
    })
    .then(() => {
        sort(bag);
        // console.log(bag);
        res.status(201).json({success : true, data : bag});
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({success : false, error : err});
    });
    // let bag = [];
    // User.findAll()
    // .then((users) => {
    //     // console.log(users);
    //     users.forEach((user) => {
    //         user.getExpences()
    //         .then( async (exp) => {
    //             let expTotal = 0;
    //             await exp.forEach(data => {
    //                 expTotal += data.amount;
    //             });
    //             // console.log(`expense of user =>${user.name}` , expTotal);
    //             bag.push({
    //                 id : user.id,
    //                 name : user.name,
    //                 total_amount : expTotal
    //             });
    //             if(bag.length == users.length){
    //                 sort(bag);
    //                 console.log(bag);
    //                 res.status(201).json({success : true, data : bag})
    //             }
    //         })
            
    //     });
    // })
    
}


function sort(array){
    let i=0;
    while(i<array.length-1){
        if(array[i].total_amount < array[i+1].total_amount){
            [array[i], array[i+1]] = [array[i+1], array[i]];
            i=0;
            continue;
        }
        i++;
    }
}