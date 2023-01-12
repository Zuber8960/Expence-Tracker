const Expence = require('../models/expence');

exports.addExpence = async (req, res, next) => {
    // console.log('ok not found');
    const data = req.body;
    // console.log(`data` , req.user);
    console.log(`id ==> ` , req.user.id);

    if(data.amount == "" || data.description == "" || data.categary == "categary"){
        return  res.status(201).json({ success: false , message : `Please fill all feilds !` });
    }else if(data.amount <= 0){
        return  res.status(201).json({ success: false , message : `Please enter valid amount !` });
    }
    try {
        const expence = await Expence.create({
            amount: data.amount,
            description: data.description,
            categary: data.categary,
            userId : req.user.id
        })
        return res.status(201).json({ success: true, expence });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

exports.getExpence = async (req, res, next) => {
    try {
        console.log(req.user.isPremiumUser);
        const expences = await Expence.findAll({where : { userId : req.user.id}});
        // const expences = await Expence.findAll();

        // console.log(`abc`, expences);
        res.status(200).json({ success: true, expences , user: req.user});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

exports.deleteExpence = async (req, res, next) => {
    const id = req.params.id;
    // console.log(`user ==>`,req.user)
    if(!id){
        return res.status(404).json({ success: false , message : `id is missing.` });
    }
    try {
        const exp = await Expence.findAll({ where : { userId : req.user.id , id : id}})
        // console.log(`data ==>`, exp);
        // const exp = await data.findByPk(id);
        // console.log(`exp ==>` , exp);
        if(!exp){
            return res.status(404).json({ success: false , message : `Expence doesn't exist.` });
        }
        const result = await exp[0].destroy();
        // console.log(`result ==>`, result);
        res.status(200).json({ success: true , message: `Expence deleted successfully !` })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false , error: err });
    }
}