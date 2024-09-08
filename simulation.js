//import express module
const express = require('express')

var cors = require("cors");
const { MongoClient } = require('mongodb');

const url = "mongodb://kkb_user:kkb_passwd@mongo:27017/?authMechanism=DEFAULT"
 
//init variable
const PORT = 3306;

// app start
const app = express();
app.use(cors());

 
// final app
app.listen(PORT, (err)=>{
    if(err) return console.log("error to launch simulation")
    console.log("logiciel launch");

})


// addChamp()

setInterval(wrapper, 10000);

async function wrapper(){
    await randomEvent()
    dayCycle()
}


async function addToHistory(listShares){ // add latest sahre to history collecion
    let connexHist = new MongoClient(url)
    console.log(connexHist)
    try{
        let date = new Date()
        await connexHist.db("actions").collection('history').insertOne({'date': date, "values": listShares})
        
    }catch(err){
        console.error('add to history error : ', err.message)
    }finally{
       await connexHist.close()
    }
 }
async function updateCollecShares(shares){
    let connexUpd = new MongoClient(url)
    try{
        shares.forEach(async share => {
            await connexUpd.db("actions").collection('shares').updateOne({"domain": share.domain}, {$set: {"share_price": share.share_price, "changement": share.changement}})
        })
        
    }catch(err){
        console.error('update collection shares function error : ', err.message)
    }finally{
        await connexUpd.close()
    }
    
}
 async function dayCycle(){
    let connex = new MongoClient(url, { connectTimeoutMS: 10000 }, { keepAlive: 1})
    
    try{
        
        let shares = await connex.db("actions").collection("shares").find().toArray()
        addToHistory(shares);
        shares.forEach(share => {
            if(Math.round(Math.random())=== 0){
                share.share_price -= 2
                share.changement = "negatif"
            } else {
                share.share_price += 2
                share.changement = "positif"
            }
        })
        updateCollecShares(shares)
        
    }catch(err){
        console.error('day cycle error : ', err.message)
    }finally{
       await connex.close()
    }
}

async function  randomEvent(){
    let connex = new MongoClient(url)
    try{
        let events = await connex.db("actions").collection("events").find().toArray()
        let domaine = '';
        let impact = ''
        events.forEach(event =>{
            if(Math.random() <= event.probabilité ){
                event.probabilité = 0;
                domaine = event.domaine;
                impact = event.impact;
                
            } else{
                event.probilité += 0.01;
            }
        })
        try{
            let chgt = ''
            if(impact > 0){
                chgt = "positif"
            } else if(impact < 0){
                chgt = "negatif"
            }else{
                chgt =  "NoChange"
            }
            await connex.db('actions').collection("shares").updateOne({'domain': domaine}, {$inc: {'share_price': impact}}, {$set :{'changement':chgt}})
        }catch(err){
            console.error("update share's event error : ", err.message)
        }
        console.log("Evenement: " + domaine + " modifié de "+ impact)
        return events
    }catch(err){
        console.error('random event error : ', err.message)
    }finally{
        await connex.close()
    }
}

async function addChamp(){
    let connex = new MongoClient(url)
    try{
        await connex.db("actions").collection('shares').updateMany({}, {$set:{'changement': "NoChange"}})
    }catch(err){
        console.error('add to history error : ', err.message)
    }finally{
        await connex.close()
    }
}