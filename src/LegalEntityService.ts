import { arrayOfIdsToArrayOfObjectIds, ListResponse, OutputFilter } from '@via-profit-services/core';
import { convertWhereToKnex, convertSearchToKnex, convertOrderByToKnex, extractTotalCountPropOfNode } from '@via-profit-services/knex';
import type {
  LegalEntityServiceProps, LegalEntityService as LegalEntityServiceInterface,
  LegalEntity, CreateEntityProps, UpdateEntityProps, LegalEntityExternalSearchResult,
  LegalEntityPayment, PaymentsTableModelResponse, UpdatePaymentProps, CreatePaymentProps,
  LegalEntitiesTableModel, LegalEntitiesTableModelResponse, PaymentsTableModel,
  LegalEntityCreateOrUpdateProps, ReplaceEntityProps, ReplaceEntityResult,
  ReplaceEntityPaymentsProps, PaymentCreateOrUpdateProps, ReplacePaymentResult,
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

  public async getLegalEntities(filter: Partial<OutputFilter>): Promise<ListResponse<LegalEntity>> {
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
      .leftJoin('legalEntitiesPayments as payments', 'payments.owner', 'legalEntities.id')
      .where((builder) => convertWhereToKnex(builder, where, {
        payments: ['bank', 'bic', 'rs', 'ks', 'owner', 'priority'],
        legalEntities: '*',
      }))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .groupBy('legalEntities.id');

    const response = await request
      .then((nodes) => nodes.map((node) => ({
        ...node,
        city: node.city ? { id: node.city } : null,
        payments: node.payments
          ? arrayOfIdsToArrayOfObjectIds(node.payments.split('|'))
          : null,
        entity: !node.entity ? null : {
          id: node.entity,
        },
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

  public async updateLegalEntity(id: string, legalEntityData: UpdateEntityProps): Promise<string> {
    const { context } = this.props;
    const { knex, timezone } = context;

    await knex<LegalEntitiesTableModel>('legalEntities')
      .update({
        ...legalEntityData,
        updatedAt: moment.tz(timezone).format(),
      }).where({ id });

    return id;
  }

  public async createLegalEntity(legalEntityData: CreateEntityProps): Promise<string> {
    const defaultEntityData = this.getDefaultEntityRecord();
    const entities = [legalEntityData].map((data) => ({
      ...defaultEntityData,
      ...data,
    }));
    const insertedIDs = await this.createOrUpdateEntities(entities);

    return insertedIDs[0];
  }

  public async deleteLegalEntities(ids: string[]): Promise<void> {
    const { context } = this.props;
    const { knex } = context;

    await knex<LegalEntitiesTableModel>('legalEntities')
      .del()
      .whereIn('id', ids);
  }

  public async deleteLegalEntity(id: string): Promise<void> {
    return this.deleteLegalEntities([id]);
  }

  public async deleteLegalEntityPayments(ids: string[]): Promise<void> {
    const { context } = this.props;
    const { knex } = context;

    await knex<PaymentsTableModel>('legalEntitiesPayments')
      .del()
      .whereIn('id', ids);
  }

  public async deleteLegalEntityPayment(id: string): Promise<void> {
    return this.deleteLegalEntityPayments([id]);
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


  public async rebaseTypes(types: string[]): Promise<void> {
    const { context } = this.props;
    const { knex } = context;

    const payload = types.map((type) => ({ type }));
    await knex.raw(`${knex('legalEntitiesTypes').insert(payload).toString()} on conflict ("type") do nothing;`);
    await knex('legalEntitiesTypes').del().whereNotIn('type', types);
  }

  public getDefaultEntityRecord(): LegalEntitiesTableModel {
    const { timezone } = this.props.context;

    const createdAt = moment.tz(timezone).format();
    const data: LegalEntitiesTableModel = {
      createdAt,
      updatedAt: createdAt,
      id: uuidv4(),
      entity: '',
      type: '',
      label: '',
      address: '',
      ogrn: '',
      kpp: '',
      inn: '',
      directorNameNominative: '',
      directorNameGenitive: '',
      directorNameShortNominative: '',
      directorNameShortGenitive: '',
      nameShort: '',
      nameFull: '',
      city: '',
      comment: '',
    };

    return data;
  }

  public getDefaultPaymentRecord(): PaymentsTableModel {
    const { timezone } = this.props.context;

    const createdAt = moment.tz(timezone).format();
    const data: PaymentsTableModel = {
      createdAt,
      updatedAt: createdAt,
      id: uuidv4(),
      owner: '',
      rs: '',
      ks: '',
      bic: '',
      bank: '',
      priority: 'master',
      comment: '',
    };

    return data;
  }

  public prepareEntityDataToInsert(
    input: CreateEntityProps | UpdateEntityProps,
    ): LegalEntitiesTableModel {
    const data: LegalEntitiesTableModel = {
      ...this.getDefaultEntityRecord(),
      ...input,
    };

    return data;
  }
  public preparePaymentDataToInsert(
    input: CreatePaymentProps | UpdatePaymentProps,
  ): PaymentsTableModel {
    const data: PaymentsTableModel = {
      ...this.getDefaultPaymentRecord(),
      ...input,
    };

    return data;
  }

  public async getLegalEntitiesByEntities(
    entitiesIDs: string[],
  ): Promise<ListResponse<LegalEntity>> {
    const list = await this.getLegalEntities({
      limit: Number.MAX_SAFE_INTEGER,
      where: [
        ['entity', 'in', entitiesIDs],
      ],
    });

    return list;
  }

  public async getLegalEntitiesByEntity(entityID: string): Promise<ListResponse<LegalEntity>> {
    return this.getLegalEntitiesByEntities([entityID]);
  }

  public async createOrUpdateEntities (
    entities: LegalEntityCreateOrUpdateProps[],
  ): Promise<string[]> {
    const { context } = this.props;
    const { knex, timezone } = context;

    const createdAt = moment.tz(timezone).toDate();
    const prepared = entities.map((entity) => ({
      ...this.prepareEntityDataToInsert(entity),
      createdAt,
      updatedAt: createdAt,
    }));

    const response = await knex.raw(
      `${knex('legalEntities').insert(prepared).toQuery()} \
      on conflict ("id") do update set \
        "updatedAt" = excluded."updatedAt",\
        "entity" = excluded."entity",\
        "type" = excluded."type",\
        "label" = excluded."label",\
        "address" = excluded."address",\
        "ogrn" = excluded."ogrn",\
        "kpp" = excluded."kpp",\
        "inn" = excluded."inn",\
        "directorNameNominative" = excluded."directorNameNominative",\
        "directorNameGenitive" = excluded."directorNameGenitive",\
        "directorNameShortNominative" = excluded."directorNameShortNominative",\
        "directorNameShortGenitive" = excluded."directorNameShortGenitive",\
        "nameShort" = excluded."nameShort",\
        "nameFull" = excluded."nameFull",\
        "city" = excluded."city",\
        "comment" = excluded."comment"
      returning id;`,
    );

    return (response as {rows: Array<{id: string}>})
      .rows
      .map(({ id }) => id);
  }

  public async replaceEntities (
    entity: string,
    legalEntities: ReplaceEntityProps[],
  ): Promise<ReplaceEntityResult> {

    const oldData = await this.getLegalEntitiesByEntity(entity);
    const dataToReplace = legalEntities.map((legalEntity) => {
      const oldLegalEntityData = oldData.nodes.find(({ id }) => id === legalEntity.id);
      const {
        label,
        address,
        ogrn,
        type,
        kpp,
        inn,
        directorNameNominative,
        directorNameGenitive,
        directorNameShortNominative,
        directorNameShortGenitive,
        nameShort,
        nameFull,
        comment,
      } = oldLegalEntityData || this.getDefaultEntityRecord();

      const d: LegalEntityCreateOrUpdateProps = {
        label,
        address,
        ogrn,
        type,
        kpp,
        inn,
        directorNameNominative,
        directorNameGenitive,
        directorNameShortNominative,
        directorNameShortGenitive,
        nameShort,
        nameFull,
        city: legalEntity.city || oldLegalEntityData.city.id,
        comment,
        ...legalEntity,
        entity,
      };

      return d;
    });

    const newEntityIdsOfThisEntity = await this.createOrUpdateEntities(dataToReplace);

    const iDsToDelete = oldData.nodes
      .filter(({ id }) => !newEntityIdsOfThisEntity.includes(id))
      .map(({ id }) => id);

    await this.deleteLegalEntities(iDsToDelete);

    return {
      deleted: iDsToDelete,
      persistens: newEntityIdsOfThisEntity,
      affected: iDsToDelete.concat(newEntityIdsOfThisEntity),
    };
  }

  public async createOrUpdatePayments (payments: PaymentCreateOrUpdateProps[]): Promise<string[]> {
    const { context } = this.props;
    const { knex, timezone } = context;

    const createdAt = moment.tz(timezone).toDate();
    const prepared = payments.map((payment) => ({
      ...this.preparePaymentDataToInsert(payment),
      createdAt,
      updatedAt: createdAt,
    }));

    const response = await knex.raw(
      `${knex('legalEntitiesPayments').insert(prepared).toQuery()} \
      on conflict ("id") do update set \
        "updatedAt" = excluded."updatedAt",\
        "owner" = excluded."owner",\
        "id" = excluded."id",\
        "rs" = excluded."rs",\
        "ks" = excluded."ks",\
        "bic" = excluded."bic",\
        "bank" = excluded."bank",\
        "comment" = excluded."comment",\
        "priority" = excluded."priority"      
      returning id;`,
    );

    return (response as {rows: Array<{id: string}>})
      .rows
      .map(({ id }) => id);
  }

  public async replacePayments (
    owner: string,
    payments: ReplaceEntityPaymentsProps[],
  ): Promise<ReplacePaymentResult> {

    const oldPayments = await this.getLegalEntityPayments({
      where: [['owner', '=', owner]],
    });
    const dataToReplace = payments.map((payment) => {
      const oldPaymentData = oldPayments.nodes.find(({ id }) => id === payment.id);
      const {
        rs,
        ks,
        bic,
        bank,
        priority,
        comment,
      } = oldPaymentData || this.getDefaultPaymentRecord();

      const d: PaymentCreateOrUpdateProps = {
        rs,
        ks,
        bic,
        bank,
        priority,
        comment,
        ...payment,
        owner,
      };

      return d;
    });

    const newPaymenIdsOfThisEntity = await this.createOrUpdatePayments(dataToReplace);

    const iDsToDelete = oldPayments.nodes
      .filter(({ id }) => !newPaymenIdsOfThisEntity.includes(id))
      .map(({ id }) => id);

    await this.deleteLegalEntities(iDsToDelete);

    return {
      deleted: iDsToDelete,
      persistens: newPaymenIdsOfThisEntity,
      affected: iDsToDelete.concat(newPaymenIdsOfThisEntity),
    };
  }
}


export default LegalEntitiesService;
