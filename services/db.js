// database Connection

// Import mongoose
const mongoose = require('mongoose')

// connection string to connect db with server
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

// Create model
const User = mongoose.model('User',{
    acno: Number, 
    uname: String,
    password: Number,
    balance: Number,
    transaction:[]
})

module.exports={
    User
}