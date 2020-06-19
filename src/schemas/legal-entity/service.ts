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
  Context, ILegalEntity, ILegalEntityCreateInfo, ILegalEntityUpdateInfo, ILegalEntityTable,
} from './types';

class LegalEntitiesService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public async getLegalEntities(
    filter: Partial<TOutputFilter>,
    withDeleted?: boolean,
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

    where.push(['deleted', TWhereAction.EQ, withDeleted ? 'true' : 'false']);

    const connection = await knex
      .select([
        '*',
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, ILegalEntityTable[]>('legalEntities')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
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

  public async updateLegalEntity(id: string, legalEntityData: Partial<ILegalEntityUpdateInfo>) {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id, // force set id
      updatedAt: moment.tz(timezone).format(),
    };
    const result = await knex<ILegalEntityUpdateInfo>('legalEntities')
      .update(data)
      .where('id', id)
      .returning('id');

    return result[0];
  }

  public async createLegalEntity(
    legalEntityData: ILegalEntityCreateInfo,
  ): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data = {
      ...legalEntityData,
      id: legalEntityData.id || uuidv4(),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
    };

    const result = await knex<ILegalEntityUpdateInfo>('legalEntities')
      .insert(data)
      .returning('id');

    return result[0];
  }

  public async deleteLegalEntity(id: string) {
    const result = this.updateLegalEntity(id, {
      inn: '',
      deleted: true,
    });

    return Boolean(result);
  }
}

interface IProps {
  context: Context;
}

export default LegalEntitiesService;
export { LegalEntitiesService };
