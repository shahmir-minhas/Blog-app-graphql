import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  type Mutation {
    postCreate(post: PostInputs!): PostPayload!
    postUpdate(postId: ID!, post: PostInputs!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    signup(
      credentials: CredentialsInput!
      bio: String
      name: String!
    ): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    isMyProfile: Boolean!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }
  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }
  input PostInputs {
    title: String
    content: String
  }
  input CredentialsInput {
    email: String!
    password: String!
  }
`;
