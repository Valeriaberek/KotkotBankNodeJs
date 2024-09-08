 
const dbu = require('../db/db_utils');

exports.getInfo = (email) => {
    return dbu.getOne('admins', email)
}

exports.getAll = (collec)=>{
    return dbu.getAll(collec);
}

exports.getOneClient = (name) =>{
    return dbu.getOne('utilisateurs', email);
}
exports.addClient = async (user)=>{
    return dbu.addClient(user);
}

exports.modifyOne = async(obj, collec)=>{
    
    return dbu.modifyOne(obj, collec);
    
}
exports.addOne = async(obj, collec) => {
    return dbu.modifyOne(obj, collec);
}
exports.deleteOne = async(id, collec)=>{
    return dbu.deleteOne(id, collec)
}