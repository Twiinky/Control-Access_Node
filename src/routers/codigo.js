const express = require ('express');
const router = express.Router();
const Codigo = require('../models/Codigo');
const qrcode = require('qrcode');
const fs = require('fs');
const { isAuthenticated } = require('../helpers/auth');

router.get('/codigo/add', isAuthenticated , (req,res) => {
    res.render('codigo/new-codigo');
});

router.post('/codigo/new-codigo', isAuthenticated , async (req,res) => {
    const {tipovehiculo, descripcion} = req.body;
    const errores = [];
    if(!tipovehiculo){
        errores.push({text: "Porfavor escribe un tipo de vehiculo"});
    }
    if(!descripcion){
        errores.push({text: "Porfavor ingresa una descripcion"});
    }
    if(errores.length>0){
        res.render('codigo/new-codigo', {
            errores,
            tipovehiculo,
            descripcion
        });
    }else{
        const newCodigo = new Codigo ({tipovehiculo,descripcion});
        newCodigo.user = req.user.id;
        await newCodigo.save();
        req.flash('success_msg', 'Vehiculo guardado');
        res.redirect('/codigo');
    }
});
router.get('/codigo', isAuthenticated , async (req,res) => {
    const codigo = await Codigo.find({user: req.user.id}).sort({date: 'desc'});
    qrcode.toDataURL(req.user.id, function (err, url) {
        //res.render('codigo/qrcode' , { url });
        res.render('codigo/all-codigos' , { codigo , url });
      });
    
    
});

router.get('/url', isAuthenticated, async (req,res) => {
    qrcode.toDataURL(req.user.id, function (err, url) {
        res.render('codigo/qrcode' , { url });
      });
});

router.get('/codigo/edit/:id', isAuthenticated, async (req,res) => {
    const codigo = await Codigo.findById(req.params.id);
    res.render('codigo/edit-codigo' , {codigo});
});

router.put('/codigo/edit-codigo/:id', isAuthenticated , async (req,res) =>{
    const {tipovehiculo, descripcion} = req.body;
    await Codigo.findByIdAndUpdate(req.params.id,{tipovehiculo,descripcion});
    req.flash('success_msg', 'Vehiculo editado');
    res.redirect('/codigo');
});

router.delete('/codigo/eliminar/:id',isAuthenticated, async (req,res) => {
    await Codigo.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Vehiculo elimanado');
    res.redirect('/codigo');
});
module.exports = router;