import { Request, Response, NextFunction } from 'express';
import User, { TUser } from '../models/User';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password, birthDate, role, image, bio } = req.body;

  // * build profile object based on TUser
  const userFields: TUser = {
    fullName,
    email,
    password,
    birthDate,
    role: role ?? 'client',
    image,
    bio,
  };
  try {
    const user = await User.create(userFields);
    if (!user) return res.status(422).json({ message: 'Unable to create' });
    res.status(201).json({ message: 'Successfully create', success: true });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // const userFields: TUser = {
  //   email,
  //   password,
  // };
  try {
    const user = await User.findOne({ email: username }).exec();
    if (!user)
      return res.status(422).json({ message: 'Invalid username or password' });
    const token = await user.getSignedJwtToken();
    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(422).json({ message: 'Invalid username or password' });

    console.log('token', token);
    res.status(200).json({ token, message: 'Successfully logged in' });
  } catch (error) {
    next(error);
  }
};
