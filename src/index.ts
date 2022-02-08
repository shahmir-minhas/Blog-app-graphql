import { ApolloServer, gql } from "apollo-server";
import { Query, Mutation } from "./resolvers";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./Utils/getUserFromToken";

// to access the db
const prisma = new PrismaClient();

// defining types in typescript use use interface keyword
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    user: number;
  } | null;
  //
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: async ({ req }: any): Promise<Context> => {
    //context gets the request
    console.log("=========== auth token", req.headers.authorization);
    const userInfo = await getUserFromToken(req.headers.authorization); //get user id
    console.log("User Info", userInfo);
    //return prisma and userId
    return {
      prisma,
      userInfo,
    };
  },
});

server.listen().then(({ url }) => {
  console.log("server is up at:", url);
});
