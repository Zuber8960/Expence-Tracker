const Expence = require('../models/expence');

exports.addExpence = async (req, res, next) => {
    const data = req.body;
    // console.log(data);
    if(data.amount == "" || data.description == "" || data.categary == ""){
        return  res.status(201).json({ success: false , message : `Please fill all feilds !` });
    }
    try {
        const expence = await Expence.create({
            amount: data.amount,
            description: data.description,
            categary: data.categary
        })
        return res.status(201).json({ success: true, expence });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
}

exports.getExpence = async (req, res, next) => {
    try {
        const expences = await Expence.findAll();
        // console.log(`abc`, expences);
        res.status(200).json({ success: true, expences });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
}

exports.deleteExpence = async (req, res, next) => {
    const id = req.params.id;
    try {
        const exp = await Expence.findByPk(id);
        const result = await exp.destroy();
        // console.log(`result ==>`, result);
        res.status(200).json({ success: true , message: `Expence deleted successfully !` })
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false , error: err });
    }
}