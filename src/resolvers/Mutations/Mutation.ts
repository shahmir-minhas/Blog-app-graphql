import { postResolvers } from "./posts";
import { authResolvers } from "./auth";

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
