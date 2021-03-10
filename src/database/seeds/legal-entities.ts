/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { cities } from '@via-profit-services/geography/dist/countries/RU';
import faker from 'faker';
import Knex from 'knex';

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

const getRandomCity = () => cities[randomInt(0, cities.length - 1)];


const getDirectorName = () => {
  const names = [
    ['Иванов Андрей Олегович', 'Иванова Андрея Олеговича', 'Иванов А. О.', 'Иванова А. О.'],
    ['Сидоров Михаил Александрович', 'Сидорова Михаила Александровича', 'Сидоров М. А', 'Сидорова М. А.'],
    ['Конюхов Альберт Гарифулович', 'Конюхова Альберта Гарифуловича', 'Конюхов А. Г.', 'Конюхов А. Г.'],
    ['Крупникова Анастасия Максимовна', 'Крупниковой Анастасии Максимовны', 'Крупникова А. М.', 'Крупниковой А. М.'],
    ['Бубликова Тамара Васильевна', 'Бубликовой Тамары Васильевны', 'Бубликова Т. В.', 'Бубликовой Т. В.'],
  ][randomInt(0, 4)];

  return {
    directorNameNominative: names[0],
    directorNameGenitive: names[1],
    directorNameShortNominative: names[2],
    directorNameShortGenitive: names[3],
  };
};

const generateINN = () => {
  const str = String(Math.floor(new Date().valueOf() * Math.random()));

  return `000${str}`.substr(0, 12);
};

const generateOGRN = () => {
  const str = String(Math.floor(new Date().valueOf() * Math.random()));

  return `000${str}`.substr(0, 13);
};
const generateKPP = () => {
  const str = String(Math.floor(new Date().valueOf() * Math.random()));

  return `000${str}`.substr(0, 9);
};
const generateBIC = () => {
  const str = String(Math.floor(new Date().valueOf() * Math.random()));

  return `04${str}`.substr(0, 9);
};
const generateRSKS = () => {
  const str = String(Math.floor(new Date().valueOf() * Math.random()));

  return `000000000${str}`.substr(0, 20);
};

export async function seed(knex: Knex): Promise<any> {
  const legalEntitiesData = [...Array(LEGAL_ENTITIES_QUANTITY).keys()].map(() => {
    const id = faker.random.uuid();
    const companyName = faker.company.companyName();
    const paymentsArray = [...Array(3).keys()].map(() => ({
      id: faker.random.uuid(),
      bic: generateBIC(),
      rs: generateRSKS(),
      ks: generateRSKS(),
      bank: [
        'Публичное акционерное общество «Сбербанк России»',
        'АО «Тинькофф Банк»',
        'Точка ПАО Банка «ФК Открытие»',
        'АКЦИОНЕРНОЕ ОБЩЕСТВО «АЛЬФА-БАНК»',
      ][randomInt(0, 3)],
      owner: id,
    }));

    return {
      id,
      label: `Company ${companyName}`,
      nameFull: `Full name of ${companyName}`,
      nameShort: `Short name of ${companyName}`,
      address: [
        faker.address.zipCode(),
        ',',
        faker.address.state(),
        faker.address.city(),
        faker.address.streetAddress(),
        faker.address.secondaryAddress(),
      ].join(' '),
      ogrn: generateOGRN(),
      inn: generateINN(),
      kpp: generateKPP(),
      city: getRandomCity().id,
      payments: paymentsArray.splice(0, randomInt(1, 3)),
      ...getDirectorName(),
    };
  });


  return knex('legalEntities')
    .del()
    .then(() => knex('legalEntities').insert(
      legalEntitiesData.map((legalEntity) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { payments, ...data } = legalEntity;

        return data;
      }),
    ))
    .then(async () => {
      await knex('legalEntitiesPayments').del();

      const paymentsInsertData: any[] = [];
      legalEntitiesData.forEach((legalEntity) => {
        legalEntity.payments.forEach((payment) => {
          paymentsInsertData.push(payment);
        });
      });

      await knex('legalEntitiesPayments').insert(paymentsInsertData);
    });
}
