import {
  IContext,
  IListResponse,
  TOutputFilter,
  convertOrderByToKnex,
  convertWhereToKnex,
  TWhereAction,
} from '@via-profit-services/core';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

class LegalEntitiesService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public getLegalEntities(
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

    if (search) {
      where.push([search.field, TWhereAction.ILIKE, `%${search.query}%`]);
    }

    return knex
      .select<any, Array<ILegalEntity & { totalCount: number }>>(['joined.totalCount', 'legalEntities.*'])
      .join(
        knex('legalEntities')
          .select(['id', knex.raw('count(*) over() as "totalCount"')])
          .limit(limit || 1)
          .offset(offset || 0)
          .where((builder) => convertWhereToKnex(builder, where))
          .orderBy(convertOrderByToKnex(orderBy))
          .as('joined'),
        'joined.id',
        'legalEntities.id',
      )
      .orderBy(convertOrderByToKnex(orderBy))
      .from('legalEntities')
      .then((nodes) => ({
        totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
        limit,
        offset,
        nodes,
      }));
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
  context: IContext;
}

export interface ILegalEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  address: string;
  ogrn: string;
  kpp?: string;
  inn: string;
  rs: string;
  ks: string;
  bic: string;
  bank: string;
  directorNameNominative: string;
  directorNameGenitive: string;
  deleted: Boolean;
}


export type ILegalEntityUpdateInfo = Omit<
Partial<ILegalEntityCreateInfo>, 'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  updatedAt: string;
};

export type ILegalEntityCreateInfo = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  updatedAt: string;
  createdAt: string;
};

export default LegalEntitiesService;
export { LegalEntitiesService };
