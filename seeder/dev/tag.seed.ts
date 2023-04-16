import { faker } from '@faker-js/faker';
import Tag, { TTag } from '../../src/models/Tag';

const createRandomTag = () => {
  const tags: TTag[] = [];
  Array.from({ length: 10 }).forEach(() => {
    tags.push({
      label: faker.random.words(1),
    });
  });
  return tags;
};

export const createTags = async () => {
  const randData = [];
  try {
    randData.push(...createRandomTag());
    const dataArr: TTag[] = [];
    const newDatas = randData.map((tag) => {
      return new Promise((resolve, reject) => {
        Tag.create(tag)
          .then((res) => {
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
    console.log('Error in seeding tags');
  }
};
