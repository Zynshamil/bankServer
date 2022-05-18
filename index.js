// server creation

// import express
const express =require('express')


// dataservice
const dataService=require('./services/data.service')

// Import jsonwebtoken
const jwt =require('jsonwebtoken')
// import cors
const cors=require('cors')

// create server app using express
const app= express()

// use cors
app.use(cors({
    origin:'http://localhost:4200'
}))

// to parse json data
app.use(express.json())

// resolving API call


// GET- TO READ DATA
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

// Post- TO POST DATA
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})
 
// Patch- TO PARTIALLY UPDATE DATA
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

// PUT- TO UPDATE/MODIFY DATA
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

// DELETE- TO PDELETE DATA
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
}) 
// Bank Server

// jwtMiddleware - to verify token
const jwtMiddleware= (req,res,next)=>{
    try{
        const token =req.headers["x-access-token"]
        const data= jwt.verify(token,'secret')
        req.currentAcno = data.currentAcno
        next()
    }
    catch{
        res.status(401).json({
            status:false,
            message:"Please Log In!!!"
        })
    }
}
// Register API
app.post('/register',(req,res)=>{
 dataService.register(req.body.uname,req.body.acno,req.body.password)
 .then(result=>{
res.status(result.statusCode).json(result)
 })
 
})

// Login API
app.post('/login',(req,res)=>{
   dataService.login(req.body.acno,req.body.pswd)
   .then(result=>{
    res.status(result.statusCode).json(result)
     })
   })
 
   // Deposit API - router specific middleware
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
         })
   })

   // withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
     dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
         })
   })

    // transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.transaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
         })
   })





// set port number 
app.listen(3000,()=>{
    console.log("server started at 3000");
})
