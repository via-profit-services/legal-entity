/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import faker from 'faker/locale/ru';
import * as Knex from 'knex';

const LEGAL_ENTITIES_QUANTITY = 109;

const randomInt = (min?: number, max?: number) => {
  const data = { min, max };

  if (typeof min === 'undefined') {
    data.min = randomInt(99999);
  }

  if (typeof max === 'undefined') {
    data.max = data.min * 2;
  }

  return Math.floor(Math.random() * (data.max - data.min + 1) + data.min);
};

const getDirectorName = () => {
  const names = [
    ['Иванов Андрей Олегович', 'Иванова Андрея Олеговича'],
    ['Сидоров Михаил Александрович', 'Сидорова Михаила Александровича'],
    ['Конюхов Альберт Гарифулович', 'Конюхова Альберта Гарифуловича'],
    ['Крупникова Анастасия Максимовна', 'Крупниковой Анастасии Максимовны'],
    ['Бубликова Тамара Васильевна', 'Бубливовой Тамары Васильевны'],
  ][randomInt(0, 4)];

  return {
    directorNameNominative: names[0],
    directorNameGenitive: names[1],
  };
};

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('legalEntities')
    .del()
    .then(() => knex('legalEntities').insert(
      [...Array(LEGAL_ENTITIES_QUANTITY).keys()].map(() => ({
        id: faker.random.uuid(),
        name: faker.company.companyName(),
        address: [
          faker.address.zipCode(),
          ',',
          faker.address.state(),
          faker.address.city(),
          faker.address.streetAddress(),
          faker.address.secondaryAddress(),
        ].join(' '),
        ogrn: faker.finance.iban(),
        kpp: faker.finance.iban(),
        inn: `${faker.finance.account().toString()}${faker.finance.account().toString()}`,
        rs: faker.finance.iban(),
        ks: faker.finance.iban(),
        bic: faker.finance.iban(),
        bank: [
          'Публичное акционерное общество «Сбербанк России»',
          'АО «Тинькофф Банк»',
          'Точка ПАО Банка «ФК Открытие»',
          'АКЦИОНЕРНОЕ ОБЩЕСТВО «АЛЬФА-БАНК»',
        ][randomInt(0, 3)],
        ...getDirectorName(),
      })),
    ));
}
