import { Document, model, Schema, Types } from 'mongoose';
const { ObjectId } = Types;

export type TComment = {
  userId: string;
  postId: string;
  body: string;
  likes?: [];
  isActive?: boolean;
  isDeleted?: boolean;
};

export interface IComment extends TComment, Document {}

const commentSchema: Schema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, 'Please input user id.'],
    },
    postId: {
      type: ObjectId,
      required: [true, 'Please input post id.'],
    },
    body: {
      type: String,
      required: [true, 'Please input body.'],
    },
    likes: {
      type: [ObjectId],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
