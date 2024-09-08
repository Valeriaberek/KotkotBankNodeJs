const clientModel = require('../models/clientModel');
const compteModel = require('../models/compteModel');
const bcrypt = require('bcrypt');
const { displayDashBoardAdmin } = require('./adminController');

exports.displayDashBoard = async (req, res) => {
    let user = req.body; // // informations from the form

    await clientModel.getInfo(user.email).then(async infosClient =>{ //browse email in the collection utilisateurs
       
        if(bcrypt.compareSync(user.password, infosClient.password)){ // test if the passwords matched
            Reflect.deleteProperty(infosClient, 'password'); // delete password property
            let listComptes = []; 
            let listOperations = [];
            await compteModel.getComptes(infosClient._id.toString()).then( async comptes =>{ // browse comptes of the client
                
                listComptes = comptes; 
                await compteModel.getOperationsByClient(listComptes[0].numeroClient).then( operations =>{ // browse operations of the client
                    listOperations = operations;  
                    
                    })
                    listOperations.sort(function compare(a, b) { // sort the oprations by date 
                        if (a.dateOperation < b.dateOperation)
                        return -1;
                        if (a.dateOperation > b.dateOperation )
                        return 1;
                        return 0;
                    });
                    let date = new Date();
                    let today = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                    await compteModel.updateConnexion(infosClient._id.toString(), today, 'utilisateurs').then( ()=> {
                        req.session.regenerate(function (err) {
                            if (err) next(err)
                            req.session.isAdmin = false;
                            req.session.infosClient = infosClient;
                            req.session.listComptes = listComptes;
                            req.session.listOperations = listOperations;
                            // save the session before redirection to ensure page
                            // load does not happen before session is saved
                            
                            req.session.save(function (err) {
                            if (err) return next(err)
                            res.render('page/dashboard.ejs', {infosClient, listComptes, listOperations});
                            })
                        
                        })
                    })
                
            })

        } else { // if no match return the form of connexion and display a message
            res.render("page/connexForm.ejs", {message: "Erreur à la connexion. Vérifiez les informatiosn transmises"})
        }
    }).catch((err)=>{
        res.render("page/connexForm.ejs", {message: "Erreur à la connexion. Vérifiez les informatiosn transmises"})
    })
    
}

exports.logOutClient = (req, res)=>{
    req.session.destroy();
    res.redirect('/');
}

exports.addOperation = (req, res) => {
    console.log(req.body)

}

exports.addClient = async (req, res) => {
    user = req.body

    // we add necessary properties of user objecr
    user.password = bcrypt.hashSync(user.password, 10);
    let date = new Date();
    let today = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    user.creationCompte = today; 
    user.derniereConnexion = today;
    
    // use model to insert new user to de database

    await clientModel.addUtilisateur(user).then(async (newUserId)=> {
        console.log(newUserId)
        let newCompteCourant = {
            type: 'courant',
            creationCompte: today,
            solde: "10000",
            numeroClient: newUserId,
            decouvertAut: "0"
        }
        await compteModel.createCompte(newCompteCourant).then(async (newCompteId)=>{
            let creationCompte = {
                    dateOperation: today,
                    montant: "10000",
                    typeOperation: "creation",
                    cible: "self",
                    compteEmetteur: newCompteId,
                    motif: "nouveau Client",
                    soldeApres: "10000",
                    soldeAvant: "0",
                    numeroClient: newUserId
            }
            await compteModel.creationCompteOperation(creationCompte).then( message => {
                res.render("page/home", {message})
            })
            
            
        })
        
        
    })
}    

exports.modifyClient = (req, res) => {
    clientModel.modifyClient(req.body, 'utilisateurs').then((mess)=>{
        req.session.message = mess
        res.redirect('/connexForm')
    })
    
}
