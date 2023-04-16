import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../src/models/User';
const { ObjectId } = Types;
import { Request, Response, NextFunction } from 'express';
import { RequestWithInfo } from '../types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'taguro';

interface IDecodedData {
  id: string;
}

export default async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  try {
    const publicApis = [
      '/auth/login',
      '/auth/register',
      '/auth/setpass/:id',
      '/auth/forgotpassword',
    ];

    // * convert url id to :id
    const urls = req.url.split('/');

    const newUrl = urls.map((url) => {
      if (url.length >= 24) return ':id'; // * mongoose id len = 24
      return url;
    });
    const joinNewUrl = newUrl.join('/');
    if (publicApis.includes(joinNewUrl)) return next();

    const token = req?.headers?.authorization?.replace('Bearer ', '');
    if (!token) return next();
    const data = jwt.verify(token, JWT_SECRET) as IDecodedData;

    const [user] = await User.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: ['$_id', new ObjectId(data.id)] } },
            { isActive: true },
            { isDeleted: false },
          ],
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          birthDate: 1,
          image: 1,
          bio: 1,
          role: 1,
          followers: 1,
        },
      },
    ]);

    if (!user) throw new Error();

    req.userInfo = user;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json(error);
    }
    return res
      .status(401)
      .json({ message: 'Not authorized to access this resource' });
  }
};
