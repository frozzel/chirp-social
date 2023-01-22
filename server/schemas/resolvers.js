const { AuthenticationError } = require('apollo-server-express');
const { User, Post } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('posts', 'followers', 'following');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('posts', 'followers', 'following');
    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId });
    },
  },

  // Mutation: {
  //   addUser: async (parent, { username, email, password }) => {
  //     const user = await User.create({ username, email, password });
  //     const token = signToken(user);
  //     return { token, user };
  //   },
  //   login: async (parent, { email, password }) => {
  //     const user = await User.findOne({ email });

  //     if (!user) {
  //       throw new AuthenticationError('No user found with this email address');
  //     }

  //     const correctPw = await user.isCorrectPassword(password);

  //     if (!correctPw) {
  //       throw new AuthenticationError('Incorrect credentials');
  //     }

  //     const token = signToken(user);

  //     return { token, user };
  //   },
  //   followuser: async (parent, { username }, context) => {
  //     if (context.user) {
  //       const {currentuserid , receiveruserid} = req.body
  //       console.log(req.body)
  //       let currentuser = await User.findOne({_id : currentuserid})
  //       let currentUserFollowing = currentuser.following
  //       currentUserFollowing.updateOne(receiveruserid)
  //       currentuser.following = currentUserFollowing
  //       await User.updateOne({_id : currentuserid} , currentuser)
  //       let receiveruser = await User.findOne({_id : receiveruserid})
  //       let receiverUserFollowers   = receiveruser.followers
  //       receiverUserFollowers.updateOne(currentuserid)
  //       receiveruser.followers = receiverUserFollowers
  //       await User.updateOne({_id : receiveruserid} , receiveruser)
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
      
  //   },
  //   unfollowuser: async (parent, { username }, context) => {
  //     if (context.user) {
  //       const {currentuserid , receiveruserid} = req.body
  //       console.log(req.body)
  //       let currentuser = await User.findOne({_id : currentuserid})
  //       let currentUserFollowing = currentuser.following
  //       const temp1 = currentUserFollowing.filter(obj=>obj.toString() !== receiveruserid)
  //       currentuser.following = temp1
  //       await User.updateOne({_id : currentuserid} , currentuser)
  //       let receiveruser = await User.findOne({_id : receiveruserid})
  //       let receiverUserFollowers   = receiveruser.followers
  //       const temp2 = receiverUserFollowers.filter(obj=>obj.toString()!==currentuserid)
  //       receiveruser.followers = temp2
  //       await User.updateOne({_id : receiveruserid} , receiveruser)
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   updateProfile: async (parent, { username, profilePicUrl, bio, }, context) => {
  //     if (context.user) {
  //       const user = await User.findOneAndUpdate({
  //         _id: userId,
  //         username,
  //         profilePicUrl,
  //         bio,
  //       });

  //       await User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $push: { User: user._id } }
  //       );

  //       return project;
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   addPost: async (parent, { description, image, likes, }, context) => {
  //     if (context.user) {
  //       const posts = await Post.create({
  //         description,
  //         image,
  //         user: context.user.username,
  //         likes,
  //       });

  //       await User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $addToSet: { post: post._id } }
  //       );

  //       return posts;
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   addComment: async (parent, { postId, user, comment }, context) => {
  //     if (context.user) {
  //       return Post.findOneAndUpdate(
  //         { _id: postId },
  //         {
  //           $addToSet: {
  //             comments: { comment, user: context.user.username },
  //           },
  //         },
  //         {
  //           new: true,
  //           runValidators: true,
  //         }
  //       );
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   updatePost: async (parent, { postId, description,image }, context) => {
  //     if (context.user) {
  //       const post = await Post.findOneAndUpdate({
  //         _id: postId,
  //         description,
  //         image,
  //       });

  //       await User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $push: { posts: post._id } }
  //       );

  //       return project;
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   removePost: async (parent, { postId }, context) => {
  //     if (context.user) {
  //       const post = await Post.findOneAndDelete({
  //         _id: postId,
  //         user: context.user.username,
  //       });

  //       await User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $pull: { posts: post._id } }
  //       );

  //       return project;
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   updateComment: async (parent, { postId, user }, context) => {
  //     if (context.user) {
  //       const post = await Post.findOneAndUpdate({
  //         _id: postId,
  //         user: context.user.username,
  //         comment,
  //       });

  //       await User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $push: { posts: post._id } }
  //       );

  //       return project;
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   removeComment: async (parent, { postId, commentId }, context) => {
  //     if (context.user) {
  //       return Post.findOneAndDelete(
  //         { _id: postId },
  //         {
  //           $pull: {
  //             comments: {
  //               _id: commentId,
  //               user: context.user.username,
  //             },
  //           },
  //         },
  //         { new: true }
  //       );
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },

  // },
};

module.exports = resolvers;
