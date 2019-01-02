const express = require ('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin' , (req,res) => {
    res.render('users/signin');
});

router.post('/users/signin' , passport.authenticate('local', {
    successRedirect: '/codigo',
    failureRedirect: '/users/signin',
    failureFlash: true

}));

router.get('/users/signup' , (req,res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {nombre,email,password,confirm_password} = req.body;
    const errores = [];
    if(nombre <=0){
        errores.push({text: 'El nombre debe tener minimo 1 caracter'});
    }
    if(password != confirm_password){
        errores.push({text: 'Las contraseñas no coinsiden'});
    }
    if(password.length < 4){
        errores.push({text: 'La contraseña debe ser de tamaño minimo 4'});
    }
    if(errores.length >0 ){
        res.render('users/signup', {errores,nombre,email,password,confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','El correo ya esta registrado');
            res.redirect('/users/signup');
        }
        const newUser= new User({nombre,email,password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout' , (req,res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;