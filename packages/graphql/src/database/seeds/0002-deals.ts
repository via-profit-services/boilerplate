/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import type { Knex } from 'knex';

import type {
  DealsTableModel,
  FunnelsTableModel,
  FunnelStepTableModel,
  ClientsToDealsTableRecord,
} from 'deals';
import type { ClientsTableModel, PersonsTableModel } from 'clients';

export async function seed(knex: Knex): Promise<any> {
  const date = new Date();
  const deals: DealsTableModel[] = [];
  const clients: ClientsTableModel[] = [];
  const persons: PersonsTableModel[] = [];
  const clients2deals: ClientsToDealsTableRecord[] = [];

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
  const companyEntity = ['ООО', 'ОАО', 'ИП'];
  const funnels: FunnelsTableModel[] = [
    {
      id: crypto.randomUUID(),
      label: 'Разработка сайтов',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      comment: null,
    },
  ];
  const steps: FunnelStepTableModel[] = [
    {
      id: crypto.randomUUID(),
      label: 'Неразобранное',
      color: '#777777',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 1,
      type: 'unprocessed',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Первичный контакт',
      color: '#5289ed',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 2,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Согласование и подписание договора',
      color: '#ed8c52',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 3,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Написание технического задания',
      color: '#8c52ed',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 4,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Согласование технического задания',
      color: '#ed52ad',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 5,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Ожидание оплаты',
      color: '#7c0049',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 6,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Разработка',
      color: '#c54603',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 7,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Тестирование и сдача',
      color: '#aec503',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 8,
      type: 'standard',
      funnel: funnels[0].id,
    },
    {
      id: crypto.randomUUID(),
      label: 'Проект сдан',
      color: '#0ac503',
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      order: 9,
      type: 'finished',
      funnel: funnels[0].id,
    },
  ];

  const ammounts = [250000, 190000, 75000, 130000, 120000, 140000, 180000];

  // Fill the clients
  [...new Array(60).keys()].forEach(() => {
    const date = new Date();
    const clientID = crypto.randomUUID();
    const createdAt = date.toDateString();
    const updatedAt = date.toDateString();

    const type = companyEntity[Math.floor(Math.random() * companyEntity.length)];
    const name =
      type === 'ИП'
        ? secondNames[Math.floor(Math.random() * secondNames.length)]
        : [
            companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
            companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
            companyPrfix[Math.floor(Math.random() * companyPrfix.length)],
          ].join('');

    clients.push({
      id: clientID,
      name: `${type} ${name}`,
      createdAt,
      updatedAt,
      legalStatus: 'entrepreneur',
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

  // fill the deals
  [...new Array(40).keys()].forEach(() => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const amount = ammounts[Math.floor(Math.random() * ammounts.length)];
    deals.push({
      id: crypto.randomUUID(),
      step: steps[Math.floor(Math.random() * steps.length)].id,
      funnel: funnels[0].id,
      createdAt: date.toDateString(),
      updatedAt: date.toDateString(),
      comment: null,
      label: `Сайт ${client.name.toLowerCase()}.рф`,
      amount: amount * 100,
    });
  });

  deals.forEach((deal, index) => {
    // First, we get the client by the index (It's fast).
    // Otherwise we get any client (It's slow)
    const client = clients[index] || clients[Math.floor(Math.random() * clients.length)];
    clients2deals.push({
      deal: deal.id,
      client: client.id,
    });
  });

  await knex('deals').del();
  await knex('clients').del();
  await knex('persons').del();
  await knex('funnels').del();
  await knex('funnelSteps').del();
  await knex('clients2deals').del();

  await knex('funnels').insert(funnels);
  await knex('funnelSteps').insert(steps);
  await knex('clients').insert(clients);
  await knex('persons').insert(persons);
  await knex('deals').insert(deals);
  await knex('clients2deals').insert(clients2deals);
}
