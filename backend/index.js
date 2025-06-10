const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./model/user'); // Corrected the path
// const { jwtAuthMiddleWare, GenerateToken } = require('./jwt');
const Post = require('./model/post');
const Comment = require('./model/comment');
const multer = require('multer');
const newcomment = require('./services/nodeMailer');
const Like = require('./model/like');
const http = require('http');
const socketIo = require('socket.io');
const FrinedRequests = require('./model/friendRequest');
const { start } = require('repl');
const Notification = require('./model/notifications');
const createNotification = require('./services/createNotification');
const router = require('./routes/routes');
// const upload = multer({ dest: User.avatarpath })

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow connections from the frontend
        methods: ['GET', 'POST'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type'], // Allow specific headers
        credentials: true // Allow credentials (cookies, headers, etc.)
    }
});
// const io = new Server(server, {
//     cors: {
//       origin: '*',
//     },
//   });

// app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting database'));
db.once('open', function () {
    console.log('Data connected successfully');
});

app.use('/', router);

// app.post('/api/signup', async (req, res) => {
//     try {
//         // const { username, email, password } = req.body; 
//         const name = req.body.name;
//         const email = req.body.email;
//         const password = req.body.password;

//         const newUser = new User({ name, email, password });
//         await newUser.save();
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/api/signin', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Authentication failed: User not found' });
//         }
//         if (password !== user.password) {
//             return res.status(401).json({ message: 'Authentication failed: Invalid password' });
//         }
//         const token = GenerateToken({ username: user.name, userId: user._id });
//         console.log(token);
//         // req.flash('success', 'Logged in Successfully');
//         res.status(200).json({ token });
//     } catch (error) {
//         console.error('Signin error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// app.get('/api/profile', jwtAuthMiddleWare, async (req, res) => {
//     // console.log(req.userData);
//     // console.log(req.);
//     try {
//         const user = await User.findById(req.userData.userData.userId);
//         console.log('user', user);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log(user.avatar);
//         const userId = user.id;
//         console.log(userId);
//         res.status(200).json({ username: user.name, email: user.email, avatar: user.avatar, userId: user.id, cover_photo: user.cover_photo, about: user.about, from: user.from, relationshipStatus: user.relationshipStatus });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/api/profile/post', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         // console.log('Received request to create post:', req.body);
//         console.log(req.userData.userData.userId);
//         const user = await User.findById(req.userData.userData.userId);
//         // console.log(req.userData.userData);
//         const post = await Post.create({
//             content: req.body.comment,
//             user: req.userData.userData.userId
//         });

//         const users_friends = user.friend; // takes an array of all friends ids of user

//         users_friends.push(req.userData.userData.userId); // pushing the user's user id also to send the notification to user also
//         // console.log('Users Friends=>', users_friends)

//         await createNotification({
//             senderId: req.userData.userData.userId,
//             recipientIds: users_friends,
//             type: 'post',
//             message: `${user.name}, created a post.`,
//         });

//         console.log('Post created successfully:', post);
//         newcomment.newPost(user.email);
//         res.status(201).json({status:'success', message:'Post created successfully!!', newPost:post});
//     } catch (error) {
//         console.log('Error in creating post from backend:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // app.get('/api/profile/post/find', async(req, res) => {
// //     const post = await Post.find({}).populate('user').exec
// // })

// app.get('/api/profile/post/find', jwtAuthMiddleWare, async (req, res) => {
//     console.log('yes');
//     try {
//         console.log('inside try');
//         const posts = await Post.find({}).populate({ path: 'user', select: 'name email' }).exec();
//         // console.log(posts)
//         res.status(200).json(posts);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // app.get('/api/profile/post/find/UserPost/:userId', jwtAuthMiddleWare ,async(req, res) => {
// //     console.log('inside user post finding process!!');
// //     try{
// //         console.log('id==>',req.params.userId);
// //         // const posts = await Post.find( {email: req.params.userId} ).populate({path:'user', select: 'name email'}).exec(); 
// //         // const posts = await Post.find({
// //         //     user: req.params._id
// //         // }).populate({
// //         //     path:'user',
// //         //     select: 'name email createdAt avatar'
// //         // }).populate({
// //         //     path: 'comments',
// //         //     populate:{
// //         //         path: 'user',
// //         //         select: 'name email createdAt updateAt'
// //         //     }.populate({
// //         //         path: 'like'
// //         //     })
// //         // }).populate({
// //         //     path: 'like'
// //         // });

// //         // console.log('Posts Data==>',posts);
// //         // res.status(200).json(posts);

