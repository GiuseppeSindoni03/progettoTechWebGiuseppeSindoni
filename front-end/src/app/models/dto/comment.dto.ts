export interface CommentDTO {
    ideaId: string;
    _id: string;
    author: {
      _id: string;
      username: string;
      profileImage: string;
    };
    content: string;
    timestamp: string;
  }
  