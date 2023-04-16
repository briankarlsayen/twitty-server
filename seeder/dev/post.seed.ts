import { faker } from '@faker-js/faker';
import User from '../../src/models/User';
import Post, { TPost } from '../../src/models/Post';
import Tag from '../../src/models/Tag';

const getUserId = async () => {
  const userCount = await User.count().exec();
  const random = Math.floor(Math.random() * userCount);
  const user = await User.findOne().skip(random).exec();

  return user?._id;
};

const getTagsId = async () => {
  const tagArr = [];
  const maxTagCount = 5;
  const randomNum = Math.floor(Math.random() * maxTagCount);

  const count = await Tag.count().exec();
  const randArr = [];
  for (let i = 0; i < randomNum; i++) {
    randArr.push(Math.floor(Math.random() * count));
  }

  const uniqueRand = [...new Set(randArr)]; // filter for unique tags
  for (let j = 0; j < uniqueRand.length; j++) {
    const tag = await Tag.findOne().skip(uniqueRand[j]).exec();
    tagArr.push(tag?._id);
  }

  return tagArr;
};

const getLikesId = async () => {
  const likesArr = [];
  const maxLikesCount = 5;
  const randomNum = Math.floor(Math.random() * maxLikesCount);

  for (let j = 0; j < randomNum; j++) {
    const id = await getUserId();
    likesArr.push(id);
  }
  return [...new Set(likesArr)];
};

const createRandomPost = async (postsCount: number) => {
  const promises = [];
  // const postsCount = 10;
  for (let i = 0; i < postsCount; i++) {
    promises.push({
      userId: await getUserId(),
      body: faker.lorem.paragraph(),
      image: faker.image.animals(),
      tags: await getTagsId(),
      likes: await getLikesId(),
    });
  }
  const posts = await Promise.all(promises);
  return posts;
};

export const createPosts = async (number: number) => {
  const postData = [];

  try {
    postData.push(await createRandomPost(number));
    const posts: TPost[] = [];
    const newPosts = postData.map((post) => {
      return new Promise((resolve, reject) => {
        Post.create(post)
          .then((res: any) => {
            posts.push(res);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
    await Promise.all(newPosts);
    return posts;
  } catch (err) {
    console.log('Error in seeding posts');
  }
};
