  // Import jsonwebtoken
  const jwt =require('jsonwebtoken')

  // import db
   const db = require('./db')
  
  // Database
  database = {
    1000: { acno: 1000, uname: "sam", password: 1000, balance: 50000,transaction:[] },
    1001: { acno: 1001, uname: "saml", password: 1000, balance: 40000,transaction:[]},
    1002: { acno: 1002, uname: "samy", password: 1000, balance: 80000,transaction:[] }

  }

    // register - index.js will give uname,acno,password
     const register = (uname, acno, password)=>{
       
      // asynchronous
      return db.User.findOne({acno})
      .then(user=>{
        if(user){
          // acno already exist in db
          return {
            statusCode:401,
            status:false,
            message:"Account number already exists"
          }
        }
        else{
          const newUser= new db.User({
            acno,
            uname,
            password,
            balance:0,
            transaction:[]
          })
          newUser.save()
          return {
            statusCode:200,
            status:true,
            message:"Successfully registerd...Please Log In"
          }
        }
      })

      }

  // login
  const login = (acno,pswd) =>{
    // user entered acno n password
  
  
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
      
          currentUser=user.uname
          currentAcno=acno
          // already exists in db
      
          // Token generate
          const token= jwt.sign({
            currentAcno:acno
          },'secret')

          return  {
            statusCode:200,
            status:true,
            message:" Log In Successfull",
            token,
            currentAcno,
            currentUser
          }
        
      }
      else {
        return {
          statusCode:401,
          status:false,
          message:"user does not exist "
        }
      }
    })  
  }   
     

      // Deposit
      const deposit = (acno,pswd,amount)=>{
        var amt=parseInt(amount)
  
       return db.User.findOne({acno,password:pswd})
       .then(user=>{
         if(user){
          user.balance+=amt
          user.transaction.push({
            type:"Credit",
            amount:amount         
       })
       user.save()
            return{
              statusCode:200,
              status:true,
              message:amount  +  "  Successfully deposited. New balnce is "+user.balance
            } 
          }
          else{
            return {
              statusCode:422,
              status:false,
              message:"invalid password"
            }
          }
        })
        
      
      }

      // Withdraw
     const withdraw = (req,acno,pswd,amount)=>{
      var amt=parseInt(amount)

      return db.User.findOne({acno,password:pswd})
      .then(user=>{
        if(req.currentAcno!=acno){
        return {
          statusCode:401,
          status:false,
          message:"operation denied "
        }
       }

        if(user){
          if(user.balance>amt){
            user.balance -=amt
            user.transaction.push({
              type:"Debit",
              amount:amount
            })
            user.save()
            return{
              statusCode:200,
              status:true,
              message:amount  +  "  Successfully debitted. New balnce is "+user.balance
            }             
            
          }
        else{
          return  {
            statusCode:401,
            status:false,
            message:"insufficient balance"
          }
        }
      }
        else{
          return  {
            statusCode:422,
            status:false,
            message:"invalid password"
          }
        }
      })
    }
       

        

         

    // Transaction

    const transaction=(acno)=>{
     return db.User.findOne({acno})
     .then(user=>{
       if(user){
        return{
          statusCode: 200,
          status: true,
          transaction:user.transaction
        }
       }
       else{
        return{
          statusCode:401,
          status:false,
          message:"User doesn't exist"
        }
       }
     })
    }
    
  

      
  


    //   Export
    module.exports={
        register,login,deposit,withdraw,transaction
    }
    