// //         const posts = await Post.find({ email: req.params.userId })
// //             .populate({ path: 'user', select: 'name email createdAt avatar' })
// //             .populate({
// //                 path: 'comments',
// //                 populate: [
// //                     { path: 'user', select: 'name email createdAt updateAt' },
// //                     { path: 'like' },
// //                 ],
// //             })
// //             .populate({ path: 'like' });

// //         console.log('Posts Data:', posts);
// //         res.status(200).json(posts);
// //     }
// //     catch(error){
// //         res.status(500).json(error);
// //     }
// // })

// app.get('/api/profile/post/find/UserPost/:email', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const email = req.params.email.trim(); // Trim to avoid extra characters
//         console.log('Email received:', email);

//         // const posts = await Post.find({ user: email })
//         //     .populate({
//         //         path: 'user',
//         //     })
//         //     .populate({
//         //         path: 'comments',
//         //         populate: { path: 'user', select: 'name email' },
//         //     });

//         const posts = await Post.find({ user: email })
//             .populate('user')
//             .populate({
//                 path: 'comments likes',
//                 populate: {
//                     path: 'user'
//                 }
//             });
//         posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         // res.json(posts);

//         // console.log('Posts found:', posts);
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//         res.status(500).json({ message: 'An error occurred while fetching posts.' });
//     }
// });


// app.post('/api/profile/post/comment', jwtAuthMiddleWare, async (req, res) => {
//     console.log('inside comment creation');
//     //   console.log(req.body);
//     try {
//         const post = await Post.findById(req.body.postId);
//         const user = await User.findById(req.userData.userData.userId);
//         console.log(post);
//         if (post) {
//             console.log("iioooooo");

//             const comment = await Comment.create({
//                 content: req.body.content,
//                 user: req.userData.userData.userId,
//                 post: req.body.postId
//             });

//             newcomment.newcomment(user.email);
//             console.log('email', user.email);

//             post.comments.push(comment);
//             post.save();

//             //creating notifcations for comment
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: post.user,
//                 type: 'comment',
//                 message: `${user.name} comment on your post.`,
//             });

//             await comment.populate('user');

//             res.status(201).json({ status: 'success', comment });
//         } else {
//             res.status(404).json({ error: 'Post not found' });
//         }
//     } catch (error) {
//         console.log('error in sending email backend', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/api/profile/post/comment/find', async (req, res) => {
//     try {
//         const all_comments = await Post.find({})
//             .populate('user')
//             .populate({
//                 path: 'comments likes',
//                 populate: {
//                     path: 'user'
//                 }
//             });
//         all_comments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         res.json(all_comments);
//         // const users = User.find({});

//         // res.json({all_comments,users});
//         // console.log(all_comments)
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

// app.delete('/api/profile/post/delete/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const postId = req.params.id
//         console.log(postId);
//         const post = await Post.findById(postId);
//         console.log('post==>', post.user.toString());
//         console.log(post.user, req.userData.userData.userId);

//         if (post.user?.toString() == req.userData.userData.userId) {
//             console.log('yes');
//             await post.deleteOne();

//             await Comment.deleteMany({
//                 post: postId
//             });
//             // await Post.findByIdAndDelete(postId);


//             //creating notifcations for deleting post
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: req.userData.userData.userId,
//                 type: 'delete_post',
//                 message: `Your post deleted successfully.`,
//             });

//             // res.flash('success', 'Post deleted successfully').status(200).json({ message: 'Post deleted successfully' });
//             res.status(200).json({ message: 'Post deleted successfully!' });
//         }
//         else {
//             console.log('cannot be deleted');
//         }
//     }
//     catch (error) {
//         console.error('Error deleting post:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// app.delete('/api/profile/post/comment/delete/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         console.log('inside comment deletion 11!!');
//         const commentId = req.params.id;
//         const comment = await Comment.findById(commentId);
//         console.log(comment);

//         if (req.userData.userData.userId === comment.user.toString()) {
//             console.log('inside comment deletion 22!!');
//             const postId = comment.post;
//             console.log(postId);

//             await comment.deleteOne();

//             await Post.findByIdAndUpdate(postId, {
//                 $pull: {
//                     comments: commentId
//                 }
//             });

//             // creating notifcations for deleting comment
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: comment.user,
//                 type: 'delete_comment',
//                 message: `You deleted comment,successfully.`,
//             });

