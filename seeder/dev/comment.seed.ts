const { faker } = require('@faker-js/faker');
import User from '../../src/models/User';
import Post from '../../src/models/Post';
import Comment, { TComment } from '../../src/models/Comment';

const getUserId = async () => {
  const userCount = await User.count().exec();
  const random = Math.floor(Math.random() * userCount);
  const user = await User.findOne().skip(random).exec();

  return user?._id;
};

const getPostId = async () => {
  const userCount = await Post.count().exec();
  const random = Math.floor(Math.random() * userCount);
  const post = await Post.findOne().skip(random).exec();

  return post?._id;
};

const createRandomComment = async () => {
  const promises = [];
  const postsCount = 10;
  for (let i = 0; i < postsCount; i++) {
    promises.push({
      userId: await getUserId(),
      postId: await getPostId(),
      body: faker.lorem.paragraph(),
    });
  }
  const posts = await Promise.all(promises);
  return posts;
};

export const createComments = async () => {
  const randData = [];

  try {
    randData.push(await createRandomComment());
    const dataArr: TComment[] = [];
    const newDatas = randData.map((comment) => {
      return new Promise((resolve, reject) => {
        Comment.create(comment)
          .then((res: any) => {
            dataArr.push(res);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
    await Promise.all(newDatas);
    return dataArr;
  } catch (err) {
    console.log('Error in seeding comments');
  }
};
