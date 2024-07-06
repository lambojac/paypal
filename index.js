//require dotenv
require("dotenv").config()
//require express
const express=require("express")
//port 3000
port=3000
const app=express()
// setting the template engine
app.set("view engine", "ejs")
//render
app.get("/",(req,res)=>{
    res.render("index")
})
//server instance
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})