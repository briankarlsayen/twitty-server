import { Request, Response, NextFunction } from 'express';
import User, { IUser, TUser } from '../models/User';
import Mail from '../models/Mail';
import { sendEmail } from '../../utils/sendEmail';

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
  try {
    const user = await User.findOne({ email: username }).exec();
    if (!user)
      return res.status(422).json({ message: 'Invalid username or password' });
    const token = await user.getSignedJwtToken();
    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(422).json({ message: 'Invalid username or password' });

    res.status(200).json({ token, message: 'Successfully logged in' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const validEmail = await User.findOne({ email, isDeleted: false }).exec();
    if (!validEmail)
      return res.status(422).json({ message: 'Account does not exist' });
    const options = {
      userId: validEmail._id,
      to: email,
      subject: 'Forgot password',
      code: 'FP',
    };
    const response = await sendEmail(options);
    console.log('mail receipt', response);
    res.status(200).json({ success: true, message: 'Mail successfully sent' });
  } catch (error) {
    next(error);
  }
};

export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { id } = req.params;
  try {
    const mail = await Mail.findOne({ token: id }).exec();
    if (!mail)
      return res
        .status(422)
        .json({ message: 'Please request a password reset' });
    const user: any = await User.findOne({ _id: mail.userId }).exec();
    user.password = password;
    user.hasLogged = true;
    user.save();
    res.status(201).json({ message: 'Successfully updated' });
  } catch (error) {
    next(error);
  }
};
