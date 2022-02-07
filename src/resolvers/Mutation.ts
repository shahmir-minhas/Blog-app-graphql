import { Post } from "@prisma/client";
import { Context } from "../index";

interface PostCreateArgs {
  title: string;
  content: string;
}
interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and content to create a post",
          },
        ],
        post: null,
      };
    } else {
      // console.log(title + " " + content);
      const post = await prisma.post.create({
        data: {
          title,
          content,
          autherId: 1,
        },
      });
      return {
        userErrors: [],
        post,
      };
    }
  },
};

// using _ and __ means that
// we dont want to use parent and args
