import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
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
