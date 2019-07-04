import faker from 'faker';
import { hashPassword } from '../src/helpers/helpers';

const newPassword = Math.random().toString(36).slice(-10);
const password = hashPassword(newPassword);

const socialProviders = ['Google', 'Facebook', 'Twitter'];
const social = socialProviders[Math.floor(Math.random() * socialProviders.length)];

export const newSocialUser = () => ({
  firstname: faker.random.alphaNumeric(8),
  lastname: faker.random.alphaNumeric(8),
  password,
  email: faker.internet.email(),
  image_url: faker.image.image(),
  social
});

export const randomSocialUser = {
  id: faker.random.number(),
  firstname: faker.random.alphaNumeric(8),
  lastname: faker.random.alphaNumeric(8),
  password,
  emails: [{ value: faker.internet.email() }],
  image_url: [{ value: faker.image.image() }],
  social: 'Google'
};

export const userWithNoEmail = {
  id: faker.random.number(),
  firstname: faker.random.alphaNumeric(8),
  lastname: faker.random.alphaNumeric(8),
  password,
  emails: [{ value: faker.internet.email() }],
  image_url: [{ value: faker.image.image() }],
  social
};
