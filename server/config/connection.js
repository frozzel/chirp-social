const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chirp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection

connection.on('connected' , ()=>{
    console.log('Mongo db connection successfull 🔥')
})

connection.on('error' , ()=>{
    console.log('Mongo db connection error')
})


module.exports = mongoose;