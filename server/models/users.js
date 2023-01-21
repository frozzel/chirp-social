const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    username : {type : String, required: true} , 
    password : {type : String, required: true} , 
    privateAccount : {type : Boolean, required: false , default: false} ,

    followers : [{type : mongoose.Schema.Types.ObjectId, req : 'users'}] ,
    following : [{type : mongoose.Schema.Types.ObjectId, req : 'users'}] ,
    profilePicUrl : {type : String, required:false , default: ''},
    bio : {type : String, required:false , default:''},
    savedPosts : [],
    archeivedPosts : []



} , {
    timestamps : true,
})

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
  });
  
  // compare the incoming password with the hashed password
  userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  const users = mongoose.model('users', userSchema);

module.exports = users;