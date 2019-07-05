import faker from 'faker';

export const randomSocialUser = {
  id: faker.random.number(),
  name: { familyName: 'Nnamani', givenName: 'Nzubechukwu' },
  emails: [{ value: faker.internet.email() }],
  photos: [{ value: faker.image.image() }],
  provider: 'google'
};
export const randomTwitterUser = {
  id: faker.random.number(),
  displayName: 'Nzube Nnamani',
  emails: [{ value: faker.internet.email() }],
  photos: [{ value: faker.image.image() }],
  provider: 'twitter'
};
