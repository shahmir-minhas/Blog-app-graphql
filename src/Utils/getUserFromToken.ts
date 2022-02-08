import JWT from "jsonwebtoken";
import { JWT__SIGNATIRE } from "../resolvers/Keys";

export const getUserFromToken = (token: string) => {
  //verfication of token
  try {
    console.log("i am here");
    return JWT.verify(token, JWT__SIGNATIRE) as {
      user: number;
    }; //token and key which return userId
  } catch (error) {
    console.log("error form token: getUserFromToken", error);
    return null;
  }
};
