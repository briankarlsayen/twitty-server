import { Request, Response, NextFunction } from 'express';
import { RequestWithInfo } from '../../types';
import Post from '../models/Post';
import { isValidObjectId } from 'mongoose';

export const createPost = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { body, image, tags } = req.body;
  const { userInfo } = req;
  try {
    const post = await Post.create({
      userId: userInfo?._id,
      body,
      image,
      tags,
    });
    if (!post)
      return res.status(422).json({ message: 'Unable to create post' });
    res.status(201).json({ message: 'Post successfully created' });
  } catch (err) {
    next(err);
  }
};

export const displayPosts = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const postPerPage = 5;
  const { page } = req.query;
  const emptyPipeline = { $addFields: {} };
  const postLimit = page
    ? {
        $limit: postPerPage,
      }
    : emptyPipeline;
  const postSkip = page
    ? {
        $skip: postPerPage * (Number(page) - 1),
      }
    : emptyPipeline;
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          $and: [{ isDeleted: false }, { isActive: true }],
        },
      },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ['$postId', '$$postId'] } },
                  { isDeleted: false },
                  { isActive: true },
                ],
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $project: {
                body: 1,
                likes: 1,
                user: { $arrayElemAt: ['$user', 0] },
              },
            },
          ],
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'tags',
          let: { tags: '$tags' },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $in: ['$_id', '$$tags'] } },
                  { isDeleted: false },
                  { isActive: true },
                ],
              },
            },
            {
              $project: {
                label: 1,
              },
            },
          ],
          as: 'tags',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      postSkip,
      postLimit,
    ]).exec();
    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
};

export const viewPost = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid params id' });
    const post = await Post.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    }).exec();

    if (!post) return res.status(422).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { body, image, tags } = req.body;
  try {
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        body,
        image,
        tags,
      }
    );
    if (!post)
      return res.status(422).json({ message: 'Unable to update post' });
    res.status(201).json({ message: 'Successfully updated post' });
  } catch (err) {
    next(err);
  }
};

export const archivePost = async (
  req: RequestWithInfo,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid params id' });
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
      }
    );
    if (!post)
      return res.status(422).json({ message: 'Unable to archive post' });
    res.status(201).json({ message: 'Successfully archived post' });
  } catch (err) {
    next(err);
  }
};
