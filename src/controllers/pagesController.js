const userModel = require('../models/adminModel');
const compteModel = require('../models/compteModel');

const { response } = require('express');

exports.displayHome = (req, res) =>{
    res.render('page/home');
}

exports.displayConnexForm = (req, res) =>{
    res.render('page/connexForm');
}
exports.displayConnexFormAdmin = (req, res) =>{
    res.render('page/connexFormAdmin');
}
exports.displayRegisterForm = (req, res) =>{
    res.render('page/registerForm');
}

exports.displayVirementForm = (req, res) =>{
    res.render('page/virementForm', {
        infosClient: req.session.infosClient,
        listComptes: req.session.listComptes
    });
}
exports.displayFormModifyUser = (req, res) =>{
    userModel.getOneUser(req.body.name).then( user =>{
        res.render('page/formModifyUser', {
            user,
            message : "Vous pouvez modifier les informations de " + user.name
        });
    })
    
}

exports.displayDashBoard = (req, res) => {
    res.render('page/dashboard', {
        infosClient: req.session.infosClient,
        listComptes: req.session.listComptes,
        listOperations: req.session.listOperations
    });   
 
}   
exports.displayDashBoardAdmin = (req, res) => {
    res.render('page/dashboardAdmin', {
        infosAdmin: req.session.infosAdmin,
        message: req.session.message,
        listClients: req.session.listClients,
        listComptes: req.session.listComptes,
        listOperations: req.session.listOperations
    });   
 
}   

exports.displayInfosClient = (req, res) =>{
    res.render('page/infosClient', {
        infosClient: req.session.infosClient,
    })
}

exports.displayMenuClient = (req, res) => {
    res.render('page/menuClients', {
        infosAdmin: req.session.infosAdmin,
        listClients: req.session.listClients
    })
}

exports.displayMenuComptes = (req, res) => {
    res.render('page/menuComptes', {
        infosAdmin: req.session.infosAdmin,
        listClients: req.session.listClients,
        listComptes: req.session.listComptes
    })
}

exports.displayMenuOperations = (req, res) => {
    res.render('page/menuOperations', {
        infosAdmin: req.session.infosAdmin,
        listOperations: req.session.listOperations
    })
}