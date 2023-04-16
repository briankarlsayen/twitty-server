import { faker } from '@faker-js/faker';
import User, { TUser } from '../../src/models/User';

interface PUser {}

const item = {
  fullName: faker.name.fullName(),
  // email: faker.internet.email(),
  // role: roleArr[randomNum],
  // password: "123",
  // birthDate: faker.date.between(
  //   "1980-01-01T00:00:00.000Z",
  //   "2023-01-01T00:00:00.000Z",
  // ),
  // isActive: true,
  // bio: faker.lorem.paragraph(),
};

const createRandomUser = () => {
  const randomNum = Math.floor(Math.random() * 2);
  const roleArr = ['admin', 'client'];
  const users: TUser[] = [];
  Array.from({ length: 10 }).forEach(() => {
    users.push({
      fullName: faker.name.fullName(),
      email: faker.internet.email(),
      role: roleArr[randomNum],
      password: '123',
      birthDate: faker.date.between(
        '1980-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ),
      isActive: true,
      bio: faker.lorem.paragraph(),
    });
  });
  return users;
};

export const createUsers = async () => {
  const userData: TUser[] = [
    {
      fullName: 'admin',
      email: 'admin@mail.com',
      role: 'admin',
      password: '123',
      birthDate: new Date('01/01/2000'),
      isActive: true,
      bio: 'I am atomic',
    },
    {
      fullName: 'ainz',
      email: 'ainz@mail.com',
      role: 'client',
      password: '123',
      birthDate: new Date('01/01/2000'),
      isActive: true,
      bio: 'Madou Ou',
    },
  ];
  try {
    userData.push(...createRandomUser());
    const users: TUser[] = [];
    const newUsers = userData.map((user) => {
      return new Promise((resolve, reject) => {
        User.create(user)
          .then((res) => {
            users.push(res);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
    await Promise.all(newUsers);
    return users;
  } catch (err) {
    console.log('Error in seeding users');
  }
};
