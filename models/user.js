const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const jwt = require('jsonwebtoken');
// const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    tokens :[{
        access : {
            type: String,
            required :  true
        },
        token: {
            type : String,
            required : true
        }
    }]
});

userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    // return ([userObject._id, userObject.name,userObject.tokens[0][token]]);
    return _.pick(userObject , ['_id','name','tokens[0][token]']);
}

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(),access},"dfbsdfjbdjkfjdfhksf").toString();

    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}

userSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
  
    try{
      decoded = jwt.verify(token,"dfbsdfjbdjkfjdfhksf");
    } catch(e) {
      return  Promise.reject();
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };
  
  userSchema.statics.findByCredentials = function (email, password) {
    var User = this;
  
    return User.findOne({email}).then((user)=> {
      if(!user){
        return Promise.reject();
      }
  
      return new Promise((resolve,reject) => {
        bcrypt.compare(password, user.password, (err,res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
  };
  
  userSchema.pre('save' , function (next) {
    var user = this;
  
    if (user.isModified('password')){
      bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(user.password, salt, (err,hash) => {
          user.password = hash;
          next();
        });
      });
    } else{
      next();
    }
  });

module.exports = model('user', userSchema);