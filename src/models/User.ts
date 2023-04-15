import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { ObjectId } = Schema.Types;

/**
 * Type to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */

export type TUser = {
  fullName: string;
  email: string;
  password: string;
  birthDate?: Date;
  role: string;
  image?: string;
  bio?: string;
  followers?: [];
  isActive?: boolean;
  isDeleted?: boolean;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TUser
 * @param fullName:string
 * @param email:string
 * @param password:string
 * @param birthDate:Date
 * @param role:string
 * @param image:string
 * @param bio:string
 * @param followers:[]
 * @param isActive:boolean
 * @param isDeleted:boolean
 */

export interface IUser extends TUser, Document {
  getSignedJwtToken(): string;
  comparePassword(str: string): boolean;
}

const userSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please input full name.'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'client'],
        message: 'Invalid user role',
      },
      required: [true, 'Please input user role'],
    },
    image: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    followers: {
      type: [ObjectId],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param fullName:string
 * @param email:string
 * @param password:string
 * @param birthDate:Date
 * @param role:string
 * @param image:string
 * @param bio:string
 * @param followers:[]
 * @param isActive:boolean
 * @param isDeleted:boolean
 */

userSchema.pre('save', async function (next) {
  if (this.password) {
    let salt = 10;
    let hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  return next();
});

userSchema.methods.comparePassword = async function validatePassword(
  data: any
) {
  if (this.password) {
    return bcrypt.compare(data, this.password);
  }
};

userSchema.methods.getSignedJwtToken = async function () {
  if (process.env.JWT_SECRET) {
    console.log('id', this._id);
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
  }
};

const User = model<IUser>('User', userSchema);

export default User;
