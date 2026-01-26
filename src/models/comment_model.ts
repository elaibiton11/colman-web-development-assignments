import mongoose from 'mongoose';

export interface IComment {
  postId: mongoose.Types.ObjectId;
  sender: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
