import { Document, model, Schema } from 'mongoose';
const { ObjectId } = Schema.Types;

export type TPost = {
  userId: string;
  body: string;
  image?: string;
  likes?: [];
  tags?: [];
  isActive?: boolean;
  isDeleted?: boolean;
};

export interface IPost extends TPost, Document {}

const postSchema: Schema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, 'Please input user id.'],
    },
    body: {
      type: String,
      required: [true, 'Please input body.'],
    },
    image: {
      type: String,
      default: null,
    },
    likes: {
      type: [ObjectId],
      default: [],
    },
    tags: {
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

const Post = model<IPost>('Post', postSchema);

export default Post;
