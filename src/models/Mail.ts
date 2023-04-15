import { Document, model, Schema, Types } from 'mongoose';
const { ObjectId } = Types;

export type TMail = {
  token: string;
  userId: string;
  to: string;
  subject: string;
  code?: string;
  otpCode?: string;
  expires?: Date;
  isDeleted?: boolean;
};

export interface IComment extends TMail, Document {}

const mailSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: true,
  },
  otpCode: {
    type: String,
    default: null,
  },
  expires: {
    type: Date,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Mail = model<IComment>('Mail', mailSchema);

export default Mail;
