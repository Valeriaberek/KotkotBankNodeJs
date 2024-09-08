
const {MongoClient, ObjectId}  = require('mongodb');
const url = "mongodb://kkb_user:kkb_passwd@mongo:27017/?authMechanism=DEFAULT";

exports.getAll = (collec)=>{
   
    const client = new MongoClient(url);

    async function run(collec){
        try{
            const dataBase = client.db('banque');
            const collection = dataBase.collection(collec);
            if(collec === 'utilisateurs') {  
                const promise = await collection.find().project({"_id":1, "password": 0}).toArray();
                return promise;
            } else {
                const promise = await collection.find().toArray();
                return promise;
            }
            

        }finally{
            await client.close();
        }
        
    }
    return run(collec).catch(console.dir);
}

exports.addClient = async (newUser) =>{
    const client = new MongoClient(url);
    
    try{
        const db = client.db('banque');
        const users_collec = db.collection('utilisateurs');
        let promise = await users_collec.insertOne(newUser).then( result => {
            
             return result.insertedId.toString();
          })
          .catch(err => {
            console.error("erreur lors de l'ajout d'utilisateur : ", err.message)
          });
        
          return promise;
             

    }catch(error){
        console.error('erreur ajout client: ', error.message);
    }finally{
        await client.close();
    } 
}

exports.getOne = async (collec, objectEmail) => {
    const client = new MongoClient(url);
    try{
        const db = client.db('banque');
        const users_collec = db.collection(collec);
        const promise = await users_collec.findOne({email: objectEmail}, {});
        
        return promise;


    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await client.close();
    }
}

exports.modifyOne= async (obj, collec) => {
    const client = new MongoClient(url);
    try{        
        const promise = await client.db('banque').collection(collec).updateOne({"_id": new ObjectId(obj._id)}, {$set: {"name": obj.name, "email": obj.email, "adresse": obj.adresse, "derniereConnexion" : obj.derniereConnexion, "creationCompte": obj.creationCompte}});
        return "Client mis à jour";
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await client.close();
    }
}

exports.deleteOne= async (id, collec) => {
    const client = new MongoClient(url);
    try{
        const promise = await client.db('banque').collection(collec).deleteOne({"_id": new ObjectId(id)});
        return "Client supprimé";
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await client.close();
    }
}

exports.getComptesById= async (bdd, collec, id) => {
    const user = new MongoClient(url);
    try{        
        const promise = await user.db(bdd).collection(collec).find({numeroClient: id}).toArray();
        // console.log(promise)
        return promise;
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await user.close();
    }
}

exports.getOperationsByIdCompte= async (bdd, collec, id) => {
    const user = new MongoClient(url);
    try{        
        const promise = await user.db(bdd).collection(collec).find({compteEmetteur: id}).toArray();
        return promise;
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await user.close();
    }
}

exports.getOperationsByIdClient= async (bdd, collec, id) => {
    const user = new MongoClient(url);
    try{        
        const promise = await user.db(bdd).collection(collec).find({numeroClient: id}).toArray();
        return promise;
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await user.close();
    }
}

exports.createCompte = async(compte) => {
    const user = new MongoClient(url);
    try{        
        let promise = await user.db('banque').collection('compte').insertOne(compte).then( result => {
            
            return result.insertedId.toString();
         });
        return promise;
    }catch(err){
        console.error("error create compte: ", err.message);
    }finally{
        await user.close();
    }
}

exports.createOperation = async (operation) =>{
    const user = new MongoClient(url);
    try{        
        await user.db('banque').collection('operations').insertOne(operation);
        return "Votre demande a bien été prise en compte et va être traitée sous peu";
    }catch(err){
        console.error("error create compte: ", err.message);
    }finally{
        await user.close();
    }
}

exports.modifySoldeCompte= async (id, newSolde) => {
    const client = new MongoClient(url);
    try{        
        const promise = await client.db('banque').collection('compte').updateOne({compte: id}, {$set: {solde: newSolde}});
        //$set mettre a jour les valeurs, modifier les données existantes.
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await client.close();
    }
}
exports.addOne = async (obj, collec) =>{
    const client = new MongoClient(url);
    
    try{
        const db = client.db('banque');
        const users_collec = db.collection(collec);
        let promise = await users_collec.insertOne(obj).then( result => {
            
             return result.insertedId.toString();
          })
          .catch(err => {
            console.error("erreur lors de l'ajout d'utilisateur : ", err.message)
          });
        
          return promise;
             

    }catch(error){
        console.error('erreur ajout client: ', error.message);
    }finally{
        await client.close();
    } 
}

exports.modifyInfosByClient= async (obj, collec) => {
    const client = new MongoClient(url);
    try{        
        const promise = await client.db('banque').collection(collec).updateOne({"_id": new ObjectId(obj._id)}, {$set: {"name": obj.name, "email": obj.email, "adresse": obj.adresse}});
        return "Vos informations ont bien été mise à jour";
    }catch(err){
        console.error("error : ", err.message);
    }finally{
        await client.close();
    }
}

exports.updateConnexion = async (id, today, collec) => {
    const client = new MongoClient(url);
    try{
        await client.db('banque').collection(collec).updateOne({"_id": new ObjectId(id)}, {$set: {"derniereConnexion": today}})
    }catch(err){
        console.log("error : ", err.message)
    }finally{
        await client.close();
    }
}