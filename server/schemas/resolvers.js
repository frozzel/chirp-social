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

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    followuser: async (parent, { username }, context) => {
      if (context.user) {
        const {currentuserid , receiveruserid} = req.body
        console.log(req.body)
        let currentuser = await User.findOne({_id : currentuserid})
        let currentUserFollowing = currentuser.following
        currentUserFollowing.updateOne(receiveruserid)
        currentuser.following = currentUserFollowing
        await User.updateOne({_id : currentuserid} , currentuser)
        let receiveruser = await User.findOne({_id : receiveruserid})
        let receiverUserFollowers   = receiveruser.followers
        receiverUserFollowers.updateOne(currentuserid)
        receiveruser.followers = receiverUserFollowers
        await User.updateOne({_id : receiveruserid} , receiveruser)
      }
      throw new AuthenticationError('You need to be logged in!');
      
    },
    unfollowuser: async (parent, { username }, context) => {
      if (context.user) {
        const {currentuserid , receiveruserid} = req.body
        console.log(req.body)
        let currentuser = await User.findOne({_id : currentuserid})
        let currentUserFollowing = currentuser.following
        const temp1 = currentUserFollowing.filter(obj=>obj.toString() !== receiveruserid)
        currentuser.following = temp1
        await User.updateOne({_id : currentuserid} , currentuser)
        let receiveruser = await User.findOne({_id : receiveruserid})
        let receiverUserFollowers   = receiveruser.followers
        const temp2 = receiverUserFollowers.filter(obj=>obj.toString()!==currentuserid)
        receiveruser.followers = temp2
        await User.updateOne({_id : receiveruserid} , receiveruser)
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addPost: async (parent, { description, image, likes, }, context) => {
      if (context.user) {
        const posts = await Post.create({
          description,
          image,
          user: context.user.username,
          likes,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { post: post._id } }
        );

        return posts;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (parent, { postId, user, comment }, context) => {
      if (context.user) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: {
              comments: { comment, user: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    updateProject: async (parent, { projectId }, context) => {
      if (context.user) {
        const project = await Project.findOneAndUpdate({
          _id: projectId,
          projectAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { projects: project._id } }
        );

        return project;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeProject: async (parent, { projectId }, context) => {
      if (context.user) {
        const project = await Project.findOneAndDelete({
          _id: projectId,
          projectAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { projects: project._id } }
        );

        return project;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    updateTikkit: async (parent, { projectId }, context) => {
      if (context.user) {
        const project = await Project.findOneAndUpdate({
          _id: projectId,
          projectAuthor: context.user.username,
          dueDate, 
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { projects: project._id } }
        );

        return project;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeTikkit: async (parent, { projectId, tikkitId }, context) => {
      if (context.user) {
        return Project.findOneAndDelete(
          { _id: projectId },
          {
            $pull: {
              tikkits: {
                _id: tikkitId,
                tikkitAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },
};

module.exports = resolvers;
