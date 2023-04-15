import { Request, Response, NextFunction } from 'express';
import { RequestWithInfo } from '../../types';
import Comment from '../models/Comment';
import { isValidObjectId } from 'mongoose';

export const createComment = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { body, postId } = req.body;
  const { userInfo } = req;
  try {
    if (!isValidObjectId(postId))
      return res.status(400).json({ message: 'Invalid post id' });
    console.log('userInfo', userInfo);
    const comment = await Comment.create({
      userId: userInfo?._id,
      body,
      postId,
    });
    if (!comment)
      return res.status(422).json({ message: 'Unable to create comment' });
    res.status(201).json({ message: 'Comment successfully created' });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { body } = req.body;
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: id },
      {
        body,
      }
    );
    if (!comment)
      return res.status(422).json({ message: 'Unable to update comment' });
    res.status(201).json({ message: 'Successfully updated comment' });
  } catch (err) {
    next(err);
  }
};

export const archiveComment = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid params id' });
    const comment = await Comment.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
      }
    );
    if (!comment)
      return res.status(422).json({ message: 'Unable to archive comment' });
    res.status(201).json({ message: 'Successfully archived comment' });
  } catch (err) {
    next(err);
  }
};
