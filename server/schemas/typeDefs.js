const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  password: String
  profilePicUrl: String
  posts: [Post]!
  followers: [User]!
  following : [User]!
  bio: String
  savedPosts: [User]
  archeivedPosts: [User]
  createdAt: String
}

type Post {
  _id: ID
  description: String
  image: String
  comments: [Comment]!
  likes: [User]!
  user: User
  createdAt: String
  
}


type Comment {
  user: User
  date: String
  comment: String
}

type likes {
  user: User
  date: String
}

type Auth {
  token: ID!
  user: User
}

type Query {
  users: [User]
  user(username: String!): User
  posts(username: String): [Post]
  post(postId: ID!): Post
}


`;

module.exports = typeDefs;

// type Mutation {
//   addUser(username: String!, email: String!, password: String!): Auth
//   login(email: String!, password: String!): Auth
//   followuser(username: String!): User
//   unfollowuser(username: String!): User
//   addPost(description: String!, image: String!, likes!: string): Post
//   addComment(postId: ID!, comment: String!): Post
//   updateProfile(username: String!, bio: String!, profilePicUrl: String!): User
//   updatePost(postId: ID!, description: String!, image: String!): Post
//   updateComment(postId: ID!, commentId: ID!, comment: String!): Post
//   removePost(postId: ID!): Post
//   removeComment(postId: ID!, commentId: ID!): Post
  
// }