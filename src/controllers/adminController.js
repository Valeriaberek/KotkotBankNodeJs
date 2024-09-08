const adminModel = require('../models/adminModel');
const compteModel = require ('../models/compteModel')
const bcrypt = require('bcrypt');

exports.displayDashBoardAdmin = async (req, res) => {
    admin = req.body;
    await adminModel.getInfo(admin.email).then(async infosAdmin =>{ //browse email in the collection utilisateurs
        if(bcrypt.compareSync(admin.password, infosAdmin.password)){ // test if the passwords matched
            let listComptes = []; 
            let listClients = []
            let listOperations = [];

            await adminModel.getAll('utilisateurs').then(async clients =>{
                listClients = clients;
                await adminModel.getAll('compte').then( async comptes =>{ // browse comptes of the client
                    listComptes = comptes;  
                    await adminModel.getAll('operations').then( operations =>{ // browse operations of the client
                        listOperations = operations;  
                        listOperations.sort(function compare(a, b) { // sort the oprations by date 
                            if (a.dateOperation < b.dateOperation)
                            return -1;
                            if (a.dateOperation > b.dateOperation )
                            return 1;
                            return 0;
                        
                        })
                    
                    });
                    let date = new Date();
                    let today = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                    await compteModel.updateConnexion(infosAdmin._id.toString(), today, "admins").then( ()=> {
                        req.session.regenerate(function (err) {
                            if (err) next(err)
                        
                            req.session.isAdmin = true;
                            req.session.message = '';
                            req.session.infosAdmin = infosAdmin;
                            req.session.listClients = listClients;
                            req.session.listComptes = listComptes;
                            req.session.listOperations = listOperations;
                            // save the session before redirection to ensure page
                            // load does not happen before session is saved
                            req.session.save(function (err) {
                              if (err) return next(err)
                              res.render('page/dashboardAdmin.ejs', {infosAdmin, listClients, listComptes, listOperations});
                            })
                        
                        })  
                    })
                    
                })
            })
        } else { // if no match return the form of connexion and display a message
            res.render("page/connexFormAdmin.ejs", {message: "Erreur à la connexion. Vérifiez les informatiosn transmises"})
        }
    })
    
}

exports.modifyClient = (req, res, next) => {
    client = req.body;
    adminModel.modifyOne(client, 'utilisateurs').then( (mess) => {
        req.session.message = mess
        
        res.redirect('/connexFormAdmin')
    })
}

exports.deleteClient = (req, res, next) => {
    adminModel.deleteOne(req.body._id, 'utilisateurs').then( (mess) => {
        req.session.message = mess
        res.redirect('/connexFormAdmin')
    })
}

exports.modifyCompte = (req, res, next) => {
    compte = req.body;
    adminModel.modifyOne(compte, 'compte').then( (mess) => {
        req.session.message = mess
        
        res.redirect('/connexFormAdmin')
    })
}

exports.addCompte= (req, res, next) => {
    adminModel.addOne(req.body._id, 'compte').then( (mess) => {
        req.session.message = "Le compte n° " +mess+ " a été ajouté";
        res.redirect('/connexFormAdmin')
    })
}
exports.deleteCompte= (req, res, next) => {
    adminModel.deleteOne(req.body._id, 'compte').then( (mess) => {
        req.session.message = mess
        res.redirect('/connexFormAdmin')
    })
}
exports.modifyOperation = (req, res, next) => {
    operation = req.body;
    adminModel.modifyOne(operation, 'operations').then( (mess) => {
        req.session.message = mess
        
        res.redirect('/connexFormAdmin')
    })
}

exports.deleteOperation = (req, res, next) => {
    adminModel.deleteOne(req.body._id, 'operations').then( (mess) => {
        req.session.message = mess
        res.redirect('/connexFormAdmin')
    })
}


