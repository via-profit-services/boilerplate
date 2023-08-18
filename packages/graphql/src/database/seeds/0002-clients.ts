/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import { Knex } from 'knex';
import type { ClientLegalStatus, ClientsTableModel, PersonsTableModel } from 'clients';

export async function seed(knex: Knex): Promise<any> {
  const firstNames = [
    'Антон',
    'Илья',
    'Олег',
    'Евгений',
    'Константин',
    'Максим',
    'Эдуард',
    'Александр',
  ];
  const secondNames = [
    'Иванов',
    'Петров',
    'Кузьмин',
    'Батрутдинов',
    'Милошин',
    'Бабаев',
    'Ирункин',
    'Становлянов',
  ];
  const lastNames = [
    'Владимирович',
    'Петрович',
    'Валерьевич',
    'Михайлович',
    'Станиславович',
    'Александрович',
  ];

  const heldPosts = [
    'Менеджер по продажам',
    'Руководитель',
    'Секретарь',
    'Руководитель отдела продаж',
    'Бухгалтер',
  ];

  const companyPrfix = [
    'Снаб',
    'Строй',
    'Клей',
    'Комплект',
    'Пром',
    'Прод',
    'Тур',
    'Мех',
    'Транс',
    'Екат',
    'Мос',
    'Новосиб',
  ];
  const companyEntity = ['ООО', 'ОАО', 'ИП', 'Person'];

  const legalStatuses: ClientLegalStatus[] = ['person', 'legal', 'entrepreneur', 'selfemployed'];

  await knex('clients').del();
  await knex('persons').del();

  // Fill the clients
  [...new Array(60).keys()].reduce(async prev => {
    await prev;

    const clients: ClientsTableModel[] = [];
    const persons: PersonsTableModel[] = [];

    [...new Array(300).keys()].forEach(() => {
      const date = new Date();
      const clientID = crypto.randomUUID();
      const createdAt = date.toDateString();
      const updatedAt = date.toDateString();

      const type = companyEntity[Math.floor(Math.random() * companyEntity.length)];
      const name =
        type === 'ИП'
          ? secondNames[Math.floor(Math.random() * secondNames.length)]
          : type === 'Person'
          ? [
              secondNames[Math.floor(Math.random() * secondNames.length)],
              firstNames[Math.floor(Math.random() * firstNames.length)],
              lastNames[Math.floor(Math.random() * lastNames.length)],
            ].join(' ')
          : [
              companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
              companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
              companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
            ].join('');

      clients.push({
        id: clientID,
        name: type === 'Person' ? name : `${type} ${name}`,
        legalStatus:
          type === 'Person'
            ? 'person'
            : legalStatuses[Math.floor(Math.random() * legalStatuses.length)],
        createdAt,
        updatedAt,
        status: Math.random() < 0.8 ? 'active' : 'inactive', // 80% of clients has been active status
        comment: Math.random() < 0.1 ? 'huge company' : null, // 10% of clients has been comment
      });

      const personsCount = Math.random() < 0.8 ? 1 : 2; // 80% of clients has been only single person
      [...new Array(personsCount).keys()].forEach(() => {
        const name = [
          secondNames[Math.floor(Math.random() * secondNames.length)],
          firstNames[Math.floor(Math.random() * firstNames.length)],
          lastNames[Math.floor(Math.random() * lastNames.length)],
        ].join(' ');

        persons.push({
          id: crypto.randomUUID(),
          createdAt,
          updatedAt,
          name,
          heldPost: heldPosts[Math.floor(Math.random() * heldPosts.length)],
          comment: Math.random() < 0.1 ? 'impudent' : null, // 10% of clients has been comment
          client: clientID,
        });
      });
    });

    await knex('clients').insert(clients);
    await knex('persons').insert(persons);
  }, Promise.resolve());
}
