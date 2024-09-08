const dbu = require('../db/db_utils');

exports.getInfo = (email) =>{
    
    return dbu.getOne('utilisateurs', email);
}

exports.addUtilisateur = (utilisateur) => {
    return dbu.addClient(utilisateur);
}

exports.modifyClient = (obj, collect) => {
    return dbu.modifyInfosByClient = (obj, collect)
}