//             console.log('Comment deleted successfully');
//             res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
//         }
//     }
//     catch (error) {
//         console.error('Error deleting comment:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// // Suggestions API
// app.get('/api/profile/allFriends', jwtAuthMiddleWare, async (req, res) => {
//     // return those who are not their friend and itself the user
//     try {
//         const userAllFriends = await User.findById(req.userData.userData.userId).populate('friend');
//         userAllFriends.friend.push(req.userData.userData.userId);// userAllFriends.friend is the array of all IDs of the user's friends in which we r pushing user ID also to exclude their friend and the user itself
//         const users = await User.find({
//             _id: { $nin: userAllFriends.friend } //$nin :- take a array, it means not include ,so it basically not include the ids of array in the result
//         })
//             .select('name _id avatar');

//         res.status(200).json({ userAllFriends, status: 'success', message: 'Suggestions retrieved successfully!', users });
//     }
//     catch (error) {
//         console.log('error in getting Friends list', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// //dp uploading
// app.post('/api/profile/allFriends/upload/:id', jwtAuthMiddleWare, async (req, res, next) => {
//     console.log('inside dp',req.params.id);
//     if(req.params.id !== req.userData.userData.userId){
//         return res.status(400).json({ error: 'Invalid User' });
//     }

//     const user = await User.findById(req.params.id);
//     console.log(req.file);
//     User.uploadedAvatar(req, res, async function (error) {
//         console.log('dp file', req);
//         if (error) { console.log('Multer errro', error) };
//         // console.log(req.file);
//         console.log("Testest");
//         if (req.file) {
//             console.log(req.file);
//             user.avatar = User.avatarpath + '/' + req.file.filename;
//             await user.save();

//             // creating notifcations for uploading user's dp
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: user._id,
//                 type: 'upload',
//                 message: `You have changed your DP,successfully.`,
//             });

//             res.status(200).json({status:200 ,message:'successful upload', avatar:user.avatar});
//         }
//         else {
//             return res.status(400).json({ error: 'Image upload failed' });
//         }
//     })
// })

// //cover photo uploading
// // app.post('/api/profile/allFriends/coverPhoto/upload/:id' ,async(req, res, next) => {
// //     console.log('INSIDE COVER PHOTO UPLOAD API',req.params.id);
// //     const user = await User.findById(req.params.id);
// //     console.log(req.file);
// //     User.uploadedAvatar(req, res, function(error){
// //         console.log(req);
// //         if(error) {console.log('Multer errro',error)};
// //         // console.log(req.file);
// //         console.log("Testest");
// //         if(req.file){
// //             console.log(req.file);
// //             user.cover_photo = User.avatarpath + '/' + req.file.filename;
// //             user.save();
// //             res.status(200).json('successful upload');
// //         }
// //         else{
// //             console.log('error in uploading image');
// //         }
// //     })
// //   }) 
// app.post('/api/profile/allFriends/coverPhoto/upload/:id',jwtAuthMiddleWare, async (req, res, next) => {
//     console.log('INSIDE COVER PHOTO UPLOAD API', req.params.id);

//     if(req.params.id !== req.userData.userData.userId){
//         return res.status(400).json({ error: 'Invalid User' });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return res.status(404).json({ error: "User not found" });
//     }

//     // Use the correct Multer middleware for cover photo
//     User.uploadedCoverPhoto(req, res, function (error) {
//         if (error) {
//             console.log('Multer error:', error);
//             return res.status(400).json({ error: 'File upload failed' });
//         }

//         if (req.file) {
//             user.cover_photo = User.avatarpath + '/' + req.file.filename;
//             user.save();
//             res.status(200).json({ message: 'Successful upload', cover_photo: user.cover_photo });
//         } else {
//             console.log('Error in uploading image');
//             res.status(400).json({ error: 'No file uploaded' });
//         }
//     });
// });


// //post uploading
// app.post('/api/profile/post/upload/:id',jwtAuthMiddleWare ,async (req, res) => {
//     console.log("Received request for user:", req.params.id);

//     // Use multer to handle file and text data
//     User.uploadedAvatar(req, res, async function (error) {
//         if (error) {
//             console.log("Multer error:", error);
//             return res.status(400).json({ error: "Multer error", details: error });
//         }

//         if (!req.file) {
//             console.log("No file received");
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         // ✅ Fix: Manually parse text fields
//         const postContent = req.body.comment?.trim(); // Remove extra spaces

//         // if (!postContent) {
//         //     return res.status(400).json({ error: "Comment is required" });
//         // }

//         try {
//             const imageUrl = User.avatarpath + '/' + req.file.filename;

//             console.log("Comment received:", postContent);
//             console.log("Image URL:", imageUrl);


//             if (!postContent) {
//                 const newPost = new Post({
//                     user: req.params.id,
//                     post_image: imageUrl
//                 });

//                 await newPost.save();

