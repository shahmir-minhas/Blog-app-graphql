import { Post, Prisma } from "@prisma/client";
import { Context } from "../index";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const Mutation = {
  //================================================================================ Create
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = post;
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
      return {
        userErrors: [],
        post: prisma.post.create({
          data: {
            title,
            content,
            autherId: 1,
          },
        }),
      };
    }
  },
  //================================================================================ Update
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma }: Context
  ) => {
    const { title, content } = post;
    // checks if fields have values
    if (!title && !content) {
      return {
        userError: [
          {
            message: "Need to have at least one field to update!",
          },
        ],
        post: null,
      };
    }
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need to have at least on e field to update",
          },
        ],
        post: null,
      };
    }
    // gets existing posts
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    //checks if posts exists
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    // creating a payload
    let payloadToUpdate = {
      title,
      content,
    };
    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          ...payloadToUpdate,
        },
      }),
    };
  },
  //================================================================================ Delete
  postDelete: (_: any, __: any, { prisma }: Context) => {},
};

// using _ and __ means that
// we dont want to use parent and args