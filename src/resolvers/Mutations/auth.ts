import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT__SIGNATIRE } from "../Keys";
// import { User, Prisma } from "@prisma/client";

interface SignupArgs {
  credentails: {
    password: string;
    email: string;
  };
  name: string;
  bio: string;
}
interface UserPayload {
  userErrors: {
    message: string;
  }[];
  // user: User | Prisma.Prisma__UserClient<User> | null;
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentails, bio, name }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    //  validations
    const isEmail = validator.isEmail(credentails.email);
    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "invalid email",
          },
        ],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(credentails.password, {
      min: 5,
    });
    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "invalid password, must be graeter than 5 characters",
          },
        ],
        token: null,
      };
    }

    const isName = validator.isEmpty(name);
    console.log(isName);
    if (isName) {
      return {
        userErrors: [
          {
            message: "invalid name, Kindly provide valid name",
          },
        ],
        token: null,
      };
    }
    const hasedPassword = await bcrypt.hash(credentails.password, 10);
    const user = await prisma.user.create({
      data: { email: credentails.email, password: hasedPassword, name },
    });
    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });
    const token = await JWT.sign(
      {
        user: user.id,
        email: user.email,
      },
      JWT__SIGNATIRE,
      {
        expiresIn: 3600,
      }
    );
    return {
      userErrors: [
        {
          message: "user created",
        },
      ],
      token: token,
    };
  },
};