//                 return res.status(200).json({ status:'success', message: "Post created successfully", post: newPost });
//             }

//             // Create a new post
//             const newPost = new Post({
//                 user: req.params.id,
//                 content: postContent,  // ✅ Now this will be properly set
//                 post_image: imageUrl
//             });

//             await newPost.save();
//             console.log("New post created:", newPost);


//             res.status(200).json({ status:'success', message: "Post created successfully", post: newPost });
//         } catch (err) {
//             console.error("Error saving post:", err);
//             res.status(500).json({ error: "Failed to create post" });
//         }
//     });
// });




// // 65f1731b902049fcc2520489
// app.get('/api/profile/allFriends/:id', async (req, res) => {
//     try {
//         const userData = await User.findById(req.params.id);
//         res.json(userData);
//     }
//     catch (error) {
//         console.log('error in getting Friend Data', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// //finding friends of user
// app.post('/api/profile/newUserProfile/friend', jwtAuthMiddleWare, async (req, res) => {
//     console.log('INSIDE FRIENDS DATA', req.body);
//     try {
//         const userData = await User.findById(req.body.userId)
//             .populate('friend', '_id name email avatar')
//             .select('_id name email cover_photo');
//         console.log('INSIDE FRIENDS DATA', userData);
//         res.status(200).json({ userData, status: 'success', message: 'All user freind retrived succefully!' });
//     }
//     catch (error) {
//         console.log('error in getting Friend Data', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })


// app.post('/api/profile/likePost/:id', jwtAuthMiddleWare, async (req, res) => {
//     console.log(req.body.type);
//     console.log(req.userData.userData.userId);
//     console.log(req.params.id);
//     try {
//         console.log('inside like');
//         let likeAble;
//         let deleted = false;
//         let totalLikes = 0;

//         console.log(req.userData.userData.userId);
//         const userID = req.userData.userData.userId;
//         const currentUserName = await User.findById(userID).select('name');
//         console.log('currentUserName', currentUserName);

//         if (req.body.type == 'Post') {
//             likeAble = await Post.findById(req.params.id).populate('likes');
//         }
//         else if (req.body.type == 'Comment') {
//             likeAble = await Comment.findById(req.params.id).populate('likes');
//         }

//         console.log('likeable==>', likeAble);

//         let existingLike = await Like.findOne({
//             user: userID,
//             likeable: req.params.id,
//             onModel: req.body.type
//         })
//         console.log('existingLike==>', existingLike);

//         if (existingLike) {
//             console.log(existingLike._id);
//             likeAble.likes.pull(existingLike._id);
//             await likeAble.save();

//             await Like.findByIdAndDelete(existingLike._id);
//             deleted = true;

//             //creating notifcations for unliking post
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: likeAble.user,
//                 type: 'like',
//                 message: `${req.body.type == 'Post' ? currentUserName.name + ', unlikes your post.' : currentUserName.name + ', unlikes your comment.'}`
//             });

//             // totalLikes = likeAble.likes.length;

//             // return res.status(200).json({ message: 'Like deleted successfully!!' });
//         }
//         else {
//             console.log('new like created!!');
//             let newLike = await Like.create({
//                 user: userID,
//                 likeable: req.params.id,
//                 onModel: req.body.type
//             })

//             likeAble.likes.push(newLike.id);
//             likeAble.save();

//             // creating notification for liking post
//             await createNotification({
//                 senderId: req.userData.userData.userId,
//                 recipientIds: likeAble.user,
//                 type: 'like',
//                 message: `${req.body.type == 'Post' ? currentUserName.name + ', likes your post.' : currentUserName.name + ', likes your comment.'}`
//             });

//             // totalLikes = likeAble.likes.length;
//         }

//         totalLikes = likeAble.likes.length;

//         if (deleted) {
//             return res.status(200).json({ message: 'Like deleted successfully!!', totalLikes, likes: likeAble.likes });
//         }
//         else {
//             return res.status(200).json({ message: 'Like added Successfully', totalLikes, likes: likeAble.likes });
//         }
//     }
//     catch (error) {
//         console.log('error in liking the post');
//         res.status(500).json({ error: 'Not able to like' });
//     }
// });

// app.post('/api/profile/userProfile', jwtAuthMiddleWare, async (req, res) => {
//     console.log('hitting', req.body.userId);
//     try {
//         const userProfile = await User.findById(req.body.userId);
//         console.log('UserProfile==>', userProfile);

//         return res.status(200).json(userProfile);
//     }
//     catch (error) {
//         res.status(401).json({ error: 'Problem in fetching user profile' });
//     }
// });

