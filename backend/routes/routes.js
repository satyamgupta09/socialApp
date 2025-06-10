const express = require('express');
const app = express();
const { jwtAuthMiddleWare, GenerateToken } = require('../middleware/jwt');
const router = express.Router();
const controller = require('../controller/usercontroller');

router.post('/api/signup', controller.register);

router.post('/api/signin', controller.login);

router.get('/api/profile', jwtAuthMiddleWare, controller.getProfile);

router.post('/api/profile/post', jwtAuthMiddleWare, controller.getAllpost);

// router.get('/api/profile/post/find', jwtAuthMiddleWare, controller.);

// changing from get to post
router.post('/api/profile/post/find/UserPost/:email', jwtAuthMiddleWare, controller.getUserPost);

router.post('/api/profile/post/comment', jwtAuthMiddleWare, controller.createComment);

// changes from  get to post
router.post('/api/profile/post/comment/find', controller.getComment);

router.delete('/api/profile/post/delete/:id', jwtAuthMiddleWare, controller.deletePost);

router.delete('/api/profile/post/comment/delete/:id', jwtAuthMiddleWare, controller.deleteComment);

// changing from get to post
router.post('/api/profile/allFriends', jwtAuthMiddleWare, controller.getSuggestions);

router.post('/api/profile/allFriends/upload/:id', jwtAuthMiddleWare, controller.uploadDp);

router.post('/api/profile/allFriends/coverPhoto/upload/:id', jwtAuthMiddleWare, controller.uploadCoverPhoto);

router.post('/api/profile/post/upload/:id', jwtAuthMiddleWare, controller.uploadPost);

// router.get('/api/profile/allFriends/:id');

router.post('/api/profile/newUserProfile/friend', jwtAuthMiddleWare, controller.findUsers_Friends);

router.post('/api/profile/likePost/:id', jwtAuthMiddleWare, controller.postLike_comment_Like);

router.post('/api/profile/userProfile', jwtAuthMiddleWare, controller.getUserData);

router.post('/api/profile/userProfile/addFreind', jwtAuthMiddleWare, controller.createFriendRequest);

router.get('/api/profile/userProfile/unFriend/:id', jwtAuthMiddleWare, controller.unFriend);

router.post('/api/profile/userProfile/addFreind/Accept/:id', jwtAuthMiddleWare, controller.acceptFriendRequest);

router.post('/api/profile/userProfile/addFreind/DeleteRequest/:id', jwtAuthMiddleWare, controller.deleteFriendRequest);

router.get('/api/profile/userProfile/addFreindButton/GetFriendRequest', jwtAuthMiddleWare, controller.getAllFriendRequest);

router.post('/api/profile/userProfile/addFreindButton/friendRequestStatus', jwtAuthMiddleWare, controller.buttonStatus);

router.get('/api/profile/userProfile/addFreindButton/friendRequest/confirmDeleteButton/:id', jwtAuthMiddleWare, controller.confirmAndDelete_buttonStatus);

router.get('/api/profile/userProfile/getUsersPhotos/:id', jwtAuthMiddleWare, controller.getUserPhotos);

router.get('/api/profile/getAllNotifications', jwtAuthMiddleWare, controller.getAllUserNotification);

router.get('/api/profile/getAllNotifications/read/:id', jwtAuthMiddleWare, controller.markAsReadNotification);

router.post('/api/profile/newUserProfile/updateUserData', jwtAuthMiddleWare, controller.updateUserPersonalData);

module.exports = router;