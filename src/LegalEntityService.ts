import { arrayOfIdsToArrayOfObjectIds, ListResponse, OutputFilter } from '@via-profit-services/core';
import { convertWhereToKnex, convertSearchToKnex, convertOrderByToKnex, extractTotalCountPropOfNode } from '@via-profit-services/knex';
import type {
  LegalEntityServiceProps, LegalEntityService as LegalEntityServiceInterface,
  LegalEntity, CreateEntityProps, UpdateEntityProps, LegalEntityExternalSearchResult,
  LegalEntityPayment, PaymentsTableModelResponse, UpdatePaymentProps, CreatePaymentProps,
  LegalEntitiesTableModel, LegalEntitiesTableModelResponse, PaymentsTableModel,
} from '@via-profit-services/legal-entity';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import '@via-profit-services/geography';

import fetchExternal, { RequestType } from './utils/fetch-external';


class LegalEntitiesService implements LegalEntityServiceInterface {
  public props: LegalEntityServiceProps;

  public constructor(props: LegalEntityServiceProps) {
    this.props = props;
  }

  public async getLegalEntities(
    filter: Partial<OutputFilter>,
    notDeletedOnly?: boolean,
  ): Promise<ListResponse<LegalEntity>> {
    const { context } = this.props;
    const { knex } = context;
    const { limit, offset, orderBy, where, search } = filter;

    const request = knex
      .select([
        knex.raw('"legalEntities".*'),
        knex.raw('count(*) over() as "totalCount"'),
        knex.raw('string_agg(payments."id"::text, \'|\') as "payments"'),
      ])
      .from<LegalEntitiesTableModel, LegalEntitiesTableModelResponse[]>('legalEntities')
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
      .groupBy('legalEntities.id');

    if (notDeletedOnly) {
      request.where('deleted', false);
    }

    const response = await request
      .then((nodes) => nodes.map((node) => ({
        ...node,
        city: node.city ? { id: node.city } : null,
        payments: node.payments
          ? arrayOfIdsToArrayOfObjectIds(node.payments.split('|'))
          : null,
      })))
      .then((nodes) => ({
      ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

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

  public async updateLegalEntity(id: string, legalEntityData: UpdateEntityProps): Promise<void> {
    const { knex, timezone } = this.props.context;

    await knex<LegalEntitiesTableModel>('legalEntities')
      .update({
        ...legalEntityData,
        id, // force set id
        updatedAt: moment.tz(timezone).format(),
      })
      .where('id', id)
      .returning('id');

  }

  public async createLegalEntity(legalEntityData: CreateEntityProps): Promise<string> {
    const { knex, timezone } = this.props.context;

    const result = await knex<LegalEntitiesTableModel>('legalEntities')
      .insert({
          ...legalEntityData,
        id: legalEntityData.id || uuidv4(),
        createdAt: moment.tz(timezone).format(),
        updatedAt: moment.tz(timezone).format(),
      })
      .returning('id');

    return result[0];
  }

  public async deleteLegalEntities(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.updateLegalEntity(id, {
      inn: uuidv4(),
      ogrn: uuidv4(),
      deleted: true,
    })));
  }

  public async deleteLegalEntity(id: string): Promise<void> {
    return this.deleteLegalEntities([id]);
  }

  public async restoreLegalEntity(id: string): Promise<void> {
    await this.updateLegalEntity(id, {
      deleted: false,
    });
  }

  public async externalSearchCompanies(
    query: string,
  ): Promise<LegalEntityExternalSearchResult[] | null> {
    const { context } = this.props;
    const { logger, services } = context;
    try {

      const response = await fetchExternal(RequestType.COMPANY, query);

      if (!response || !response.suggestions) {
        return null;
      }


      const suggestions: LegalEntityExternalSearchResult[] = [...response.suggestions || []]
        .reduce(async (prev, suggestion) => {
          await prev;

          const data = suggestion?.data || {};
          const directorNameNominative = String(data?.management?.post).toLowerCase().indexOf('директор') !== -1
            ? String(data?.management?.name)
            : '';

          const directorNameShortNominative = directorNameNominative !== ''
            ? directorNameNominative.split(' ').reduce((prev, current, index) => index === 0 ? current : `${prev} ${current[0]}.`, '')
            : '';

          const countryISO = data?.address?.data?.country_iso_code || 'RU';
          const cityName = data?.address?.data?.city || 'none';
          const cities = await services.geography.getCities({
            where: [['countryCode', '=', countryISO]],
            search: [{ field: 'ru', query: cityName }],
          });

          const result: LegalEntityExternalSearchResult = {
            label: data?.name?.short || '',
            nameFull: data?.name?.full_with_opf || '',
            nameShort: data?.name?.short_with_opf || '',
            address: data?.address?.value || '',
            ogrn: data?.ogrn || '',
            kpp: data?.kpp || '',
            inn: data?.inn || '',
            city: cities.totalCount ? cities.nodes[0] : null,
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
        }, Promise.resolve);

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
        const payment: LegalEntityPayment = {
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          bank: data?.name?.payment || '',
          priority: 'master',
          bic: data?.bic || '',
          ks: data?.correspondent_account || '',
          rs: '',
          owner: { id: '' },
          comment: '',
          deleted: false,
        }

        return payment;
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
    const { limit, offset, orderBy, where, search } = filter;

    const response = await knex
      .select([
        '*',
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .from<PaymentsTableModel, PaymentsTableModelResponse[]>('legalEntitiesPayments')
      .then((nodes) => nodes.map((node) => ({
        ...node,
        owner: typeof node.owner === 'string' ? { id: node.owner } : node.owner,
      })))

    return {
      ...extractTotalCountPropOfNode(response),
      offset,
      limit,
      where,
      orderBy,
    };
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
    paymentData: UpdatePaymentProps,
  ) {
    const { knex, timezone } = this.props.context;

    const result = await knex<PaymentsTableModel>('legalEntitiesPayments')
      .update({
        ...paymentData,
        id, // force set id
        updatedAt: moment.tz(timezone).format(),
      })
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntityPayment(
    paymentData: CreatePaymentProps,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const result = await knex<PaymentsTableModel>('legalEntitiesPayments')
    .insert({
      ...paymentData,
      id: paymentData.id || uuidv4(),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
    })
    .returning('id');

    return result[0];
  }

  public async deleteLegalEntityPayment(id: string): Promise<boolean> {
    const result = this.updateLegalEntityPayment(id, {
      deleted: true,
    });

    return Boolean(result);
  }

  public async restoreLegalEntityPayment(id: string): Promise<boolean> {
    const result = this.updateLegalEntityPayment(id, {
      deleted: false,
    });

    return Boolean(result);
  }
}


export default LegalEntitiesService;