// // const onlineUsers = new Map();


// // io.on('connection', (socket) => {
// //     console.log('New socket connection:', socket.id);  // Log the new socket connection

// //     socket.on('add-user', (userId) => {
// //       console.log('✅ add-user received for userId:', userId);
// //       // Store the user's socket ID in the map
// //       onlineUsers.set(userId, socket.id);
// //       console.log('🟢 Current online users:', onlineUsers);  // Log the updated onlineUsers map
// //     });

// //     // Example: Emit event to a specific user when sending a friend request
// //     socket.on('send-friend-request', (friendUserId, senderUserId) => {
// //       const toSocketId = onlineUsers.get(friendUserId);
// //       if (toSocketId) {
// //         io.to(toSocketId).emit('new-friend-request', senderUserId);
// //         console.log(`✅ Sent friend request from ${senderUserId} to ${friendUserId}`);
// //       } else {
// //         console.log('❌ Friend is offline, cannot send request');
// //       }
// //     });
// //   });



// // Add Freind API
// app.post('/api/profile/userProfile/addFreind', jwtAuthMiddleWare, async (req, res) => {
//     console.log('hitting add friend API!!');
//     console.log('friend_to_be_added_id==>', req.body.friend_To_Be_Added_Id);
//     console.log('to_which_user_to_be_added==>', req.userData.userData.userId);
//     try {
//         const friends = await User.findById(req.userData.userData.userId);
//         const user_to_be_added = await User.findById(req.body.friend_To_Be_Added_Id);

//         console.log('friends==>', friends);

//         if (friends.friend.includes(req.body.friend_To_Be_Added_Id) || user_to_be_added.friend.includes(req.userData.userData.userId) || req.userData.userData.userId == req.body.friend_To_Be_Added_Id) {
//             console.log('Friend already exist');
//             return res.status(400).json({ status: 'failure', message: 'Friend already exist' });
//         }

//         const newRequest = await FrinedRequests.create({
//             fromUser: req.userData.userData.userId,
//             toUser: req.body.friend_To_Be_Added_Id
//         });

//         // creating notification for creating friend request
//         await createNotification({
//             senderId: req.userData.userData.userId,
//             recipientIds: req.body.friend_To_Be_Added_Id,
//             type: 'friend_request_received',
//             message: `${friends.name}, sends you a friend request.`,
//         });

//         // After creating friend request
//         // Emit to receiver (User B)
//         // const toSocketId = onlineUsers.get(req.body.friend_To_Be_Added_Id);
//         // if (toSocketId) {
//         //   io.to(toSocketId).emit('new-friend-request');
//         // }        

//         return res.status(200).json({ status: 'success', message: 'Friend Request addded successfully!' })
//     }
//     catch (error) {
//         res.status(400).json({ status: 'error', error: 'error in adding friend Request' });
//     }
// })

// // Unfriend API
// app.get('/api/profile/userProfile/unFriend/:id',jwtAuthMiddleWare ,async(req, res) => {
//     try{
//         console.log('inside un-friend request')
//         const friend_to_be_removed_id = req.params.id;
//         const currentUserId = req.userData.userData.userId;

//         const friend_to_be_removed = await User.findById(friend_to_be_removed_id);
//         const current_user = await User.findById(currentUserId);

//         if(friend_to_be_removed && current_user){
//             friend_to_be_removed.friend = friend_to_be_removed.friend.filter((id) => id.toString() !== currentUserId.toString());
//             current_user.friend = current_user.friend.filter((id) => id.toString() !== friend_to_be_removed_id.toString());

//             await friend_to_be_removed.save();
//             await current_user.save();

//             return res.status(200).json({ status: 'success', message: 'Un-Friend Request successfully!' })
//         }
//         else{
//             res.status(400).json({ status: 'error', error: 'error in  un-friend Request' });
//         }
//     }
//     catch(error){
//         res.status(400).json({ status: 'error', error: 'error in  un-friend Request' });
//     }
// })

// // Accepting friend request and adding a Friend
// app.post('/api/profile/userProfile/addFreind/Accept/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const friend_To_Be_Added_Id = req.params.id;

//         const friends = await User.findById(req.userData.userData.userId);
//         const user_to_be_added = await User.findById(friend_To_Be_Added_Id);

//         console.log('friends==>', friends);

//         if (friends.friend.includes(friend_To_Be_Added_Id) || user_to_be_added.friend.includes(req.userData.userData.userId) || req.userData.userData.userId == friend_To_Be_Added_Id) {
//             console.log('Friend already exist');
//             return res.status(401).json({ status: 'failure', message: 'Friend already exist' });
//         }

