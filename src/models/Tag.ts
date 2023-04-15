import { Document, model, Schema } from 'mongoose';

export type TTag = {
  label: string;
  isActive?: boolean;
  isDeleted?: boolean;
};

export interface ITag extends TTag, Document {}

const tagSchema: Schema = new Schema(
  {
    label: {
      type: String,
      required: [true, 'Please input tag label.'],
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

const Tag = model<ITag>('Tag', tagSchema);
export default Tag;
