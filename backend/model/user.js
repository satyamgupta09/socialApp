const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { type } = require('os');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    from:{
        type:String,
    },
    about:{
        type:String,
    },
    relationshipStatus:{
        type:String,
    },
    avatar:{
        type:String
    },
    cover_photo:{
        type:String
    },
    friend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + '/../' + AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});


//static functions

userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.uploadedCoverPhoto = multer({ storage: storage }).single('cover_photo');
userSchema.statics.avatarpath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;