//         const result = await FrinedRequests.findOneAndDelete({
//             fromUser: friend_To_Be_Added_Id,
//             toUser: req.userData.userData.userId
//         })

//         //saving friendship in user who sends request
//         friends.friend.push(friend_To_Be_Added_Id);
//         await friends.save();

//         //saving friendship in user to whom request is send so they both become friend of each other(mutual relationship)
//         user_to_be_added.friend.push(req.userData.userData.userId);
//         await user_to_be_added.save();

//         // creating notification for accepting friend request
//         await createNotification({
//             senderId: req.userData.userData.userId,
//             recipientIds: friend_To_Be_Added_Id,
//             type: 'friend_request_accepted',
//             message: `${friends.name}, accepted your friend request.`,
//         });

//         return res.status(200).json({ status: 'success', message: 'Friend addded successfully!' })
//     }
//     catch (error) {
//         res.status(401).json({ status: 'error', error: 'error in adding friend' });
//     }
// })

// // Deleting Friend Request from Friend Request Schema
// app.post('/api/profile/userProfile/addFreind/DeleteRequest/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const friend_To_Be_Added_Id = req.params.id;

//         const friends = await User.findById(req.userData.userData.userId);
//         const user_to_be_added = await User.findById(friend_To_Be_Added_Id);

//         console.log('friends==>', friends);

//         if (friends.friend.includes(friend_To_Be_Added_Id) || user_to_be_added.friend.includes(req.userData.userData.userId) || req.userData.userData.userId == friend_To_Be_Added_Id) {
//             console.log('Friend already exist');
//             return res.status(401).json({ status: 'failure', message: 'Friend already exist' });
//         }

//         const result = await FrinedRequests.findOneAndDelete({
//             fromUser: friend_To_Be_Added_Id,
//             toUser: req.userData.userData.userId
//         })

//         // creating notification for deleting friend request
//         await createNotification({
//             senderId: req.userData.userData.userId,
//             recipientIds: friend_To_Be_Added_Id,
//             type: 'friend_request_deleted',
//             message: `${friends.name}, rejected your friend request.`,
//         });

//         return res.status(200).json({ status: 'success', message: 'Friend Request Deleted successfully!' })
//     }
//     catch (error) {
//         res.status(401).json({ status: 'error', error: 'error in adding friend' });
//     }
// })

// // API for retrieving all friend requests 
// // app.get('/api/profile/userProfile/addFreindButton/GetFriendRequest', jwtAuthMiddleWare, async(req, res) => {
// //     try{
// //         console.log('Hitting frind request retruival api');
// //         const friendRequests = await friendRequests.findOne({
// //             toUser: req.userData.userId.userId
// //         })

// //         console.log(friendRequests);

// //         if(!friendRequests){
// //             return res.status(401).json({ status:'failure', message:'FriendRequests retrived failed!' });
// //         }else{
// //             res.status(200).json({ data: friendRequests ,status:'success', message:'FriendRequests retrived successfully!' });
// //         }

// //     }
// //     catch(error){
// //         res.status(401).json({ status: 'error', error: 'error in retreving friend requests' });
// //     }
// // })

// // API for retrieving all friend requests 
// app.get('/api/profile/userProfile/addFreindButton/GetFriendRequest', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         console.log('Hitting friend request retrieval API');

//         const friendRequests = await FrinedRequests.find({
//             toUser: req.userData.userData.userId
//         }).populate('fromUser', 'name avatar email _id');

//         console.log(friendRequests);

//         if (!friendRequests || friendRequests.length === 0) {
//             return res.status(200).json({ status: 'failure', message: 'No FriendRequests retrieved!' });
//         } else {
//             return res.status(200).json({ data: friendRequests, status: 'success', message: 'FriendRequests retrieved successfully!' });
//         }

//     } catch (error) {
//         console.error('Error retrieving friend requests:', error);
//         res.status(500).json({ status: 'error', error: 'Error in retrieving friend requests' });
//     }
// });

// // if in friend then unfriend
// // if not in friend and in friend request then pending
// // if not in friend and not in friend request then add friend
// // user it self
// app.post('/api/profile/userProfile/addFreindButton/friendRequestStatus', jwtAuthMiddleWare, async (req, res) => {
//     console.log('HITTING BUTTON-STATUS')
//     try {
//         const currentUser = req.userData.userData.userId;
//         const user_to_be_added_id = req.body.id;

//         console.log('HITTING inside BUTTON-STATUS')

//         // 1st case ( if in friend then unfriend )
//         const isFriend = await User.findOne({
//             _id: currentUser,
//             friend: { $in: [user_to_be_added_id] }
//         })

