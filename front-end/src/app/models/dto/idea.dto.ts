import { CommentDTO } from "./comment.dto";

export interface IdeaDTO {
  _id: string;
  title: string;
  content: string;
  contentHtml: string;
  timestamp: string;
  author: {
    _id: string;
    username: string;
    profileImage: string;
  };
  comments: CommentDTO[];
  upvotes: number;
  downvotes: number;
}
