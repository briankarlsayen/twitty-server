import { Request, Response, NextFunction } from 'express';
import User, { TUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { RequestWithInfo } from '../../types';
const { isValidObjectId } = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET ?? 'taguro';

export const displayUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.query;
    const users = await User.aggregate([
      {
        $match: {
          $and: [
            { isDeleted: false },
            role ? { $expr: { $eq: ['$role', role] } } : {},
          ],
        },
      },
    ]).exec();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

export const viewUser = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { userInfo } = req;
  try {
    const accessParams = jwt.sign(
      {
        accessKey: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    const params = {
      accessParams,
      ...userInfo,
    };

    res.status(200).json(params);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { userInfo } = req;
  const { fullName, email, password, birthDate, image, bio } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userInfo?._id },
      {
        fullName,
        email,
        password,
        birthDate,
        image,
        bio,
        role: 'client',
      }
    );
    if (!user)
      return res.status(422).json({ message: 'Unable to update user' });
    res.status(201).json({ message: 'Successfully updated user' });
  } catch (err) {
    next(err);
  }
};

export const archiveUser = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid params id' });
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
      }
    );
    if (!user)
      return res.status(422).json({ message: 'Unable to archive user' });
    res.status(201).json({ message: 'Successfully archived user' });
  } catch (err) {
    next(err);
  }
};
