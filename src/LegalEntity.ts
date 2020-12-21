import { ListResponse, OutputFilter, arrayOfIdsToArrayOfObjectIds } from '@via-profit-services/core';
import cities from '@via-profit-services/geography/dist/countries/RU/cities.json';
import { convertOrderByToKnex, convertWhereToKnex, convertSearchToKnex, extractTotalCountPropOfNode } from '@via-profit-services/knex';
import {
  LegalEntity, LegalEntityPayment, LegalEntityTableModel, LegalEntityTableModelResult,
  LegalEntityExternalSearchResult, LegalEntityPaymentTableMode, LegalEntityPaymentTableModeResult,
  LegalEntitiesServiceProps,
} from '@via-profit-services/legal-entity';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

import fetchExternal, { RequestType } from './utils/fetch-external';


class LegalEntitiesService {
  public props: LegalEntitiesServiceProps;

  public constructor(props: LegalEntitiesServiceProps) {
    this.props = props;
  }

  public getLegalEntityDefaultData(): LegalEntity {
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
      payments: [],
    };
  }

  public getLegalEntityPaymentDefaultData(): LegalEntityPayment {
    return {
      id: uuidv4(),
      owner: {
        id: uuidv4(),
      },
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

  public prepareLegalEntityDataToInsert(
    legalEntityInputData: Partial<LegalEntity>): Partial<LegalEntityTableModel> {
    const { timezone } = this.props.context;

    const data: Partial<LegalEntityTableModel> = {
      ...legalEntityInputData,
      updatedAt: moment.tz(timezone).format(),
      createdAt: legalEntityInputData.createdAt
        ? moment.tz(legalEntityInputData, timezone).format()
        : undefined,
      payments: legalEntityInputData.payments
        ? JSON.stringify(legalEntityInputData.payments)
        : undefined,
      city: legalEntityInputData.city
        ? legalEntityInputData.city.id
        : undefined,
    };

    return data;
  }

  public prepareLegalEntityPaymentToInsert(
    payment: Partial<LegalEntityPayment>): Partial<LegalEntityPaymentTableMode> {
    const { timezone } = this.props.context;

    const data: Partial<LegalEntityPaymentTableMode> = {
      ...payment,
      updatedAt: moment.tz(timezone).format(),
      createdAt: payment.createdAt
        ? moment.tz(payment.createdAt, timezone).format()
        : undefined,
      owner: payment.owner ? payment.owner.id : undefined,
    };


    return data;
  }


  public async getLegalEntities(
    filter: Partial<OutputFilter>,
  ): Promise<ListResponse<LegalEntity>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit,
      offset,
      orderBy,
      where,
      search,
    } = filter;

    const response = await knex
      .select([
        knex.raw('"legalEntities".*'),
        knex.raw('count(*) over() as "totalCount"'),
        knex.raw('string_agg(payments."id"::text, \'|\') as "payments"'),
      ])
      .from<LegalEntityTableModel, LegalEntityTableModelResult[]>('legalEntities')
      .limit(limit || 1)
      .offset(offset || 0)
      .leftJoin('legalEntitiesPayments as payments', (builder) => builder
          .on('payments.owner', '=', 'legalEntities.id')
          .onIn('payments.deleted', [false]))
      .where((builder) => convertWhereToKnex(builder, where, {
        payments: ['bank', 'bic', 'rs', 'ks', 'owner', 'priority'],
        legalEntities: '*',
      }))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .groupBy('legalEntities.id')
      .then((nodes) => extractTotalCountPropOfNode(nodes))
      .then(({ totalCount, nodes }) => ({
        offset,
        limit,
        where,
        orderBy,
        totalCount,
        nodes: nodes.map((node) => ({
          ...node,
          city: node.city? { id: node.city } : null,
          payments: node.payments
          ? arrayOfIdsToArrayOfObjectIds(node.payments.split('|'))
           : null,
        })),
      }))

    return response;
  }


  public async getLegalEntitiesByIds(ids: string[]): Promise<LegalEntity[]> {

    const { nodes } = await this.getLegalEntities({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getLegalEntity(id: string): Promise<LegalEntity | false> {
    const nodes = await this.getLegalEntitiesByIds([id]);

    return nodes.length ? nodes[0] : false;
  }

  public async updateLegalEntity(id: string, legalEntityData: Partial<LegalEntity>) {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id, // force set id
      updatedAt: moment.tz(timezone).toDate(),
    };
    const result = await knex<LegalEntityTableModel>('legalEntities')
      .update(this.prepareLegalEntityDataToInsert(data))
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntity(
    legalEntityData: Partial<LegalEntity>,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id: legalEntityData.id || uuidv4(),
      createdAt: moment.tz(timezone).toDate(),
      updatedAt: moment.tz(timezone).toDate(),
    };

    const result = await knex<LegalEntityTableModel>('legalEntities')
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
  ): Promise<LegalEntityExternalSearchResult[] | null> {
    const { context } = this.props;
    const { logger } = context;
    try {

      const response = await fetchExternal(RequestType.COMPANY, query);

      if (!response || !response.suggestions) {
        return null;
      }

      const suggestions: LegalEntityExternalSearchResult[] = response.suggestions
        .map((suggestion: any) => {
          const data = suggestion?.data || {};
          const directorNameNominative = String(data?.management?.post).toLowerCase().indexOf('директор') !== -1
            ? String(data?.management?.name)
            : '';

          const directorNameShortNominative = directorNameNominative !== ''
            ? directorNameNominative.split(' ').reduce((prev, current, index) => index === 0 ? current : `${prev} ${current[0]}.`, '')
            : '';


          // search city in Geography database
          const cityData = data?.address?.data?.country_iso_code === 'RU'
            // eslint-disable-next-line max-len
            ? cities.find((currentCity) => currentCity.ru.toLowerCase() === String(data?.address?.data?.city)
                .toLowerCase())
            : null;

          const result: LegalEntityExternalSearchResult = {
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
      logger.server.error('External API request of companies search are failure', {
        err,
      });

      return null;
    }
  }

  public async externalSearchPayments(query: string): Promise<LegalEntityPayment[] | null> {
    const { context } = this.props;
    const { logger } = context;
    try {

      const response = await fetchExternal(RequestType.PAYMENTS, query);

      if (!response || !response.suggestions) {
        return null;
      }

      const suggestions: LegalEntityPayment[] = response.suggestions.map((suggestion: any) => {
        const data = suggestion?.data || {};
        const defaultData = this.getLegalEntityPaymentDefaultData();

        return {
          ...defaultData,
          bank: data?.name?.payment || '',
          bic: data?.bic || '',
          ks: data?.correspondent_account || '',
        } as LegalEntityPayment;
      });

      return suggestions;
    } catch (err) {
      logger.server.error('External API request to search payment accounts are failure', {
        err,
      });

      return null;
    }
  }

  public async getLegalEntityPayments(
    filter: Partial<OutputFilter>,
  ): Promise<ListResponse<LegalEntityPayment>> {
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
      .from<LegalEntityPaymentTableMode, LegalEntityPaymentTableModeResult[]>('legalEntitiesPayments')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .then((nodes) => extractTotalCountPropOfNode(nodes))
      .then(({ nodes, totalCount }) => ({
        offset,
        limit,
        where,
        orderBy,
        totalCount,
        nodes: nodes.map((node) => ({
          ...node,
          owner: typeof node.owner === 'string'
            ? { id: node.owner }
            : node.owner,
        })),
      }));

    return connection;
  }


  public async getLegalEntityPaymentsByIds(ids: string[]): Promise<LegalEntityPayment[]> {
    const { nodes } = await this.getLegalEntityPayments({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getLegalEntityPayment(id: string): Promise<LegalEntityPayment | false> {
    const nodes = await this.getLegalEntityPaymentsByIds([id]);

    return nodes.length ? nodes[0] : false;
  }

  public async updateLegalEntityPayment(
    id: string,
    paymentData: Partial<LegalEntityPayment>,
  ) {
    const { knex, timezone } = this.props.context;

    const data = {
      ...paymentData,
      id, // force set id
      updatedAt: moment.tz(timezone).toDate(),
    };
    const result = await knex<LegalEntityPaymentTableMode>('legalEntitiesPayments')
      .update(this.prepareLegalEntityPaymentToInsert(data))
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntityPayment(
    paymentData: Partial<LegalEntityPayment>,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data = {
      ...paymentData,
      id: paymentData.id || uuidv4(),
      createdAt: moment.tz(timezone).toDate(),
      updatedAt: moment.tz(timezone).toDate(),
    };
    const result = await knex<LegalEntityPaymentTableMode>('legalEntitiesPayments')
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


export default LegalEntitiesService;