//         if (isFriend) {
//             return res.status(200).json({ status: 'success', buttonStatus: 'unfriend', message: 'Friend Request button status retrieved successfully!' });
//         }

//         // 2nd case ( if not in friend and in friend request then pending )
//         const inFriendRequest = await FrinedRequests.findOne({
//             $or: [
//                 { fromUser: currentUser, toUser: user_to_be_added_id },
//                 { fromUser: user_to_be_added_id, toUser: currentUser }
//             ]
//         });

//         if (!isFriend && inFriendRequest) {
//             return res.status(200).json({ status: 'success', buttonStatus: 'pending', message: 'Friend Request button status retrieved successfully!' });
//         }

//         // 3rd case  ( if not in friend and not in friend request then add friend )
//         if (!isFriend && !inFriendRequest) {
//             return res.status(200).json({ status: 'success', buttonStatus: 'addFriend', message: 'Friend Request button status retrieved successfully!' });
//         }
//         else
//             return res.status(200).json({ status: 'success', buttonStatus: 'useritself', message: 'Friend Request button status retrieved successfully!' });
//     }
//     catch (error) {
//         res.status(401).json({ status: 'error', error: 'error in retriving friend Request button status' });
//     }
// })



// // API for returning the status of friend request button
// app.get('/api/profile/userProfile/addFreindButton/friendRequest/confirmDeleteButton/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const friend_To_Be_Added_Id = req.params.id;
//         const user_to_which_friend_needed_to_be_added = req.userData.userData.userId;

//         const isFriendRequesExist = await FrinedRequests.findOne({
//             $or: [
//                 { fromUser: friend_To_Be_Added_Id, toUser: user_to_which_friend_needed_to_be_added },
//             ]
//         })

//         if (!isFriendRequesExist) { // accepted
//             return res.status(200).json({ display: false, status: 'success', message: 'Friend Request Confirm button status retrieved successfully!' })
//         }
//         else { // pending
//             return res.status(200).json({ display: true, status: 'success', message: 'Friend Request button status retrieved successfully!' })
//         }
//     }
//     catch (error) {
//         res.status(401).json({ status: 'error', error: 'error in retriving friend Request button status' });
//     }
// })

// // API for returning status to display ADDFreind or UNFriend Button
// app.get('/api/profile/userProfile/addFreindButton/status/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const user_to_be_checked = req.params.id;
//         const user_itSelf = req.userData.userData.userId;

//         const user = await User.findOne({
//             _id: user_itSelf,
//             friend: { $in: [user_to_be_checked] }
//         });


//         if (user) {
//             res.status(200).json({ display: true, status: 'success', message: 'Status found successfully' });
//         }
//         else {
//             res.status(200).json({ display: false, status: 'success', message: 'Status found successfully' });
//         }
//     }
//     catch (error) {
//         res.status(401).json({ status: 'error', error: 'error in finding button display status' })
//     }
// })

// // let onlineUsers = {}; // Map to track online users and their socket IDs

// // io.on('connection', (socket) => {
// //     console.log('A user connected:', socket.id);

// //     // Listen for user login to map userId to socket ID
// //     socket.on('userLogin', (userId) => {
// //         onlineUsers[userId] = socket.id;
// //         console.log(`${userId} is online as ${socket.id}`);
// //     });

// //     // Listen for messages
// //     socket.on('sendMessage', ({ senderId, receiverId, message }) => {
// //         console.log('senderId==>', senderId, '   receiverId==>', receiverId)
// //         const receiverSocketId = onlineUsers[receiverId];

// //         if (receiverSocketId) {
// //             // Emit message to the receiver
// //             io.to(receiverSocketId).emit('receiveMessage', {
// //                 senderId,
// //                 message,
// //             });
// //             console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
//         // } else {
//     //         console.log(`User ${receiverId} is offline`);
//     //     }
//     // });

// //     // Cleanup when a user disconnects
// //     socket.on('disconnect', () => {
// //         for (const userId in onlineUsers) {
// //             if (onlineUsers[userId] === socket.id) {
// //                 delete onlineUsers[userId];
// //                 console.log(`${userId} has disconnected`);
// //                 break;
// //             }
// //         }
// //     });
// // });

// // API for getting user all posts photos not dp and cover photos
// app.get('/api/profile/userProfile/getUsersPhotos/:id', jwtAuthMiddleWare, async (req, res) => {
//     console.log('photos');
//     try {
//         const userId = req.params.id;

//         const usersPhotos = await Post.find({ user: userId }).select('post_image');

