/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import type { Knex } from 'knex';

import type { ClientsTableRecord } from 'clients';
import type {
  DealsTableModel,
  FunnelsTableModel,
  FunnelStepTableModel,
  ClientsToDealsTableRecord,
} from 'deals';

export async function seed(knex: Knex): Promise<any> {
  const date = new Date();
  const deals: DealsTableModel[] = [];
  const clients2deals: ClientsToDealsTableRecord[] = [];
  const randomClients = await knex.select('*').from<ClientsTableRecord>('clients').limit(10);

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
  // fill the deals
  [...new Array(40).keys()].forEach(() => {
    const client = randomClients[Math.floor(Math.random() * randomClients.length)];
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
    const client =
      randomClients[index] || randomClients[Math.floor(Math.random() * randomClients.length)];
    clients2deals.push({
      deal: deal.id,
      client: client.id,
    });
  });

  await knex('deals').del();
  await knex('funnels').del();
  await knex('funnelSteps').del();
  await knex('clients2deals').del();

  await knex('funnels').insert(funnels);
  await knex('funnelSteps').insert(steps);
  await knex('deals').insert(deals);
  await knex('clients2deals').insert(clients2deals);
}
