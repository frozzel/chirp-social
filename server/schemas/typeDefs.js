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

type followers {
  User: User
}

type following {
  User: User
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

type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  followuser(username: String!): User
  unfollowuser(username: String!): User
  addPost(description: String!, image: String!, likes!: string): Post
  addComment(postId: ID!, comment: String!): Post
  
  addTikkit(projectId: ID!, tikkitText: String! ): Project
  updateProject(projectId: ID!): Project
  updateTikkit(projectId: ID!, tikkitText: String! ): Project
  removeProject(projectId: ID!): Project
  removeTikkit(projectId: ID!, tikkitId: ID! ): Project
}
`;

module.exports = typeDefs;