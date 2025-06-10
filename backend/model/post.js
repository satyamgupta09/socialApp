const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { type } = require('os');
const AVATAR_PATH = path.join('/uploads/users/avatars');
// const User = require('./user');

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        // required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
      }
    ],
    post_image: [
      {
        type:String
      }
    ]
},
  {
    timestamps: true
  }
);

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

postSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
postSchema.statics.avatarpath = AVATAR_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;