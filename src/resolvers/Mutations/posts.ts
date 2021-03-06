import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../Utils/canUserMutatePost";

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

export const postResolvers = {
  //================================================================================ Create
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    console.log("========== create post ==============");
    console.log(userInfo);
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "sign in to create post",
          },
        ],
        post: null,
      };
    }
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
            autherId: userInfo.user,
          },
        }),
      };
    }
  },
  //================================================================================ Update
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    // auth user
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "sign in to create post",
          },
        ],
        post: null,
      };
    }
    // check if user can update this post or not
    const err = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    if (err) return err;
    const { title, content } = post;
    // checks if fields have values
    if (!title && !content) {
      return {
        userErrors: [
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
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    // auth user
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "sign in to create post",
          },
        ],
        post: null,
      };
    }
    // check if user can update this post or not
    const err = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
  //================================================================================ Pulish

  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: true,
        },
      }),
    };
  },
  //================================================================================ unpublish
  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: false,
        },
      }),
    };
  },
};

// using _ and __ means that
// we dont want to use parent and args
