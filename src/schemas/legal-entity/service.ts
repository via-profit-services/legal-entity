/* eslint-disable camelcase */
import {
  IListResponse,
  TOutputFilter,
  convertOrderByToKnex,
  convertWhereToKnex,
  TWhereAction,
  arrayOfIdsToArrayOfObjectIds,
} from '@via-profit-services/core';
import cities from '@via-profit-services/geography/dist/countries/RU/cities.json';
import moment from 'moment-timezone';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

import {
  EXTERNAL_SEARCH_API_TOKEN,
  EXTERNAL_SEARCH_API_URL_COMPANIES,
  EXTERNAL_SEARCH_API_URL_PAYMENTS,
} from './constants';
import {
  Context, ILegalEntity, TLegalEntityInputTable, ILegalEntityPayment, ILegalEntityPaymentInputTable,
  ILegalEntityPaymentOutputTable, ILegalEntityOutputTable, ILegalEntityExternalSearchResult,
} from './types';


class LegalEntitiesService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public static getLegalEntityDefaultData(): TLegalEntityInputTable {
    return {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      label: '',
      nameFull: '',
      nameShort: '',
      address: '',
      ogrn: uuidv4(),
      inn: uuidv4(),
      kpp: null,
      directorNameNominative: '',
      directorNameGenitive: '',
      directorNameShortNominative: '',
      directorNameShortGenitive: '',
      comment: '',
      deleted: false,
      city: null,
    };
  }

  public static getLegalEntityPaymentDefaultData(): ILegalEntityPaymentInputTable {
    return {
      id: uuidv4(),
      owner: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      rs: '',
      ks: '',
      bic: '',
      bank: '',
      comment: '',
      deleted: false,
    };
  }

  public prepareLegalEntityDataToInsert(legalEntityInputData: Partial<TLegalEntityInputTable>) {
    const { timezone } = this.props.context;

    const data: Partial<TLegalEntityInputTable> = {
      ...legalEntityInputData,
      updatedAt: moment.tz(timezone).format(),
    };


    return data;
  }

  public prepareLegalEntityPaymentToInsert(paymentInout: Partial<ILegalEntityPaymentInputTable>) {
    const { timezone } = this.props.context;

    const data: Partial<ILegalEntityPaymentInputTable> = {
      ...paymentInout,
      updatedAt: moment.tz(timezone).format(),
    };


    return data;
  }


  public async getLegalEntities(
    filter: Partial<TOutputFilter>,
  ): Promise<IListResponse<ILegalEntity>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit,
      offset,
      orderBy,
      where,
      search,
    } = filter;

    const connection = await knex
      .select([
        knex.raw('"legalEntities".*'),
        knex.raw('count(*) over() as "totalCount"'),
        knex.raw('string_agg(payments."id"::text, \'|\') as "payments"'),
      ])
      .from<any, ILegalEntityOutputTable[]>('legalEntities')
      .limit(limit || 1)
      .offset(offset || 0)
      .leftJoin('legalEntitiesPayments as payments', (builder) => {
        return builder
          .on('payments.owner', '=', 'legalEntities.id')
          .onIn('payments.deleted', [false]);
      })
      .where((builder) => convertWhereToKnex(builder, where, {
        payments: ['bank', 'bic', 'rs', 'ks', 'owner', 'priority'],
        legalEntities: '*',
      }))
      .where((builder) => builder.where('legalEntities.deleted', 'false'))
      .where((builder) => {
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').forEach((subquery) => {
              builder.orWhere(field, TWhereAction.ILIKE, `%${subquery}%`);
            });
          });
        }

        return builder;
      })
      .orderBy(convertOrderByToKnex(orderBy))
      .groupBy('legalEntities.id')
      .then((nodes) => {
        return {
          totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nodes: nodes.map(({ totalCount, ...nodeData }) => {
            return {
              ...nodeData,
              city: nodeData.city ? { id: nodeData.city } : null,
              payments: nodeData.payments
                ? arrayOfIdsToArrayOfObjectIds(nodeData.payments.split('|'))
                : null,
            };
          }),
        };
      });

    return {
      ...connection,
      offset,
      limit,
      where,
      orderBy,
    };
  }


  public async getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]> {
    const { nodes } = await this.getLegalEntities({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getLegalEntity(id: string): Promise<ILegalEntity | false> {
    const nodes = await this.getLegalEntitiesByIds([id]);
    return nodes.length ? nodes[0] : false;
  }

  public async updateLegalEntity(id: string, legalEntityData: Partial<TLegalEntityInputTable>) {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id, // force set id
      updatedAt: moment.tz(timezone).format(),
    };
    const result = await knex<TLegalEntityInputTable>('legalEntities')
      .update(this.prepareLegalEntityDataToInsert(data))
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntity(
    legalEntityData: Partial<TLegalEntityInputTable>,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id: legalEntityData.id || uuidv4(),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
    };

    const result = await knex<TLegalEntityInputTable>('legalEntities')
      .insert(this.prepareLegalEntityDataToInsert(data))
      .returning('id');

    return result[0];
  }

  public async deleteLegalEntity(id: string) {
    const result = this.updateLegalEntity(id, {
      inn: uuidv4(),
      ogrn: uuidv4(),
      deleted: true,
    });

    return Boolean(result);
  }

  public async restoreLegalEntity(id: string) {
    const result = this.updateLegalEntity(id, {
      deleted: false,
    });

    return Boolean(result);
  }

  public async externalSearchCompanies(
    query: string,
  ): Promise<ILegalEntityExternalSearchResult[] | null> {
    const { context } = this.props;
    const { logger } = context;
    try {
      const response = await fetch(EXTERNAL_SEARCH_API_URL_COMPANIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${EXTERNAL_SEARCH_API_TOKEN}`,
        },
        body: JSON.stringify({
          query,
        }),
      });
      const body = await response.json();

      if (!body || !body.suggestions) {
        return null;
      }


      const suggestions: ILegalEntityExternalSearchResult[] = body.suggestions
        .map((suggestion: any) => {
          const data = suggestion?.data || {};
          const directorNameNominative = String(data?.management?.post).toLowerCase().indexOf('директор') !== -1
            ? String(data?.management?.name)
            : '';

          const directorNameShortNominative = directorNameNominative !== ''
            ? directorNameNominative.split(' ').reduce((prev, current, index) => {
              return index === 0 ? current : `${prev} ${current[0]}.`;
            }, '')
            : '';


          // search city in Geography database
          const cityData = data?.address?.data?.country_iso_code === 'RU'
            ? cities.find((currentCity) => {
              return currentCity.ru.toLowerCase() === String(data?.address?.data?.city)
                .toLowerCase();
            })
            : null;

          const result: ILegalEntityExternalSearchResult = {
            label: data?.name?.short || '',
            nameFull: data?.name?.full_with_opf || '',
            nameShort: data?.name?.short_with_opf || '',
            address: data?.address?.value || '',
            ogrn: data?.ogrn || '',
            kpp: data?.kpp || '',
            inn: data?.inn || '',
            city: cityData ? { id: cityData.id } : null,
            directorNameNominative,
            directorNameShortNominative,
            state: data?.state?.status || 'ACTIVE',
            branchType: data?.branch_type || 'MAIN',
            type: data?.type || 'LEGAL',
            registrationDate: new Date(data?.state?.registration_date || 0),
            liquidationDate: data?.state?.liquidation_date
              ? new Date(data?.state?.liquidation_date || 0)
              : null,
          };

          return result;
        });

      return suggestions;
    } catch (err) {
      logger.server.error(`External API request to ${EXTERNAL_SEARCH_API_URL_PAYMENTS} failure`, {
        err,
      });
      return null;
    }
  }

  public async externalSearchPayments(query: string): Promise<ILegalEntityPayment[] | null> {
    const { context } = this.props;
    const { logger } = context;
    try {
      const response = await fetch(EXTERNAL_SEARCH_API_URL_PAYMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${EXTERNAL_SEARCH_API_TOKEN}`,
        },
        body: JSON.stringify({
          query,
        }),
      });
      const body = await response.json();

      if (!body || !body.suggestions) {
        return null;
      }

      const suggestions: ILegalEntityPayment[] = body.suggestions.map((suggestion: any) => {
        const data = suggestion?.data || {};

        return {
          ...LegalEntitiesService.getLegalEntityPaymentDefaultData(),
          bank: data?.name?.payment || '',
          bic: data?.bic || '',
          ks: data?.correspondent_account || '',
        } as ILegalEntityPayment;
      });

      return suggestions;
    } catch (err) {
      logger.server.error(`External API request to ${EXTERNAL_SEARCH_API_URL_PAYMENTS} failure`, {
        err,
      });
      return null;
    }
  }

  public async getLegalEntityPayments(
    filter: Partial<TOutputFilter>,
  ): Promise<IListResponse<ILegalEntityPayment>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit,
      offset,
      orderBy,
      where,
      search,
    } = filter;

    const connection = await knex
      .select([
        '*',
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, ILegalEntityPaymentOutputTable[]>('legalEntitiesPayments')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => builder.where('deleted', false))
      .where((builder) => {
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').forEach((subquery) => {
              builder.orWhere(field, TWhereAction.ILIKE, `%${subquery}%`);
            });
          });
        }

        return builder;
      })
      .orderBy(convertOrderByToKnex(orderBy))
      .then((nodes) => {
        return {
          totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
          nodes: nodes.map((node) => ({
            ...node,
            owner: typeof node.owner === 'string' ? {
              id: node.owner,
            } : node.owner,
          })),
        };
      });

    return {
      ...connection,
      offset,
      limit,
      where,
      orderBy,
    };
  }


  public async getLegalEntityPaymentsByIds(ids: string[]): Promise<ILegalEntityPayment[]> {
    const { nodes } = await this.getLegalEntityPayments({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getLegalEntityPayment(id: string): Promise<ILegalEntityPayment | false> {
    const nodes = await this.getLegalEntityPaymentsByIds([id]);
    return nodes.length ? nodes[0] : false;
  }

  public async updateLegalEntityPayment(
    id: string,
    paymentData: Partial<ILegalEntityPaymentInputTable>,
  ) {
    const { knex, timezone } = this.props.context;

    const data = {
      ...paymentData,
      id, // force set id
      updatedAt: moment.tz(timezone).format(),
    };
    const result = await knex<ILegalEntityPaymentInputTable>('legalEntitiesPayments')
      .update(this.prepareLegalEntityPaymentToInsert(data))
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntityPayment(
    paymentData: Partial<ILegalEntityPaymentInputTable>,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data = {
      ...paymentData,
      id: paymentData.id || uuidv4(),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
    };

    const result = await knex<ILegalEntityPaymentInputTable>('legalEntitiesPayments')
      .insert(this.prepareLegalEntityPaymentToInsert(data))
      .returning('id');

    return result[0];
  }

  public async deleteLegalEntityPayment(id: string) {
    const result = this.updateLegalEntityPayment(id, {
      deleted: true,
    });

    return Boolean(result);
  }

  public async restoreLegalEntityPayment(id: string) {
    const result = this.updateLegalEntityPayment(id, {
      deleted: false,
    });

    return Boolean(result);
  }
}

interface IProps {
  context: Context;
}

export default LegalEntitiesService;
export { LegalEntitiesService };
