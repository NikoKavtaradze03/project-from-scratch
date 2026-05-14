export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
};

export type GetCommentsResponse = {
  comments: Comment[];
};

export type CreateCommentResponse = {
  comment: Comment;
};
