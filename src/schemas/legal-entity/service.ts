import {
  IListResponse,
  TOutputFilter,
  convertOrderByToKnex,
  convertWhereToKnex,
  TWhereAction,
} from '@via-profit-services/core';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

import {
  Context, ILegalEntity, TLegalEntityInputTable, ILegalEntityOutputTable,
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
      name: '',
      address: '',
      ogrn: uuidv4(),
      inn: uuidv4(),
      kpp: null,
      rs: '',
      ks: '',
      bic: '',
      bank: '',
      directorNameNominative: '',
      directorNameGenitive: '',
      directorNameShortNominative: '',
      directorNameShortGenitive: '',
      comment: '',
      deleted: false,
    };
  }

  public prepareDataToInsert(legalEntityInputData: Partial<TLegalEntityInputTable>) {
    const { timezone } = this.props.context;

    const driverData: Partial<TLegalEntityInputTable> = {
      ...legalEntityInputData,
      updatedAt: moment.tz(timezone).format(),
    };


    return driverData;
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
        '*',
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, ILegalEntityOutputTable[]>('legalEntities')
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

      .then((nodes) => ({
        totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
        nodes,
      }));

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
      .update(data)
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
      .insert(data)
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
}

interface IProps {
  context: Context;
}

export default LegalEntitiesService;
export { LegalEntitiesService };
