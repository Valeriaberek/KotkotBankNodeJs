const dbu = require('../db/db_utils');

exports.getComptes = (id) =>{
    return dbu.getComptesById('banque','compte', id);
}

exports.getOperationsByCompte = (idCompte) =>{
    
    return dbu.getOperationsByIdCompte('banque','operations', idCompte);
}

exports.getOperationsByClient = (idClient) =>{
    
    return dbu.getOperationsByIdClient('banque','operations', idClient);
}

exports.createCompte = (compte) => {
    return dbu.createCompte(compte);
}

exports.creationCompteOperation = (operation) => {
    return dbu.createOperation(operation)
}

exports.getmodifySoldeCompte = (id, newSolde) => {
 
    return dbu.modifySoldeCompte(id, newSolde)
}

exports.updateConnexion = (id, date, collec) => {
    return dbu.updateConnexion(id, date, collec)
}