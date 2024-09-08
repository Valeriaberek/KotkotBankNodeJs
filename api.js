//import express module
const express = require('express')

var cors = require("cors");
const { MongoClient } = require('mongodb');

const url = "mongodb://kkb_user:kkb_passwd@mongo:27017/?authMechanism=DEFAULT"
 
//init variable
const PORT = 3333;
 
// app start
const app = express();
app.use(cors());


app.get("/api/all", async (req, res)=> {
    let connect = new MongoClient(url);
 
    try{
        let datas = await connect.db("actions").collection("shares").find().toArray()
        res.json(datas)

    }catch(err){
        console.error("error : ", err.message)
    }finally{
        await connect.close();
    }

})

app.get("/titre")
 
// final app
app.listen(PORT, (err)=>{
    if(err) return console.log("connot start server ...")
    console.log("API launch");
})
