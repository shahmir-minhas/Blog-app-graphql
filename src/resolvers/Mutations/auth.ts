import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT__SIGNATIRE } from "../Keys";
// import { User, Prisma } from "@prisma/client";

interface SignupArgs {
  credentials: {
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
    { credentials, bio, name }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    //  validations
    const isEmail = validator.isEmail(email);
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

    const isValidPassword = validator.isLength(password, {
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
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hasedPassword, name },
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

  signin: async (
    _: any,
    { credentials }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [
          {
            message: "Invalid Credentials",
          },
        ],
        token: null,
      };
    }
    const isMathed = await bcrypt.compare(password, user.password);
    if (!isMathed) {
      return {
        userErrors: [
          {
            message: "Invalid Credentials",
          },
        ],
        token: null,
      };
    }
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
      userErrors: [],
      token: token,
    };
  },
};