//         res.status(200).json({ status: 'success', message: 'All Photos retrived successfully!', photos: usersPhotos })
//     }
//     catch (error) {
//         res.status(401).json({ error: error, status: 'failure', message: 'All Photos retrived failed!' });
//         console.log(error);
//     }
// })

// // API for retrieving all notification of a user
// app.get('/api/profile/getAllNotifications', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const response = await Notification.find({
//             recipient: { $in: [req.userData.userData.userId] }
//         }).select('notification readBy createdAt')
//             .sort({ createdAt: -1 })

//         console.log('response=>', response);

//         const finalResult = response.map((n) => ({
//             _id: n._id,
//             notification: n.notification,
//             isRead: n.readBy?.includes(req.userData.userData.userId),
//             createdAt: n.createdAt
//         }));

//         let cnt = 0;
//         response.forEach((n) => {
//             if (!n.readBy?.includes(req.userData.userData.userId)) cnt++;
//         })

//         res.status(200).json({ status: 'success', message: 'All notifications retrived successfully!', notifications: finalResult, count: cnt })
//     }
//     catch (error) {
//         res.status(401).json({ error: error, status: 'failure', message: 'notifications retrived failed!' });
//         console.log(error);
//     }
// })

// // API for updating or marking notification as readed
// app.get('/api/profile/getAllNotifications/read/:id', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const notificationId = req.params.id;

//         const response = await Notification.findById(notificationId)
//             .select('readBy');

//         if (!response) {
//             return res.status(404).json({ status: 'failure', message: 'Notification not found!' });
//         }

//         if (!response.readBy.includes(req.userData.userData.userId)) {
//             response.readBy.push(req.userData.userData.userId);
//         }

//         await response.save();

//         res.status(200).json({ status: 'success', message: 'notification marked as read successfully!' });
//     }
//     catch (error) {
//         res.status(401).json({ error: error, status: 'failure', message: 'notifications read status updation failed!' });
//         console.log(error);
//     }
// })

// // API for updating user's personal data: about, relationship status, from
// app.post('/api/profile/newUserProfile/updateUserData', jwtAuthMiddleWare, async (req, res) => {
//     try {
//         const userId = req.userData.userData.userId;
//         const about = req.body.about || null;
//         const from = req.body.from || null;
//         const relationshipStatus = req.body.relationshipStatus || null;

//         const newUserData = {};

//         if (about !== null) newUserData.about = about;
//         if (from !== null) newUserData.from = from;
//         if (relationshipStatus != null) newUserData.relationshipStatus = relationshipStatus;

//         const response = await User.findByIdAndUpdate(userId, newUserData);

//         if (response) {
//             return res.status(200).json({ status: 'success', message: 'User data updated successfully!' });
//         }
//         else {
//             res.status(401).json({ error: error, status: 'failure', message: 'Problem in, User data updation!' });
//         }
//     }
//     catch (error) {
//         res.status(401).json({ error: error, status: 'failure', message: 'User data updation failed!' });
//         console.log(error);
//     }
// })

const connectedUserMap = new Map();

io.on('connection', (socket) => {
    socket.on('register', ({ userId }) => {
        connectedUserMap.set(userId, socket.id);
        console.log(`${userId} connected with socket id: ${socket.id}`);
    });


    socket.on('send-message', (message) => {
        const targetUserId = connectedUserMap.get(message.to);
        console.log(message.to, ' ==> ', message, ' ==> ', targetUserId);
        if (targetUserId) {
            io.to(targetUserId).emit('receive-message', message);
        }
    });

    // socket.on('send-message', ({message}) => {
    //     console.log(message.to,' ==> ',message);
    //     const targetUserId = connectedUserMap.get(message.to);
    //     if(targetUserId){
    //         io.to(targetUserId).emit('receive-message', message);
    //     }
    // });
})
// let mapUser = new Map();

// io.on('connection', (socket) => {
//     console.log('user connected with id', socket.id);

//     // socket.on('send-message', (message)=>{
//     //     console.log('Message from',socket.id,'=>',message);
//     //     // io.emit('receive-message', message);
//     //     socket.to(message.to).emit('receive-message', message);
//     // })

//     socket.on('send-message', (message) => {
//         const targetedUser = mapUser.get(message.to); //getting socket id of that user
//         if (targetedUser) {
//             io.to(targetedUser).emit('receive-message', message);
//         }
//     })

//     socket.on("register", ({ socketId, userId }) => {
//         if (!mapUser.get(userId)) {
//             mapUser.set(userId, socketId);  // ✅ CORRECT
//         }
//     });

// })





// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
